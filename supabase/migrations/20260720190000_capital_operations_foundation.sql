-- =============================================================================
-- Capital Operations Foundation
-- 2026-07-20
-- =============================================================================
-- Creates tables required for capital allocation requests, withdrawal address
-- book, provider event log, and transfer aliases. Also hardens the existing
-- wallet_transactions and custody_addresses tables:
--   • Adds pending_review status to wallet_transactions
--   • Adds provider lifecycle statuses to custody_addresses
--   • Replaces direct authenticated INSERT policies with SECURITY DEFINER
--     functions that enforce ownership and balance checks server-side
--
-- Apply to staging first. Do NOT apply to production without review.
-- Run dry-run: supabase db push --dry-run
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Extend wallet_transactions status to include pending_review
--    pending_review = submitted by the user, awaiting operations approval
--    The existing inline CHECK constraint has no user-supplied name, so
--    PostgreSQL auto-named it wallet_transactions_status_check.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  _constraint_name text;
BEGIN
  SELECT conname
    INTO _constraint_name
    FROM pg_constraint
   WHERE conrelid = 'public.wallet_transactions'::regclass
     AND contype = 'c'
     AND pg_get_constraintdef(oid) ILIKE '%status%';

  IF _constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.wallet_transactions DROP CONSTRAINT %I', _constraint_name);
  END IF;

  ALTER TABLE public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_status_check
    CHECK (status IN ('pending', 'pending_review', 'completed', 'failed', 'cancelled'));
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Extend custody_addresses status for provider lifecycle
--    pending_activation = address issued by provider, not yet confirmed live
--    suspended          = temporarily disabled by provider or operations
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  _constraint_name text;
BEGIN
  SELECT conname
    INTO _constraint_name
    FROM pg_constraint
   WHERE conrelid = 'public.custody_addresses'::regclass
     AND contype = 'c'
     AND pg_get_constraintdef(oid) ILIKE '%status%';

  IF _constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.custody_addresses DROP CONSTRAINT %I', _constraint_name);
  END IF;

  ALTER TABLE public.custody_addresses
    ADD CONSTRAINT custody_addresses_status_check
    CHECK (status IN ('active', 'pending_activation', 'suspended', 'retired'));
END;
$$;

-- Add idempotency key support to wallet_transactions
ALTER TABLE public.wallet_transactions
  ADD COLUMN IF NOT EXISTS idempotency_key text;

CREATE UNIQUE INDEX IF NOT EXISTS wallet_transactions_idempotency_key_idx
  ON public.wallet_transactions (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 3. Remove direct authenticated INSERT policies from ledger tables
--    Writes now go through SECURITY DEFINER functions below, which enforce
--    ownership and (for withdrawals) available-balance checks that a plain
--    RLS policy cannot express without trusting client-supplied amounts.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "wallet_transactions_insert_own" ON public.wallet_transactions;
DROP POLICY IF EXISTS "custody_addresses_insert_own" ON public.custody_addresses;

-- ---------------------------------------------------------------------------
-- 4. SECURITY DEFINER: request_wallet_withdrawal
--    Creates a pending_review withdrawal record after validating:
--      • caller is authenticated
--      • wallet belongs to caller
--      • amount > 0
--      • available completed balance covers the amount
--      • idempotency key deduplicated (if provided)
--    Does NOT move real funds — creates a pending_review record for
--    operations to review and reconcile against real bank activity.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.request_wallet_withdrawal(
  p_wallet_id        uuid,
  p_asset            text,
  p_network          text,
  p_amount           numeric,
  p_destination      text,
  p_idempotency_key  text DEFAULT NULL
)
RETURNS public.wallet_transactions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  _caller_id       uuid;
  _wallet_owner_id uuid;
  _available       numeric;
  _existing        public.wallet_transactions%ROWTYPE;
  _new_row         public.wallet_transactions%ROWTYPE;
BEGIN
  -- Require authenticated session
  _caller_id := auth.uid();
  IF _caller_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '42501';
  END IF;

  -- Verify wallet ownership
  SELECT profile_id INTO _wallet_owner_id
    FROM public.wallets
   WHERE id = p_wallet_id;

  IF _wallet_owner_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found' USING ERRCODE = 'P0002';
  END IF;

  IF _wallet_owner_id <> _caller_id THEN
    RAISE EXCEPTION 'Wallet does not belong to the authenticated user' USING ERRCODE = '42501';
  END IF;

  -- Validate amount
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'Withdrawal amount must be greater than zero' USING ERRCODE = '22003';
  END IF;

  -- Validate destination
  IF p_destination IS NULL OR trim(p_destination) = '' THEN
    RAISE EXCEPTION 'Destination is required' USING ERRCODE = '23502';
  END IF;

  -- Idempotency check — return existing record if key already used
  IF p_idempotency_key IS NOT NULL THEN
    SELECT * INTO _existing
      FROM public.wallet_transactions
     WHERE idempotency_key = p_idempotency_key
     LIMIT 1;

    IF FOUND THEN
      RETURN _existing;
    END IF;
  END IF;

  -- Compute available balance from completed transactions only
  -- (pending and pending_review are not yet settled)
  SELECT COALESCE(
    SUM(CASE WHEN type = 'deposit' THEN amount ELSE -amount END),
    0
  )
    INTO _available
    FROM public.wallet_transactions
   WHERE wallet_id = p_wallet_id
     AND asset     = p_asset
     AND network   = p_network
     AND status    = 'completed'
     AND type      IN ('deposit', 'withdrawal');

  IF p_amount > _available THEN
    RAISE EXCEPTION 'Insufficient available balance. Available: %, requested: %',
      _available, p_amount
    USING ERRCODE = '23514';
  END IF;

  -- Insert as pending_review — operations must approve before funds move
  INSERT INTO public.wallet_transactions (
    wallet_id,
    profile_id,
    type,
    asset,
    network,
    amount,
    status,
    counterparty,
    idempotency_key
  ) VALUES (
    p_wallet_id,
    _caller_id,
    'withdrawal',
    p_asset,
    p_network,
    p_amount,
    'pending_review',
    trim(p_destination),
    p_idempotency_key
  )
  RETURNING * INTO _new_row;

  RETURN _new_row;
END;
$$;

-- Grant execution to authenticated users only (not anon/public)
REVOKE ALL ON FUNCTION public.request_wallet_withdrawal(uuid, text, text, numeric, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.request_wallet_withdrawal(uuid, text, text, numeric, text, text) TO authenticated;

-- ---------------------------------------------------------------------------
-- 5. SECURITY DEFINER: provision_deposit_address
--    Creates an internal funding reference (wire reference code, not a
--    blockchain address) after validating wallet ownership.
--    No funds move — the reference is used to match incoming wire transfers
--    manually by operations.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.provision_deposit_address(
  p_wallet_id  uuid,
  p_asset      text,
  p_network    text
)
RETURNS public.custody_addresses
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  _caller_id       uuid;
  _wallet_owner_id uuid;
  _reference       text;
  _new_row         public.custody_addresses%ROWTYPE;
BEGIN
  _caller_id := auth.uid();
  IF _caller_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '42501';
  END IF;

  SELECT profile_id INTO _wallet_owner_id
    FROM public.wallets
   WHERE id = p_wallet_id;

  IF _wallet_owner_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found' USING ERRCODE = 'P0002';
  END IF;

  IF _wallet_owner_id <> _caller_id THEN
    RAISE EXCEPTION 'Wallet does not belong to the authenticated user' USING ERRCODE = '42501';
  END IF;

  -- Generate a human-readable funding reference
  -- Format: NLM-XXXXXXXX (8 uppercase hex chars from a UUID fragment)
  _reference := 'NLM-' || upper(substring(gen_random_uuid()::text, 1, 8));

  INSERT INTO public.custody_addresses (
    wallet_id,
    profile_id,
    provider,
    asset,
    network,
    address,
    status
  ) VALUES (
    p_wallet_id,
    _caller_id,
    'internal',
    p_asset,
    p_network,
    _reference,
    'active'
  )
  RETURNING * INTO _new_row;

  RETURN _new_row;
END;
$$;

REVOKE ALL ON FUNCTION public.provision_deposit_address(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.provision_deposit_address(uuid, text, text) TO authenticated;

-- ---------------------------------------------------------------------------
-- 6. capital_allocation_requests
--    User-submitted requests to allocate capital from a wallet to a portfolio.
--    Created as pending_review; approved/rejected/executed by operations.
--    Users cannot mark their own requests as approved or executed.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.capital_allocation_requests (
  "id"               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "profile_id"       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "wallet_id"        uuid NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  "portfolio_id"     uuid REFERENCES public.investment_portfolios(id) ON DELETE SET NULL,
  "asset"            text NOT NULL,
  "network"          text NOT NULL,
  "amount"           numeric NOT NULL CHECK (amount > 0),
  "status"           text NOT NULL DEFAULT 'pending_review'
                       CHECK (status IN ('pending_review', 'approved', 'rejected', 'executed', 'cancelled')),
  "notes"            text,
  "idempotency_key"  text UNIQUE,
  "reviewed_by"      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  "reviewed_at"      timestamp with time zone,
  "created_at"       timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.capital_allocation_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "capital_allocation_requests_select_own"
  ON public.capital_allocation_requests
  FOR SELECT
  USING (auth.uid() = profile_id);

-- Users can submit their own requests only; status is forced to pending_review
-- via the CHECK constraint default — they cannot set approved/executed directly
CREATE POLICY "capital_allocation_requests_insert_own"
  ON public.capital_allocation_requests
  FOR INSERT
  WITH CHECK (
    auth.uid() = profile_id
    AND status = 'pending_review'
  );

-- Users may cancel their own pending_review requests only
CREATE POLICY "capital_allocation_requests_cancel_own"
  ON public.capital_allocation_requests
  FOR UPDATE
  USING (auth.uid() = profile_id AND status = 'pending_review')
  WITH CHECK (status = 'cancelled');

CREATE INDEX IF NOT EXISTS idx_capital_allocation_requests_profile_id
  ON public.capital_allocation_requests (profile_id);

CREATE INDEX IF NOT EXISTS idx_capital_allocation_requests_status
  ON public.capital_allocation_requests (status);

-- ---------------------------------------------------------------------------
-- 7. withdrawal_addresses
--    Address book of known counterparties for withdrawals.
--    Users manage their own saved destinations; no financial execution.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.withdrawal_addresses (
  "id"           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "profile_id"   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "label"        text NOT NULL,
  "asset"        text NOT NULL,
  "network"      text NOT NULL,
  "destination"  text NOT NULL,
  "verified_at"  timestamp with time zone,
  "created_at"   timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.withdrawal_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "withdrawal_addresses_select_own"
  ON public.withdrawal_addresses
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "withdrawal_addresses_insert_own"
  ON public.withdrawal_addresses
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "withdrawal_addresses_update_own"
  ON public.withdrawal_addresses
  FOR UPDATE USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "withdrawal_addresses_delete_own"
  ON public.withdrawal_addresses
  FOR DELETE USING (auth.uid() = profile_id);

CREATE INDEX IF NOT EXISTS idx_withdrawal_addresses_profile_id
  ON public.withdrawal_addresses (profile_id);

-- ---------------------------------------------------------------------------
-- 8. provider_events
--    Append-only log of events received from external custody providers
--    (webhooks, polling results, callback confirmations). Service role only.
--    Authenticated users can read events for their own wallet; cannot write.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.provider_events (
  "id"            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "provider_id"   text NOT NULL,
  "event_type"    text NOT NULL,
  "wallet_id"     uuid REFERENCES public.wallets(id) ON DELETE SET NULL,
  "transaction_id" uuid REFERENCES public.wallet_transactions(id) ON DELETE SET NULL,
  "payload"       jsonb NOT NULL DEFAULT '{}',
  "processed_at"  timestamp with time zone,
  "created_at"    timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.provider_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "provider_events_select_own"
  ON public.provider_events
  FOR SELECT
  USING (
    wallet_id IN (
      SELECT id FROM public.wallets WHERE profile_id = auth.uid()
    )
  );

-- Only service role may insert provider events (no authenticated user write)
CREATE POLICY "provider_events_service_role_insert"
  ON public.provider_events
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_provider_events_wallet_id
  ON public.provider_events (wallet_id);

CREATE INDEX IF NOT EXISTS idx_provider_events_event_type
  ON public.provider_events (event_type);

-- ---------------------------------------------------------------------------
-- 9. transfer_aliases
--    Human-readable alias handles (@handle) that map to real wallet
--    destinations for alias-based transfers between accounts.
--    Alias-to-destination resolution must be server-validated; clients never
--    resolve aliases directly.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transfer_aliases (
  "id"           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "profile_id"   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "alias"        text NOT NULL,
  "label"        text,
  "asset"        text NOT NULL,
  "network"      text NOT NULL,
  "destination"  text NOT NULL,
  "verified_at"  timestamp with time zone,
  "created_at"   timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT transfer_aliases_alias_unique UNIQUE (alias, asset, network)
);

ALTER TABLE public.transfer_aliases ENABLE ROW LEVEL SECURITY;

-- Aliases are publicly resolvable (read-only) so transfers can look up
-- recipients — but only verified ones
CREATE POLICY "transfer_aliases_select_verified"
  ON public.transfer_aliases
  FOR SELECT
  USING (verified_at IS NOT NULL OR auth.uid() = profile_id);

CREATE POLICY "transfer_aliases_insert_own"
  ON public.transfer_aliases
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "transfer_aliases_update_own"
  ON public.transfer_aliases
  FOR UPDATE USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "transfer_aliases_delete_own"
  ON public.transfer_aliases
  FOR DELETE USING (auth.uid() = profile_id);

CREATE INDEX IF NOT EXISTS idx_transfer_aliases_profile_id
  ON public.transfer_aliases (profile_id);

CREATE INDEX IF NOT EXISTS idx_transfer_aliases_alias
  ON public.transfer_aliases (alias);

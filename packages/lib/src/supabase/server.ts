import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for secure backend operations.
 * Uses the service role key and should never be exposed to the browser.
 */
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false
    }
  }
);

import { Wallet as WalletIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, EmptyState, StatCard } from "@netlium/ui";
import { createSupabaseServerClient } from "@netlium/lib/supabase/server";
import { InternalLedgerCustodyProvider } from "@netlium/lib";
import { requireProvisionedUser } from "@/lib/auth";
import { DepositAddressCard } from "./DepositAddressCard";
import { GenerateAddressButton, type AssetNetworkPair } from "./GenerateAddressButton";
import { WithdrawalForm } from "./WithdrawalForm";
import { TransactionList } from "./TransactionList";

export default async function WalletPage() {
  const { profile } = await requireProvisionedUser();
  const supabase = await createSupabaseServerClient();

  const { data: wallet } = await supabase.from("wallets").select("id").eq("profile_id", profile.id).maybeSingle();

  if (!wallet) {
    return (
      <div className="space-y-8 py-8">
        <div>
          <h1 className="text-[18px] font-semibold tracking-[-0.01em] text-text-primary">Neptlium Wallet</h1>
        </div>
        <Card>
          <EmptyState
            icon={<WalletIcon className="size-5" aria-hidden="true" />}
            title="Wallet not yet provisioned"
            description="Complete account provisioning to activate your wallet."
          />
        </Card>
      </div>
    );
  }

  const provider = new InternalLedgerCustodyProvider(supabase);
  const [balances, addresses, transactions, assets] = await Promise.all([
    provider.getBalances(wallet.id),
    provider.listDepositAddresses(wallet.id),
    provider.listTransactions(wallet.id),
    provider.listSupportedAssets()
  ]);

  const pairs: readonly AssetNetworkPair[] = (
    await Promise.all(
      assets.map(async (asset) => {
        const networks = await provider.listSupportedNetworks(asset.code);
        return networks.map((network) => ({
          assetCode: asset.code,
          assetLabel: asset.label,
          networkCode: network.code,
          networkLabel: network.label
        }));
      })
    )
  ).flat();

  const cashBalance = balances.reduce((s, b) => s + b.amount, 0);
  const pendingCount = transactions.filter(
    (transaction) => transaction.status === "pending" || transaction.status === "pending_review"
  ).length;

  return (
    <div className="space-y-6 py-4">
      <div>
        <h1 className="text-[18px] font-semibold tracking-[-0.01em] text-text-primary">Neptlium Wallet</h1>
        <p className="mt-1 text-[13px] text-text-muted">
          Funding references, withdrawals, and transaction history
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total balance"
          value={`$${cashBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        />
        <StatCard label="Pending activity" value={String(pendingCount)} />
        <StatCard label="Funding references" value={String(addresses.length)} />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Deposit references</CardTitle>
          <GenerateAddressButton pairs={pairs} />
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <EmptyState
              icon={<WalletIcon className="size-5" aria-hidden="true" />}
              title="No deposit references yet"
              description="Generate a funding reference to receive a wire transfer."
            />
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <DepositAddressCard key={address.id} address={address} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request withdrawal</CardTitle>
        </CardHeader>
        <CardContent>
          <WithdrawalForm pairs={pairs} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction history</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <EmptyState title="No wallet transactions yet" />
          ) : (
            <TransactionList transactions={transactions} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

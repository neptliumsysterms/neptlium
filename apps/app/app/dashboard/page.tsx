import Link from "next/link";
import {
  ArrowRight,
  ArrowLeftRight,
  Briefcase,
  FileText,
  SlidersHorizontal,
  Wallet as WalletIcon
} from "lucide-react";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  StatCard
} from "@netlium/ui";
import { createSupabaseServerClient } from "@netlium/lib/supabase/server";
import { InternalLedgerCustodyProvider } from "@netlium/lib";
import { requireProvisionedUser } from "@/lib/auth";

function greeting(name: string | null): string {
  const hour = new Date().getUTCHours();
  const part = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return name ? `${part}, ${name.split(" ")[0]}` : part;
}

export default async function DashboardPage() {
  const { user, profile } = await requireProvisionedUser();
  const supabase = await createSupabaseServerClient();

  const firstName = profile?.fullName?.split(" ")[0] ?? null;

  // Fetch wallet, portfolio, and recent transactions in parallel
  const [walletResult, portfolioResult] = await Promise.all([
    supabase.from("wallets").select("id").eq("profile_id", profile.id).maybeSingle(),
    supabase
      .from("investment_portfolios")
      .select("id, name, status")
      .eq("profile_id", profile.id)
      .maybeSingle()
  ]);

  const wallet = walletResult.data;
  const portfolio = portfolioResult.data;

  let totalValue = 0;
  let pendingCount = 0;
  let activeHoldings = 0;
  let recentTransactions: Array<{
    id: string;
    type: string;
    asset: string;
    network: string;
    amount: number;
    status: string;
    created_at: string;
  }> = [];

  if (wallet) {
    const provider = new InternalLedgerCustodyProvider(supabase);
    const [balances, transactions] = await Promise.all([
      provider.getBalances(wallet.id),
      provider.listTransactions(wallet.id)
    ]);

    totalValue = balances.reduce((sum, b) => sum + b.amount, 0);
    activeHoldings = balances.filter((b) => b.amount > 0).length;
    pendingCount = transactions.filter(
      (t) => t.status === "pending" || t.status === "pending_review"
    ).length;
    recentTransactions = transactions.slice(0, 5).map((t) => ({
      id: t.id,
      type: t.type,
      asset: t.asset,
      network: t.network,
      amount: t.amount,
      status: t.status,
      created_at: t.createdAt
    }));
  }

  const complianceActive = profile?.complianceStatus === "active";

  const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "neutral"> = {
    completed: "success",
    pending: "warning",
    pending_review: "warning",
    failed: "danger",
    cancelled: "neutral"
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Greeting + account state                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-text-primary">
            {greeting(firstName)}
          </h1>
          <p className="mt-0.5 text-body-sm text-text-secondary">
            {profile?.email ?? user.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {complianceActive ? (
            <Badge tone="success">Verified</Badge>
          ) : (
            <Badge tone="warning">Pending verification</Badge>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* KPI cards                                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Wallet value"
          value={
            wallet
              ? `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : "—"
          }
          icon={<WalletIcon className="size-4" />}
        />
        <StatCard
          label="Active holdings"
          value={wallet ? String(activeHoldings) : "—"}
          icon={<Briefcase className="size-4" />}
        />
        <StatCard
          label="Pending activity"
          value={wallet ? String(pendingCount) : "—"}
          icon={<ArrowLeftRight className="size-4" />}
        />
        <StatCard
          label="Portfolio"
          value={portfolio?.name ?? "None"}
          icon={<SlidersHorizontal className="size-4" />}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main content grid                                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid gap-4 lg:grid-cols-[1fr,320px]">
        {/* Recent activity */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-[14px]">Recent Activity</CardTitle>
            <Link
              href="/dashboard/transactions"
              className="flex items-center gap-1 text-body-sm text-accent-primary hover:underline"
            >
              View all <ArrowRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {recentTransactions.length === 0 ? (
              <EmptyState
                icon={<ArrowLeftRight className="size-4" />}
                title="No transactions yet"
                description="Activity will appear here once your wallet begins moving capital."
                className="py-8"
              />
            ) : (
              <div className="divide-y divide-border-hairline">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-3 text-body-sm"
                  >
                    <div className="min-w-0">
                      <p className="capitalize text-text-primary">{tx.type}</p>
                      <p className="text-[11px] text-text-muted">
                        {tx.asset} &middot; {tx.network} &middot;{" "}
                        {new Date(tx.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric"
                        })}
                      </p>
                    </div>
                    <div className="ml-4 flex shrink-0 items-center gap-3">
                      <span className="font-mono text-text-primary">
                        {tx.type === "withdrawal" ? "−" : "+"}
                        {tx.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                      <Badge tone={STATUS_TONE[tx.status] ?? "neutral"}>
                        {tx.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-4">
          {/* Portfolio summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[14px]">Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {portfolio ? (
                <div className="space-y-2">
                  <p className="text-body font-medium text-text-primary">{portfolio.name}</p>
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-text-muted">Status</span>
                    <Badge tone={portfolio.status === "active" ? "success" : "neutral"}>
                      {portfolio.status}
                    </Badge>
                  </div>
                  <Link
                    href="/dashboard/portfolio"
                    className="mt-2 flex items-center gap-1 text-body-sm text-accent-primary hover:underline"
                  >
                    View portfolio <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              ) : (
                <EmptyState
                  icon={<Briefcase className="size-4" />}
                  title="No portfolio"
                  description="Complete onboarding to configure your portfolio."
                  className="py-6"
                />
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[14px]">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {[
                  { label: "View wallet", href: "/dashboard/wallet", icon: WalletIcon },
                  { label: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
                  { label: "Documents", href: "/dashboard/documents", icon: FileText },
                  { label: "Settings", href: "/dashboard/settings", icon: SlidersHorizontal }
                ].map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2.5 rounded-md px-2 py-2 text-body-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
                  >
                    <Icon className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
                    {label}
                    <ArrowRight className="ml-auto size-3.5 text-text-muted" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance notice */}
          {!complianceActive && (
            <Card>
              <CardContent className="p-4">
                <p className="text-body-sm font-medium text-text-primary">
                  Account verification pending
                </p>
                <p className="mt-1 text-body-sm text-text-muted">
                  Capital allocation is unavailable until your account is verified by the
                  operations team.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

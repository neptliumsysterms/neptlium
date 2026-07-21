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
    <div className="space-y-5">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold tracking-[-0.01em] text-text-primary">
            {greeting(firstName)}
          </h1>
          <p className="mt-0.5 text-[13px] text-text-muted">
            {profile?.email ?? user.email}
          </p>
        </div>
        <div>
          {complianceActive ? (
            <Badge tone="success">Verified</Badge>
          ) : (
            <Badge tone="warning">Pending verification</Badge>
          )}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Wallet value"
          value={
            wallet
              ? `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : "—"
          }
          icon={<WalletIcon className="size-3.5" />}
        />
        <StatCard
          label="Active holdings"
          value={wallet ? String(activeHoldings) : "—"}
          icon={<Briefcase className="size-3.5" />}
        />
        <StatCard
          label="Pending activity"
          value={wallet ? String(pendingCount) : "—"}
          icon={<ArrowLeftRight className="size-3.5" />}
        />
        <StatCard
          label="Portfolio"
          value={portfolio?.name ?? "None"}
          icon={<SlidersHorizontal className="size-3.5" />}
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-3 lg:grid-cols-[1fr,288px]">
        {/* Recent activity */}
        <Card>
          <CardHeader className="flex-row items-center justify-between py-3">
            <CardTitle>Recent Activity</CardTitle>
            <Link
              href="/dashboard/transactions"
              className="flex items-center gap-1 text-[12px] font-medium text-accent-primary hover:underline"
            >
              View all <ArrowRight className="size-3" />
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
                    className="flex items-center justify-between py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium capitalize text-text-primary">
                        {tx.type}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        {tx.asset} · {tx.network} ·{" "}
                        {new Date(tx.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric"
                        })}
                      </p>
                    </div>
                    <div className="ml-4 flex shrink-0 items-center gap-2.5">
                      <span className="font-mono text-[13px] text-text-primary">
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
        <div className="space-y-3">
          {/* Portfolio */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle>Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {portfolio ? (
                <div className="space-y-2">
                  <p className="text-[14px] font-medium text-text-primary">{portfolio.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-text-muted">Status</span>
                    <Badge tone={portfolio.status === "active" ? "success" : "neutral"}>
                      {portfolio.status}
                    </Badge>
                  </div>
                  <Link
                    href="/dashboard/portfolio"
                    className="mt-1 flex items-center gap-1 text-[12px] font-medium text-accent-primary hover:underline"
                  >
                    View portfolio <ArrowRight className="size-3" />
                  </Link>
                </div>
              ) : (
                <EmptyState
                  icon={<Briefcase className="size-4" />}
                  title="No portfolio"
                  description="Complete onboarding to configure your portfolio."
                  className="py-5"
                />
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-0.5">
                {[
                  { label: "Wallet", href: "/dashboard/wallet", icon: WalletIcon },
                  { label: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
                  { label: "Documents", href: "/dashboard/documents", icon: FileText },
                  { label: "Settings", href: "/dashboard/settings", icon: SlidersHorizontal }
                ].map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2.5 rounded-sm px-2 py-2 text-[13px] text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
                  >
                    <Icon className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
                    {label}
                    <ArrowRight className="ml-auto size-3 text-text-disabled" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance notice */}
          {!complianceActive && (
            <Card>
              <CardContent className="p-4">
                <p className="text-[13px] font-medium text-text-primary">
                  Account verification pending
                </p>
                <p className="mt-1 text-[12px] text-text-muted">
                  Capital allocation is unavailable until your account is verified.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

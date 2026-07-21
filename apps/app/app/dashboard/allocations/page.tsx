import { SlidersHorizontal } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState } from "@netlium/ui";
import { createSupabaseServerClient } from "@netlium/lib/supabase/server";
import { InternalLedgerCustodyProvider } from "@netlium/lib";
import { requireRole } from "@/lib/auth";
import { AllocationRequestForm, type AssetNetworkPair } from "./AllocationRequestForm";

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  pending_review: "warning",
  approved: "success",
  executed: "success",
  rejected: "danger",
  cancelled: "neutral"
};

export default async function AllocationsPage() {
  const { user } = await requireRole("analyst");
  const supabase = await createSupabaseServerClient();

  const [walletResult, portfolioResult, requestsResult] = await Promise.all([
    supabase.from("wallets").select("id").eq("profile_id", user.id).maybeSingle(),
    supabase
      .from("investment_portfolios")
      .select("id, name")
      .eq("profile_id", user.id),
    supabase
      .from("capital_allocation_requests")
      .select("id, asset, network, amount, status, notes, created_at")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
  ]);

  const wallet = walletResult.data;
  const portfolios = portfolioResult.data ?? [];
  const requests = requestsResult.data ?? [];

  // Build asset/network pairs from the custody provider
  const pairs: AssetNetworkPair[] = [];
  if (wallet) {
    const provider = new InternalLedgerCustodyProvider(supabase);
    const assets = await provider.listSupportedAssets();
    for (const asset of assets) {
      const networks = await provider.listSupportedNetworks(asset.code);
      for (const network of networks) {
        pairs.push({
          assetCode: asset.code,
          assetLabel: asset.label,
          networkCode: network.code,
          networkLabel: network.label
        });
      }
    }
  }

  const walletOptions = wallet ? [{ id: wallet.id, label: "Primary wallet" }] : [];

  return (
    <div className="space-y-8 py-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-text-primary">
          Capital Allocations
        </h1>
        <p className="mt-1.5 text-body text-text-secondary">
          Submit and track capital allocation requests
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
        {/* Existing requests */}
        <Card>
          <CardHeader>
            <CardTitle>Allocation Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <EmptyState
                icon={<SlidersHorizontal className="size-5" aria-hidden="true" />}
                title="No allocation requests yet"
                description="Submit a request using the form to allocate capital from your wallet."
              />
            ) : (
              <div className="divide-y divide-border-hairline">
                {requests.map((req) => (
                  <div key={req.id} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="text-body-sm font-medium text-text-primary">
                        {Number(req.amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}{" "}
                        {req.asset}
                        <span className="ml-1.5 text-[11px] font-normal text-text-muted">
                          &middot; {req.network}
                        </span>
                      </p>
                      {req.notes && (
                        <p className="mt-0.5 truncate text-[11px] text-text-muted">{req.notes}</p>
                      )}
                      <p className="mt-0.5 text-[11px] text-text-muted">
                        {new Date(req.created_at).toLocaleDateString(undefined, {
                          dateStyle: "medium"
                        })}
                      </p>
                    </div>
                    <Badge tone={STATUS_TONE[req.status] ?? "neutral"}>
                      {req.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit new request */}
        <Card>
          <CardHeader>
            <CardTitle>New Request</CardTitle>
          </CardHeader>
          <CardContent>
            <AllocationRequestForm
              wallets={walletOptions}
              portfolios={portfolios}
              pairs={pairs}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import { AppShell, MobileNavigation, Sidebar } from "@netlium/ui";
import { dashboardNavItems } from "@/components/navigation/dashboardNav";
import { filterNavByRole } from "@/components/security/filterNavByRole";
import { resolveRole } from "@/components/security/resolveRole";
import { SignOutButton } from "@/components/security/SignOutButton";
import { requireProvisionedUser } from "@/lib/auth";

/** Primary mobile tab hrefs — excluded from the "More" bottom sheet. */
const PRIMARY_MOBILE_HREFS = new Set([
  "/dashboard",
  "/dashboard/portfolio",
  "/dashboard/wallet",
  "/dashboard/transactions"
]);

export default async function DashboardLayout({ children }: { readonly children: ReactNode }) {
  const { user, profile } = await requireProvisionedUser();
  const role = await resolveRole(user.id);
  const navItems = filterNavByRole(dashboardNavItems, role);
  const moreItems = navItems.filter((item) => !PRIMARY_MOBILE_HREFS.has(item.href));

  const displayName = profile?.fullName ?? profile?.email ?? user.email ?? "Account";
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <AppShell
      sidebar={<Sidebar items={navItems} />}
      sidebarFooter={
        <div className="space-y-2">
          <div className="px-2">
            <p className="truncate text-body-sm font-medium text-text-primary">{displayName}</p>
            <p className="truncate text-[11px] text-text-muted">{roleLabel}</p>
          </div>
          <SignOutButton />
        </div>
      }
      mobileNav={<MobileNavigation moreItems={moreItems} />}
    >
      {children}
    </AppShell>
  );
}

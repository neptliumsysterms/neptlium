"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, Briefcase, Wallet, ArrowLeftRight, MoreHorizontal, X } from "lucide-react";
import { cn } from "../components/utils/cn";
import type { NavItem } from "./Sidebar";

const PRIMARY_TABS = [
  { label: "Home", href: "/dashboard", icon: Home, exact: true },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: Briefcase, exact: false },
  { label: "Wallet", href: "/dashboard/wallet", icon: Wallet, exact: false },
  { label: "Activity", href: "/dashboard/transactions", icon: ArrowLeftRight, exact: false }
] as const;

export interface MobileNavigationProps {
  readonly moreItems: readonly NavItem[];
}

export function MobileNavigation({ moreItems }: MobileNavigationProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const primaryHrefs = new Set<string>(PRIMARY_TABS.map((t) => t.href));
  const isMoreActive =
    !PRIMARY_TABS.some((t) =>
      t.exact ? pathname === t.href : pathname === t.href || pathname.startsWith(t.href + "/")
    ) && moreItems.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"));

  return (
    <>
      {/* Fixed bottom navigation bar */}
      <nav
        aria-label="Primary navigation"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-hairline bg-sidebar md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex h-16 items-stretch">
          {PRIMARY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.exact
              ? pathname === tab.href
              : pathname === tab.href || pathname.startsWith(tab.href + "/");
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium leading-none transition-colors duration-150",
                  isActive ? "text-accent-primary" : "text-text-muted hover:text-text-secondary"
                )}
              >
                <Icon className="size-[22px]" aria-hidden="true" />
                <span>{tab.label}</span>
              </Link>
            );
          })}

          {/* More tab — shows remaining nav items in a bottom sheet */}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-expanded={moreOpen}
            aria-label="More options"
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium leading-none transition-colors duration-150",
              isMoreActive ? "text-accent-primary" : "text-text-muted hover:text-text-secondary"
            )}
          >
            <MoreHorizontal className="size-[22px]" aria-hidden="true" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* More bottom sheet */}
      {moreOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-surface-overlay md:hidden"
            onClick={() => setMoreOpen(false)}
            aria-hidden="true"
          />

          {/* Sheet */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="More navigation"
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-border-default bg-surface-3 md:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-body font-semibold text-text-primary">More</span>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Close"
                className="flex size-8 items-center justify-center rounded-full bg-surface-2 text-text-muted hover:text-text-secondary"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* Sheet items */}
            <div className="max-h-[60vh] overflow-y-auto px-4 pb-6">
              {moreItems.length === 0 ? (
                <p className="py-4 text-center text-body-sm text-text-muted">
                  No additional navigation items.
                </p>
              ) : (
                <div className="space-y-0.5">
                  {moreItems
                    .filter((item) => !primaryHrefs.has(item.href))
                    .map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMoreOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-3 text-body-sm font-medium transition-colors duration-150",
                            isActive
                              ? "bg-surface-2 text-accent-primary"
                              : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                          )}
                        >
                          {item.icon && (
                            <span
                              className={cn(
                                "shrink-0",
                                isActive ? "text-accent-primary" : "text-text-muted"
                              )}
                              aria-hidden="true"
                            >
                              {item.icon}
                            </span>
                          )}
                          {item.label}
                        </Link>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

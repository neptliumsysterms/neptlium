import React from "react";

/**
 * AppShell — The institutional UI container for Netlium Systems.
 *
 * Provides the base layout structure:
 * - Sidebar navigation
 * - Main content area
 * - Institutional branding
 *
 * All pages should render within this shell for consistency.
 */
export interface AppShellProps {
  readonly children: React.ReactNode;
  readonly sidebar?: React.ReactNode;
}

export function AppShell({ children, sidebar }: AppShellProps): React.ReactElement {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 p-4">
        <div className="mb-8 text-lg font-semibold tracking-tight">Netlium</div>
        {sidebar && <nav className="space-y-2">{sidebar}</nav>}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-slate-950 p-6 overflow-auto">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 px-6 py-8">
        <h1 className="text-4xl font-bold tracking-tight">Netlium Systems</h1>
        <p className="mt-2 text-slate-400">Institutional Capital Operating System</p>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold">Platform Overview</h2>
            <p className="mt-4 text-slate-300">
              Netlium is a production-grade institutional capital operating system designed for managing
              portfolios, treasury operations, and institutional governance at scale.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-slate-800 p-6">
              <h3 className="font-semibold">Governance</h3>
              <p className="mt-2 text-sm text-slate-400">
                Access institutional governance documentation and policies.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 p-6">
              <h3 className="font-semibold">Access Request</h3>
              <p className="mt-2 text-sm text-slate-400">
                Request access to the institutional dashboard.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 p-6">
              <h3 className="font-semibold">Documentation</h3>
              <p className="mt-2 text-sm text-slate-400">
                Learn about platform architecture and capabilities.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 p-6">
              <h3 className="font-semibold">Dashboard</h3>
              <p className="mt-2 text-sm text-slate-400">
                Access the institutional capital operations dashboard.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <h3 className="font-semibold">System Status</h3>
            <p className="mt-2 text-sm text-slate-400">
              All systems operational. Platform ready for institutional deployment.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

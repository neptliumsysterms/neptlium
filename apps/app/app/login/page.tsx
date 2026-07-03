"use client";

import { useState } from "react";
import { signIn } from "@netlium/lib";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message);
      } else {
        // Redirect to dashboard after successful login
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Netlium</h1>
            <p className="mt-2 text-slate-400">Institutional Capital Operations</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-800 bg-red-900/20 p-4">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investor@example.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-50 placeholder-slate-500 focus:border-slate-600 focus:outline-none"
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-50 placeholder-slate-500 focus:border-slate-600 focus:outline-none"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-700 px-4 py-2 font-medium text-slate-50 hover:bg-slate-600 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="border-t border-slate-800 pt-6">
            <p className="text-center text-sm text-slate-400">
              Demo credentials available upon institutional approval
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Purely CSS-driven (no per-frame JS) so the global `prefers-reduced-motion`
 * rule in global.css disables every animation here for free.
 *
 * Deliberately restrained: one or two very soft radial light sources on a
 * flat navy canvas, nothing that competes with the foreground typography.
 */
export function AuthBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas">
      <div
        className="absolute -top-1/3 left-1/2 size-[44vw] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-accent-emerald) 5%, transparent), transparent 72%)",
          filter: "blur(70px)",
          animation: "netlium-glow-drift 36s var(--motion-ease-in-out) infinite"
        }}
      />
      <div
        className="absolute bottom-[-22%] right-[10%] size-[32vw]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 4%, transparent), transparent 72%)",
          filter: "blur(76px)",
          animation: "netlium-glow-drift 42s var(--motion-ease-in-out) infinite reverse"
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 90% 65% at 50% 0%, transparent 45%, var(--color-canvas) 100%)" }}
      />
    </div>
  );
}

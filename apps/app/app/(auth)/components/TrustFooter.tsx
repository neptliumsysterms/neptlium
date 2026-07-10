import { ShieldCheck, Lock, KeyRound } from "lucide-react";

const items = [
  { icon: Lock, label: "Enterprise encryption" },
  { icon: KeyRound, label: "Secure authentication" },
  { icon: ShieldCheck, label: "Session protection" }
] as const;

export function TrustFooter() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[11px] tracking-wide text-text-disabled">
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-2">
          <Icon className="size-3" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}

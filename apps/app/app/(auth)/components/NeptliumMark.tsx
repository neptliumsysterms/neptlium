import { cn } from "@netlium/ui";

export interface NeptliumMarkProps {
  readonly size?: number;
  readonly animated?: boolean;
  readonly className?: string;
}

export function NeptliumMark({ size = 40, animated = false, className }: NeptliumMarkProps) {
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        className="relative"
        style={animated ? { animation: "neptlium-breathe 2.4s var(--motion-ease-in-out) infinite" } : undefined}
        role="img"
        aria-label="Neptlium"
      >
        <rect x="1" y="1" width="38" height="38" rx="11" fill="var(--color-surface-3)" />
        <rect x="1" y="1" width="38" height="38" rx="11" stroke="var(--color-accent-primary)" strokeOpacity="0.32" />
        <path d="M13 28V12h2.6l9.8 12.2V12H28v16h-2.6L15.6 15.8V28H13Z" fill="var(--color-accent-primary)" />
      </svg>
    </span>
  );
}

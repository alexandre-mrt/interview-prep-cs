type ProgressRingProps = {
  mastered: number;
  total: number;
  size?: number;
  accent?: string;
};

export function ProgressRing({
  mastered,
  total,
  size = 36,
  accent = "oklch(0.85 0.03 90)",
}: ProgressRingProps) {
  const pct = total === 0 ? 0 : Math.min(1, mastered / total);
  const gradient = `conic-gradient(${accent} ${pct * 360}deg, color-mix(in oklch, currentColor 10%, transparent) 0deg)`;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: size - 6,
          height: size - 6,
          borderRadius: "50%",
          background: "var(--card)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size < 36 ? 8.5 : 9.5,
          fontWeight: 600,
          color: total === 0 ? "var(--muted-foreground)" : "var(--foreground)",
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {total === 0 ? "—" : `${Math.round(pct * 100)}`}
      </div>
    </div>
  );
}

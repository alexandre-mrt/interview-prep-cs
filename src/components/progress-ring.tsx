type ProgressRingProps = {
  mastered: number;
  total: number;
  size?: number;
};

export function ProgressRing({
  mastered,
  total,
  size = 40,
}: ProgressRingProps) {
  const pct = total === 0 ? 0 : Math.min(1, mastered / total);
  const gradient = `conic-gradient(oklch(0.922 0 0) ${pct * 360}deg, oklch(1 0 0 / 10%) 0deg)`;

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
          width: size - 8,
          height: size - 8,
          borderRadius: "50%",
          background: "oklch(0.205 0 0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 9,
          fontWeight: 600,
          color: "oklch(0.708 0 0)",
        }}
      >
        {total === 0 ? "—" : `${Math.round(pct * 100)}%`}
      </div>
    </div>
  );
}

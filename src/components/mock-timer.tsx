type MockTimerProps = {
  seconds: number;
};

export function MockTimer({ seconds }: MockTimerProps) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const label = `${mins}:${String(secs).padStart(2, "0")}`;
  const isLow = seconds <= 10;

  return (
    <div
      className={`flex items-center gap-2 font-mono text-2xl font-bold ${isLow ? "text-rose-400" : "text-foreground"}`}
    >
      {label}
    </div>
  );
}

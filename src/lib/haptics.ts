export type HapticPattern = "tap" | "light" | "medium" | "success" | "error";

const PATTERNS: Record<HapticPattern, number | number[]> = {
  tap: 8,
  light: 12,
  medium: 25,
  success: [15, 40, 15],
  error: [40, 30, 40],
};

export function haptic(pattern: HapticPattern = "tap"): void {
  if (typeof window === "undefined") return;
  const nav = window.navigator;
  if (typeof nav.vibrate === "function") {
    try {
      nav.vibrate(PATTERNS[pattern]);
    } catch {}
  }
}

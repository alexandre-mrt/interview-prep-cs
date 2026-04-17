export type CardState = {
  ease: number;
  interval: number;
  dueAt: number;
  reps: number;
};

export const defaultCardState = (): CardState => ({
  ease: 2.5,
  interval: 0,
  dueAt: Date.now(),
  reps: 0,
});

export function review(state: CardState, quality: 1 | 2 | 3): CardState {
  const q = quality === 3 ? 5 : quality === 2 ? 3 : 1;
  const ease = Math.max(
    1.3,
    state.ease + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02),
  );
  let reps = state.reps + 1;
  let interval: number;
  if (q < 3) {
    reps = 0;
    interval = 1;
  } else if (reps === 1) {
    interval = 1;
  } else if (reps === 2) {
    interval = 6;
  } else {
    interval = Math.max(1, Math.round(state.interval * ease));
  }
  const dueAt = Date.now() + interval * 24 * 60 * 60 * 1000;
  return { ease, interval, dueAt, reps };
}

export function isDue(state: CardState | undefined): boolean {
  if (!state) return true;
  return state.dueAt <= Date.now();
}

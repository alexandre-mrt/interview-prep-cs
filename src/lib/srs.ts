export type Rating = 1 | 2 | 3 | 4;

export type CardState = {
  stability: number;
  difficulty: number;
  dueAt: number;
  reps: number;
  lapses: number;
  lastReviewAt: number;
  state: "new" | "learning" | "review" | "relearning";
};

export const defaultCardState = (): CardState => ({
  stability: 0,
  difficulty: 0,
  dueAt: Date.now(),
  reps: 0,
  lapses: 0,
  lastReviewAt: 0,
  state: "new",
});

const W: number[] = [
  0.4072, 1.1829, 3.1262, 15.4722, 7.2102, 0.5316, 1.0651, 0.0234, 1.616,
  0.1544, 1.0824, 1.9813, 0.0953, 0.2975, 2.2042, 0.2407, 2.9466, 0.5034,
  0.6567,
];
const REQUEST_RETENTION = 0.9;
const DECAY = -0.5;
const FACTOR = 19 / 81;

const clampDifficulty = (d: number) => Math.min(10, Math.max(1, d));
const clampStability = (s: number) => Math.max(0.1, s);

function initialStability(rating: Rating): number {
  return clampStability(W[rating - 1]);
}

function initialDifficulty(rating: Rating): number {
  return clampDifficulty(W[4] - (rating - 3) * W[5]);
}

function nextDifficulty(d: number, rating: Rating): number {
  const deltaD = -W[6] * (rating - 3);
  const next = d + deltaD * ((10 - d) / 9);
  return clampDifficulty(W[7] * initialDifficulty(4) + (1 - W[7]) * next);
}

function nextRecallStability(
  d: number,
  s: number,
  r: number,
  rating: Rating,
): number {
  const hard = rating === 2 ? W[15] : 1;
  const easy = rating === 4 ? W[16] : 1;
  return clampStability(
    s *
      (1 +
        Math.exp(W[8]) *
          (11 - d) *
          s ** -W[9] *
          (Math.exp((1 - r) * W[10]) - 1) *
          hard *
          easy),
  );
}

function nextForgetStability(d: number, s: number, r: number): number {
  return clampStability(
    W[11] * d ** -W[12] * ((s + 1) ** W[13] - 1) * Math.exp((1 - r) * W[14]),
  );
}

function retrievability(elapsedDays: number, stability: number): number {
  return (1 + (FACTOR * elapsedDays) / stability) ** DECAY;
}

function nextInterval(stability: number): number {
  const ivl = (stability / FACTOR) * (REQUEST_RETENTION ** (1 / DECAY) - 1);
  return Math.max(1, Math.round(ivl));
}

const DAY = 24 * 60 * 60 * 1000;

export function review(state: CardState, rating: Rating): CardState {
  const now = Date.now();
  const prev = state.state === "new" ? null : state;

  let difficulty: number;
  let stability: number;

  if (!prev || state.state === "new") {
    difficulty = initialDifficulty(rating);
    stability = initialStability(rating);
  } else {
    const elapsedDays = Math.max(0, (now - state.lastReviewAt) / DAY);
    const r = retrievability(elapsedDays, state.stability);
    difficulty = nextDifficulty(state.difficulty, rating);
    stability =
      rating === 1
        ? nextForgetStability(state.difficulty, state.stability, r)
        : nextRecallStability(state.difficulty, state.stability, r, rating);
  }

  const lapses = rating === 1 ? state.lapses + 1 : state.lapses;
  const nextState: CardState["state"] =
    rating === 1 ? "relearning" : state.state === "new" ? "learning" : "review";

  const interval = rating === 1 ? 1 : nextInterval(stability);
  const dueAt = now + interval * DAY;

  return {
    stability,
    difficulty,
    dueAt,
    reps: state.reps + 1,
    lapses,
    lastReviewAt: now,
    state: nextState,
  };
}

export function isDue(state: CardState | undefined): boolean {
  if (!state) return true;
  return state.dueAt <= Date.now();
}

export function projectedRetention(
  state: CardState | undefined,
  atMs: number = Date.now(),
): number {
  if (!state || state.state === "new") return 0;
  const elapsedDays = Math.max(0, (atMs - state.lastReviewAt) / DAY);
  return retrievability(elapsedDays, state.stability);
}

export function intervalLabel(rating: Rating, state: CardState): string {
  const draft = review(state, rating);
  const days = Math.round((draft.dueAt - Date.now()) / DAY);
  if (days < 1) return "<1d";
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${(days / 365).toFixed(1)}y`;
}

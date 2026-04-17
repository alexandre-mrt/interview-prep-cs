import { type CardState, defaultCardState } from "./srs";

const KEY = "ipc-srs-v2";
const STREAK_KEY = "ipc-streak-v1";
const STATS_KEY = "ipc-stats-v1";

export function loadStates(): Record<string, CardState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
    const legacy = localStorage.getItem("ipc-srs-v1");
    if (legacy) return migrateLegacy(JSON.parse(legacy));
    return {};
  } catch {
    return {};
  }
}

function migrateLegacy(
  legacy: Record<
    string,
    { ease: number; interval: number; dueAt: number; reps: number }
  >,
): Record<string, CardState> {
  const out: Record<string, CardState> = {};
  for (const [id, s] of Object.entries(legacy)) {
    out[id] = {
      ...defaultCardState(),
      stability: Math.max(1, s.interval || 1),
      difficulty: Math.max(1, Math.min(10, 11 - s.ease * 2)),
      dueAt: s.dueAt,
      reps: s.reps,
      state: s.reps > 0 ? "review" : "new",
      lastReviewAt: s.dueAt - (s.interval || 0) * 24 * 60 * 60 * 1000,
    };
  }
  return out;
}

export function saveState(id: string, state: CardState): void {
  if (typeof window === "undefined") return;
  const all = loadStates();
  all[id] = state;
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function dueCount(ids: string[]): number {
  const states = loadStates();
  let n = 0;
  for (const id of ids) {
    const s = states[id];
    if (!s || s.dueAt <= Date.now()) n++;
  }
  return n;
}

export function masteredCount(ids: string[], stabilityThreshold = 21): number {
  const states = loadStates();
  let n = 0;
  for (const id of ids) {
    const s = states[id];
    if (s && s.stability >= stabilityThreshold) n++;
  }
  return n;
}

export type StreakData = {
  current: number;
  longest: number;
  lastReviewDate: string;
  daysReviewed: string[];
};

export function loadStreak(): StreakData {
  if (typeof window === "undefined") {
    return { current: 0, longest: 0, lastReviewDate: "", daysReviewed: [] };
  }
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY) ?? "") as StreakData;
  } catch {
    return { current: 0, longest: 0, lastReviewDate: "", daysReviewed: [] };
  }
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function recordReviewDay(): StreakData {
  if (typeof window === "undefined") {
    return { current: 0, longest: 0, lastReviewDate: "", daysReviewed: [] };
  }
  const today = todayKey();
  const cur = loadStreak();
  if (cur.lastReviewDate === today) return cur;
  const wasYesterday = cur.lastReviewDate === yesterdayKey();
  const current = wasYesterday ? cur.current + 1 : 1;
  const longest = Math.max(cur.longest, current);
  const daysReviewed = cur.daysReviewed.includes(today)
    ? cur.daysReviewed
    : [...cur.daysReviewed, today].slice(-400);
  const next: StreakData = {
    current,
    longest,
    lastReviewDate: today,
    daysReviewed,
  };
  localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  return next;
}

export type SessionStats = {
  totalReviews: number;
  byRating: Record<1 | 2 | 3 | 4, number>;
  lastSessionAt: number;
};

export function loadStats(): SessionStats {
  if (typeof window === "undefined") {
    return {
      totalReviews: 0,
      byRating: { 1: 0, 2: 0, 3: 0, 4: 0 },
      lastSessionAt: 0,
    };
  }
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) ?? "") as SessionStats;
  } catch {
    return {
      totalReviews: 0,
      byRating: { 1: 0, 2: 0, 3: 0, 4: 0 },
      lastSessionAt: 0,
    };
  }
}

export function recordReview(rating: 1 | 2 | 3 | 4): void {
  if (typeof window === "undefined") return;
  const cur = loadStats();
  cur.totalReviews += 1;
  cur.byRating[rating] = (cur.byRating[rating] ?? 0) + 1;
  cur.lastSessionAt = Date.now();
  localStorage.setItem(STATS_KEY, JSON.stringify(cur));
}

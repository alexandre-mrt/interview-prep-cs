import type { CardState } from "./srs";

const KEY = "ipc-srs-v1";

export function loadStates(): Record<string, CardState> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
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

"use client";

import { useEffect, useState } from "react";
import type { TopicId } from "@/lib/schema";

const STORAGE_KEY = "ipc-learn-progress-v1";
const DRILL_PASS_THRESHOLD = 0.8;

export type ChapterProgress = {
  read: boolean;
  drillRecall: number;
  drillRuns: number;
  cardsReviewed: number;
  lastVisited: number;
  completedAt: number | null;
};

export type LearnProgressMap = Record<string, ChapterProgress>;

type Listener = (map: LearnProgressMap) => void;
const listeners = new Set<Listener>();

function defaultProgress(): ChapterProgress {
  return {
    read: false,
    drillRecall: 0,
    drillRuns: 0,
    cardsReviewed: 0,
    lastVisited: 0,
    completedAt: null,
  };
}

function safeLoad(): LearnProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as LearnProgressMap)
      : {};
  } catch {
    return {};
  }
}

function safeSave(map: LearnProgressMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    for (const l of listeners) l(map);
  } catch {}
}

export function loadLearnProgress(): LearnProgressMap {
  return safeLoad();
}

export function getChapterProgress(chapterId: string): ChapterProgress {
  const map = safeLoad();
  return map[chapterId] ?? defaultProgress();
}

function isChapterCompleted(p: ChapterProgress): boolean {
  return p.read && p.drillRecall >= DRILL_PASS_THRESHOLD;
}

export function markChapterRead(chapterId: string): void {
  const map = safeLoad();
  const prev = map[chapterId] ?? defaultProgress();
  const next: ChapterProgress = {
    ...prev,
    read: true,
    lastVisited: Date.now(),
  };
  if (isChapterCompleted(next) && !next.completedAt) {
    next.completedAt = Date.now();
  }
  map[chapterId] = next;
  safeSave(map);
}

export function markChapterVisited(chapterId: string): void {
  const map = safeLoad();
  const prev = map[chapterId] ?? defaultProgress();
  map[chapterId] = { ...prev, lastVisited: Date.now() };
  safeSave(map);
}

export function recordDrillRecall(
  chapterId: string,
  recall: number,
  cardsReviewed: number,
): void {
  const map = safeLoad();
  const prev = map[chapterId] ?? defaultProgress();
  const next: ChapterProgress = {
    ...prev,
    drillRecall: Math.max(prev.drillRecall, recall),
    drillRuns: prev.drillRuns + 1,
    cardsReviewed: prev.cardsReviewed + cardsReviewed,
    lastVisited: Date.now(),
  };
  if (isChapterCompleted(next) && !next.completedAt) {
    next.completedAt = Date.now();
  }
  map[chapterId] = next;
  safeSave(map);
}

export function chapterGates(p: ChapterProgress): {
  read: boolean;
  drilled: boolean;
  completed: boolean;
} {
  return {
    read: p.read,
    drilled: p.drillRecall >= DRILL_PASS_THRESHOLD,
    completed: isChapterCompleted(p),
  };
}

export function topicProgress(
  topicId: TopicId,
  chapterIds: string[],
): { completed: number; total: number; pct: number } {
  const map = safeLoad();
  let completed = 0;
  for (const id of chapterIds) {
    const p = map[id] ?? defaultProgress();
    if (isChapterCompleted(p)) completed++;
  }
  const total = chapterIds.length;
  return {
    completed,
    total,
    pct: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function getLastVisitedChapter(
  chapterIds: string[],
): { chapterId: string; visited: number } | null {
  const map = safeLoad();
  let best: { chapterId: string; visited: number } | null = null;
  for (const id of chapterIds) {
    const p = map[id];
    if (p && p.lastVisited > 0) {
      if (!best || p.lastVisited > best.visited) {
        best = { chapterId: id, visited: p.lastVisited };
      }
    }
  }
  return best;
}

export function firstPendingChapter(chapterIds: string[]): string | null {
  const map = safeLoad();
  for (const id of chapterIds) {
    const p = map[id] ?? defaultProgress();
    if (!isChapterCompleted(p)) return id;
  }
  return chapterIds[0] ?? null;
}

export function useLearnProgress(): LearnProgressMap {
  const [map, setMap] = useState<LearnProgressMap>(() => ({}));

  useEffect(() => {
    setMap(safeLoad());
    const listener: Listener = (next) => setMap(next);
    listeners.add(listener);
    const storageHandler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setMap(safeLoad());
    };
    window.addEventListener("storage", storageHandler);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  return map;
}

"use client";

import Link from "next/link";
import { useEffect, useReducer, useRef } from "react";
import { MockTimer } from "@/components/mock-timer";
import type { Flashcard, TopicId } from "@/lib/schema";
import { TopicMeta } from "@/lib/schema";

const TIMER_OPTIONS = [2, 3, 5, 10] as const;
type TimerMinutes = (typeof TIMER_OPTIONS)[number];
type Rating = "got" | "partial" | "missed";

type MockHistoryEntry = {
  cardId: string;
  rating: Rating;
  topic: string;
  ts: number;
};

const MOCK_HISTORY_KEY = "ipc-mock-history-v1";

function loadMockHistory(): MockHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(MOCK_HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveMockEntry(entry: MockHistoryEntry): void {
  if (typeof window === "undefined") return;
  const all = loadMockHistory();
  all.push(entry);
  localStorage.setItem(MOCK_HISTORY_KEY, JSON.stringify(all));
}

type Phase = "landing" | "question" | "summary";

type State = {
  phase: Phase;
  timerMinutes: TimerMinutes;
  selectedTopics: Set<string>;
  deck: Flashcard[];
  index: number;
  revealed: boolean;
  secondsLeft: number;
  results: Array<{ card: Flashcard; rating: Rating }>;
};

type Action =
  | { type: "SET_TIMER"; minutes: TimerMinutes }
  | { type: "TOGGLE_TOPIC"; topic: string }
  | { type: "START" }
  | { type: "REVEAL" }
  | { type: "RATE"; rating: Rating }
  | { type: "TICK" }
  | { type: "NEXT" }
  | { type: "END" }
  | { type: "RESET" };

function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TIMER":
      return { ...state, timerMinutes: action.minutes };
    case "TOGGLE_TOPIC": {
      const next = new Set(state.selectedTopics);
      if (next.has(action.topic)) next.delete(action.topic);
      else next.add(action.topic);
      return { ...state, selectedTopics: next };
    }
    case "START": {
      const filtered =
        state.selectedTopics.size === 0
          ? state.deck
          : state.deck.filter((c) => state.selectedTopics.has(c.topic));
      return {
        ...state,
        phase: "question",
        deck: shuffleArray(filtered),
        index: 0,
        revealed: false,
        secondsLeft: state.timerMinutes * 60,
        results: [],
      };
    }
    case "REVEAL":
      return { ...state, revealed: true };
    case "TICK":
      if (state.secondsLeft <= 0) return { ...state, revealed: true };
      return { ...state, secondsLeft: state.secondsLeft - 1 };
    case "RATE": {
      const card = state.deck[state.index];
      if (!card) return state;
      saveMockEntry({
        cardId: card.id,
        rating: action.rating,
        topic: card.topic,
        ts: Date.now(),
      });
      const results = [...state.results, { card, rating: action.rating }];
      const next = state.index + 1;
      if (next >= state.deck.length) {
        return { ...state, results, phase: "summary" };
      }
      return {
        ...state,
        results,
        index: next,
        revealed: false,
        secondsLeft: state.timerMinutes * 60,
      };
    }
    case "END":
      return { ...state, phase: "summary" };
    case "RESET":
      return {
        ...state,
        phase: "landing",
        index: 0,
        revealed: false,
        results: [],
      };
    default:
      return state;
  }
}

type MockSessionProps = {
  cards: Flashcard[];
};

export function MockSession({ cards }: MockSessionProps) {
  const allTopics = [...new Set(cards.map((c) => c.topic))];

  const [state, dispatch] = useReducer(reducer, {
    phase: "landing",
    timerMinutes: 3,
    selectedTopics: new Set<string>(),
    deck: cards,
    index: 0,
    revealed: false,
    secondsLeft: 3 * 60,
    results: [],
  });

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.phase !== "question") {
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
    tickRef.current = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [state.phase]);

  const currentCard = state.deck[state.index];

  if (state.phase === "landing") {
    return (
      <main className="min-h-dvh flex flex-col p-4 max-w-md mx-auto w-full pt-6">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Home
          </Link>
          <h1 className="text-sm font-medium">Mock Interview</h1>
          <div className="w-14" />
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Timer per question
            </p>
            <div className="flex gap-2">
              {TIMER_OPTIONS.map((min) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => dispatch({ type: "SET_TIMER", minutes: min })}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                    state.timerMinutes === min
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {min}m
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Topics{" "}
              <span className="normal-case">
                (
                {state.selectedTopics.size === 0
                  ? "all"
                  : state.selectedTopics.size}{" "}
                selected)
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {allTopics.map((topic) => {
                const meta = TopicMeta[topic as TopicId];
                const selected = state.selectedTopics.has(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => dispatch({ type: "TOGGLE_TOPIC", topic })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {meta?.emoji} {meta?.label ?? topic}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">
              {cards.length} mock-eligible cards
            </p>
            <button
              type="button"
              onClick={() => dispatch({ type: "START" })}
              disabled={cards.length === 0}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Start
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (state.phase === "summary") {
    const got = state.results.filter((r) => r.rating === "got").length;
    const partial = state.results.filter((r) => r.rating === "partial").length;
    const missed = state.results.filter((r) => r.rating === "missed").length;
    const pct =
      state.results.length > 0
        ? Math.round((got / state.results.length) * 100)
        : 0;
    const coveredTopics = [...new Set(state.results.map((r) => r.card.topic))];

    return (
      <main className="min-h-dvh flex flex-col p-4 max-w-md mx-auto w-full pt-6">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Home
          </Link>
          <h1 className="text-sm font-medium">Session Summary</h1>
          <div className="w-14" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="text-center">
            <p className="text-5xl font-bold">{pct}%</p>
            <p className="text-muted-foreground text-sm mt-1">got it rate</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center rounded-xl bg-emerald-500/10 p-3">
              <p className="text-xl font-bold text-emerald-400">{got}</p>
              <p className="text-xs text-muted-foreground">Got it</p>
            </div>
            <div className="text-center rounded-xl bg-amber-500/10 p-3">
              <p className="text-xl font-bold text-amber-400">{partial}</p>
              <p className="text-xs text-muted-foreground">Partial</p>
            </div>
            <div className="text-center rounded-xl bg-rose-500/10 p-3">
              <p className="text-xl font-bold text-rose-400">{missed}</p>
              <p className="text-xs text-muted-foreground">Missed</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Topics covered</p>
            <div className="flex flex-wrap gap-2">
              {coveredTopics.map((t) => {
                const meta = TopicMeta[t as TopicId];
                return (
                  <span
                    key={t}
                    className="text-xs bg-muted px-2 py-1 rounded-full"
                  >
                    {meta?.emoji} {meta?.label ?? t}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => dispatch({ type: "RESET" })}
              className="flex-1 py-3 rounded-xl bg-muted text-sm font-medium hover:bg-muted/70 transition-colors"
            >
              New session
            </button>
            <Link
              href="/review"
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium text-center hover:opacity-90 transition-opacity"
            >
              Review all
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col p-4 max-w-md mx-auto w-full pt-6">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => dispatch({ type: "END" })}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          End session
        </button>
        <MockTimer seconds={state.secondsLeft} />
        <span className="text-xs text-muted-foreground">
          {state.index + 1}/{state.deck.length}
        </span>
      </div>

      {currentCard && (
        <div className="flex flex-col gap-6 flex-1">
          <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6 flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                {currentCard.subtopic}
              </span>
              <span className="text-xs text-muted-foreground">
                {TopicMeta[currentCard.topic as TopicId]?.emoji}
              </span>
            </div>
            <p className="text-base font-medium leading-relaxed">
              {currentCard.front}
            </p>

            {state.revealed && (
              <div className="border-t border-foreground/10 pt-4 flex flex-col gap-3">
                <p className="text-sm leading-relaxed">{currentCard.back}</p>
                {currentCard.senior_nuance && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Senior insight
                    </p>
                    <p className="text-xs leading-relaxed">
                      {currentCard.senior_nuance}
                    </p>
                  </div>
                )}
                {currentCard.quote_to_say && (
                  <blockquote className="border-l-2 border-primary pl-3 text-xs italic text-muted-foreground">
                    {currentCard.quote_to_say}
                  </blockquote>
                )}
              </div>
            )}
          </div>

          {!state.revealed ? (
            <button
              type="button"
              onClick={() => dispatch({ type: "REVEAL" })}
              className="w-full py-3 rounded-xl bg-muted text-sm font-medium hover:bg-muted/70 transition-colors"
            >
              Show answer
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => dispatch({ type: "RATE", rating: "missed" })}
                className="flex-1 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 text-sm font-medium hover:bg-rose-500/20"
              >
                Missed
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: "RATE", rating: "partial" })}
                className="flex-1 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 text-sm font-medium hover:bg-amber-500/20"
              >
                Partial
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: "RATE", rating: "got" })}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20"
              >
                Got it
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

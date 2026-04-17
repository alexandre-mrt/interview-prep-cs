"use client";

import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { FlashcardViewer } from "@/components/flashcard";
import { haptic } from "@/lib/haptics";
import { recordDrillRecall } from "@/lib/learn-progress";
import type { Flashcard } from "@/lib/schema";
import { defaultCardState, type Rating, review } from "@/lib/srs";
import {
  loadStates,
  recordReview,
  recordReviewDay,
  saveState,
} from "@/lib/storage";

type Props = {
  chapterId: string;
  cards: Flashcard[];
  accent: string;
  onComplete?: (recall: number) => void;
  onExit?: () => void;
};

function shuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function ChapterDrill({
  chapterId,
  cards,
  accent,
  onComplete,
  onExit,
}: Props) {
  const [seed, setSeed] = useState(() => Date.now());
  const [index, setIndex] = useState(0);
  const [tally, setTally] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [done, setDone] = useState(false);

  const deck = useMemo(() => shuffle(cards, seed), [cards, seed]);
  const current = deck[index];
  const cardState = useMemo(() => {
    if (!current) return undefined;
    const states = loadStates();
    return states[current.id];
  }, [current]);

  const handleRate = useCallback(
    (rating: Rating) => {
      if (!current) return;
      const states = loadStates();
      const prev = states[current.id] ?? defaultCardState();
      saveState(current.id, review(prev, rating));
      recordReview(rating);
      recordReviewDay();

      const next = {
        again: tally.again + (rating === 1 ? 1 : 0),
        hard: tally.hard + (rating === 2 ? 1 : 0),
        good: tally.good + (rating === 3 ? 1 : 0),
        easy: tally.easy + (rating === 4 ? 1 : 0),
      };
      setTally(next);

      const nextIndex = index + 1;
      if (nextIndex >= deck.length) {
        const total = next.again + next.hard + next.good + next.easy;
        const recall =
          total === 0 ? 0 : (next.good + next.easy + next.hard * 0.5) / total;
        recordDrillRecall(chapterId, recall, total);
        onComplete?.(recall);
        setDone(true);
        haptic(recall >= 0.8 ? "success" : "medium");
      } else {
        setIndex(nextIndex);
      }
    },
    [current, tally, index, deck.length, chapterId, onComplete],
  );

  const restart = useCallback(() => {
    setSeed(Date.now());
    setIndex(0);
    setTally({ again: 0, hard: 0, good: 0, easy: 0 });
    setDone(false);
    haptic("tap");
  }, []);

  if (cards.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No cards in this chapter yet.
        </p>
      </div>
    );
  }

  if (done) {
    const total = tally.again + tally.hard + tally.good + tally.easy;
    const recall =
      total === 0 ? 0 : (tally.good + tally.easy + tally.hard * 0.5) / total;
    const pct = Math.round(recall * 100);
    const passed = recall >= 0.8;

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong topic-glow rounded-3xl p-6 flex flex-col items-center gap-4 text-center"
        style={{ "--accent": accent } as React.CSSProperties}
      >
        <div
          className="size-14 rounded-full flex items-center justify-center"
          style={{
            background: passed
              ? `color-mix(in oklch, ${accent} 22%, transparent)`
              : "var(--muted)",
          }}
        >
          {passed ? (
            <CheckCircle2
              className="size-7"
              style={{ color: accent }}
              strokeWidth={1.8}
            />
          ) : (
            <Sparkles
              className="size-7 text-muted-foreground"
              strokeWidth={1.8}
            />
          )}
        </div>
        <div>
          <p className="eyebrow text-muted-foreground">Drill complete</p>
          <p className="font-serif text-[40px] leading-none tabular-nums mt-1">
            {pct}
            <span className="text-muted-foreground/60 text-[24px]">%</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {passed
              ? "Chapter drilled. Progress saved."
              : "Under 80% — another pass should lock it in."}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2 w-full max-w-[320px] text-[11px]">
          <Tally label="Again" value={tally.again} tone="rose" />
          <Tally label="Hard" value={tally.hard} tone="amber" />
          <Tally label="Good" value={tally.good} tone="sky" />
          <Tally label="Easy" value={tally.easy} tone="emerald" />
        </div>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={restart}
            className="glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium hover:border-foreground/20 transition-colors"
          >
            <RotateCcw className="size-3.5" strokeWidth={2} />
            Drill again
          </button>
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to chapter
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 px-1">
        <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(index / deck.length) * 100}%`,
              background: accent,
            }}
          />
        </div>
        <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
          {index + 1}/{deck.length}
        </span>
      </div>

      {current && (
        <FlashcardViewer
          key={current.id}
          card={current}
          cardState={cardState}
          onRate={handleRate}
          index={index}
          total={deck.length}
        />
      )}
    </div>
  );
}

function Tally({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "rose" | "amber" | "sky" | "emerald";
}) {
  const TONES = {
    rose: "text-rose-500",
    amber: "text-amber-500",
    sky: "text-sky-500",
    emerald: "text-emerald-500",
  } as const;
  return (
    <div className="rounded-lg bg-muted/60 py-1.5">
      <p
        className={`font-mono tabular-nums text-sm font-semibold ${TONES[tone]}`}
      >
        {value}
      </p>
      <p className="eyebrow text-muted-foreground/70 text-[8.5px]">{label}</p>
    </div>
  );
}

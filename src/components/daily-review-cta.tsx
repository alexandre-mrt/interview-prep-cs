"use client";

import { ArrowRight, Flame } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { haptic } from "@/lib/haptics";
import { dueCount, loadStreak } from "@/lib/storage";

type DailyReviewCtaProps = {
  allCardIds: string[];
};

export function DailyReviewCta({ allCardIds }: DailyReviewCtaProps) {
  const [due, setDue] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setDue(dueCount(allCardIds));
    setStreak(loadStreak().current);
  }, [allCardIds]);

  const ready = due !== null;
  const hasDue = ready && due > 0;
  const href = !hasDue ? "/review?mode=all" : "/review?mode=due";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] tracking-widest uppercase text-muted-foreground font-medium">
          Today
        </p>
        {streak > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 bg-amber-500/10 rounded-full px-2 py-0.5 border border-amber-500/20">
            <Flame className="size-3" />
            {streak}d streak
          </span>
        )}
      </div>

      <div>
        <h1 className="text-4xl font-serif tracking-tight leading-[1.05] mb-1.5">
          Interview Prep
        </h1>
        <p className="text-muted-foreground text-[13.5px] leading-relaxed">
          Senior engineering flashcards with FSRS spaced repetition. Swipe to
          grade. Mix topics for long-term retention.
        </p>
      </div>

      <Link
        href={href}
        onClick={() => haptic("light")}
        className="group flex items-center justify-between rounded-2xl bg-foreground text-background px-5 py-4 hover:opacity-90 active:scale-[0.99] transition-all"
      >
        <div>
          <p className="text-[11px] tracking-widest uppercase opacity-70">
            {!ready ? "Loading" : hasDue ? "Due now" : "All caught up"}
          </p>
          <p className="text-lg font-semibold tabular-nums">
            {!ready ? "…" : hasDue ? `Review ${due} cards` : "Review anything"}
          </p>
        </div>
        <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

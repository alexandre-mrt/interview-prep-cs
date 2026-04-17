"use client";

import { ArrowUpRight, Flame, Sparkles } from "lucide-react";
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
  const total = allCardIds.length;

  return (
    <div className="flex flex-col gap-7 float-in">
      <div className="flex items-center justify-between">
        <span className="eyebrow text-muted-foreground">Today</span>
        {streak > 0 && (
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-amber-500 bg-amber-500/10 rounded-full pl-2 pr-2.5 py-1 border border-amber-500/25 backdrop-blur-sm tracking-wide">
            <Flame className="size-3" strokeWidth={2.5} />
            {streak}d streak
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="font-serif text-[56px] leading-[0.92] tracking-[-0.02em] text-balance">
          Interview{" "}
          <span className="italic text-muted-foreground/90">Prep.</span>
        </h1>
        <p className="text-muted-foreground text-[14px] leading-relaxed max-w-[38ch]">
          Senior engineering flashcards with FSRS spaced repetition.{" "}
          <span className="text-foreground/80">Swipe to grade.</span> Mix topics
          for long-term retention.
        </p>
      </div>

      <Link
        href={href}
        onClick={() => haptic("light")}
        className="group relative glass-strong topic-glow rounded-3xl p-5 flex items-center justify-between overflow-hidden active:scale-[0.99] transition-all hover:border-foreground/20"
        style={
          {
            "--accent": "oklch(0.72 0.18 280)",
          } as React.CSSProperties
        }
      >
        <div className="flex flex-col gap-1.5 relative z-10">
          <span className="eyebrow text-muted-foreground flex items-center gap-1.5">
            <Sparkles
              className="size-3 text-amber-500/80"
              strokeWidth={2.5}
              aria-hidden
            />
            {!ready ? "Loading" : hasDue ? "Due now" : "All caught up"}
          </span>
          <p className="text-[22px] font-semibold tabular-nums tracking-tight">
            {!ready ? "…" : hasDue ? `Review ${due} cards` : "Review anything"}
          </p>
          <p className="text-[11px] text-muted-foreground font-mono">
            of {total} total
          </p>
        </div>
        <span className="size-11 rounded-2xl bg-foreground text-background flex items-center justify-center shrink-0 transition-transform group-hover:rotate-[12deg] group-hover:scale-105 relative z-10">
          <ArrowUpRight className="size-5" strokeWidth={2.2} />
        </span>
      </Link>
    </div>
  );
}

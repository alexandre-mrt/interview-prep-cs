"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProgressRing } from "@/components/progress-ring";
import { haptic } from "@/lib/haptics";
import type { TopicId } from "@/lib/schema";
import { TopicMeta } from "@/lib/schema";
import { masteredCount } from "@/lib/storage";

type TopicCardProps = {
  slug: string;
  emoji: string;
  label: string;
  totalCards: number;
  cardIds: string[];
};

export function TopicCard({
  slug,
  emoji,
  label,
  totalCards,
  cardIds,
}: TopicCardProps) {
  const [mastered, setMastered] = useState(0);

  useEffect(() => {
    setMastered(masteredCount(cardIds));
  }, [cardIds]);

  const accent = TopicMeta[slug as TopicId]?.accent ?? "oklch(0.7 0 0)";

  return (
    <Link
      href={`/topic/${slug}`}
      onClick={() => haptic("tap")}
      className="group relative flex flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 hover:ring-foreground/25 active:scale-[0.98] transition-all overflow-hidden"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 opacity-80 group-hover:opacity-100 transition-opacity"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between">
        <span className="text-2xl" role="img" aria-label={label}>
          {emoji}
        </span>
        <ProgressRing mastered={mastered} total={totalCards} size={40} />
      </div>
      <div>
        <p className="font-medium text-[13.5px] text-foreground leading-tight tracking-tight">
          {label}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5 tabular-nums">
          {totalCards === 0 ? "No cards" : `${totalCards} cards`}
        </p>
      </div>
    </Link>
  );
}

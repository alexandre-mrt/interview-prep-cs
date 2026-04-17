"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProgressRing } from "@/components/progress-ring";
import { loadStates } from "@/lib/storage";

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
    const states = loadStates();
    let count = 0;
    for (const id of cardIds) {
      const s = states[id];
      if (s && s.reps >= 3 && s.interval >= 6) count++;
    }
    setMastered(count);
  }, [cardIds]);

  return (
    <Link
      href={`/topic/${slug}`}
      className="group flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 hover:ring-foreground/20 transition-all"
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl" role="img" aria-label={label}>
          {emoji}
        </span>
        <ProgressRing mastered={mastered} total={totalCards} size={40} />
      </div>
      <div>
        <p className="font-medium text-sm text-foreground leading-snug">
          {label}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {totalCards === 0 ? "No cards yet" : `${totalCards} cards`}
        </p>
      </div>
    </Link>
  );
}

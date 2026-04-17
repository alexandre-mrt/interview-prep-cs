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
      className="group relative glass topic-glow flex flex-col gap-3 rounded-2xl p-4 hover:border-foreground/20 active:scale-[0.98] transition-all overflow-hidden min-h-[120px]"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <span
        aria-hidden
        className="absolute inset-x-4 top-0 h-px opacity-60 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(to right, transparent, ${accent}, transparent)`,
        }}
      />
      <div className="flex items-start justify-between">
        <span
          className="text-[22px] leading-none"
          role="img"
          aria-label={label}
        >
          {emoji}
        </span>
        <ProgressRing mastered={mastered} total={totalCards} size={36} />
      </div>
      <div className="mt-auto">
        <p className="font-medium text-[13.5px] text-foreground leading-tight tracking-[-0.01em]">
          {label}
        </p>
        <p className="eyebrow text-muted-foreground/80 mt-1 text-[9.5px]">
          {totalCards === 0 ? "No cards" : `${totalCards} · ${mastered} known`}
        </p>
      </div>
    </Link>
  );
}

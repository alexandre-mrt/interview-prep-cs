"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProgressRing } from "@/components/progress-ring";
import {
  firstPendingChapter,
  getLastVisitedChapter,
  topicProgress,
  useLearnProgress,
} from "@/lib/learn-progress";
import type { TopicId } from "@/lib/schema";

type Props = {
  topicId: TopicId;
  topicSlug: string;
  label: string;
  emoji: string;
  accent: string;
  chapterCount: number;
  cardCount: number;
  chapterIds: string[];
  chapterSlugByID: Record<string, string>;
};

export function LearnTopicCard({
  topicSlug,
  label,
  emoji,
  accent,
  chapterCount,
  cardCount,
  chapterIds,
  chapterSlugByID,
  topicId,
}: Props) {
  useLearnProgress();
  const { completed, total, pct } = topicProgress(topicId, chapterIds);
  const lastVisited = getLastVisitedChapter(chapterIds);
  const resumeChapterId =
    lastVisited?.chapterId ?? firstPendingChapter(chapterIds);
  const resumeSlug = resumeChapterId
    ? chapterSlugByID[resumeChapterId]
    : undefined;
  const href = resumeSlug
    ? `/learn/${topicSlug}/${resumeSlug}`
    : `/learn/${topicSlug}`;

  return (
    <Link
      href={href}
      className="glass topic-glow rounded-2xl p-4 flex flex-col gap-3 hover:border-foreground/20 active:scale-[0.99] transition-all group"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <div
        className="absolute top-0 left-4 right-4 h-px opacity-60"
        aria-hidden
        style={{
          background: `linear-gradient(to right, transparent, ${accent}, transparent)`,
        }}
      />
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-[22px] leading-none">{emoji}</span>
          <div className="min-w-0">
            <p className="text-[13.5px] font-semibold leading-tight truncate">
              {label}
            </p>
            <p className="eyebrow text-muted-foreground/80 text-[9px] mt-0.5">
              {chapterCount} chapters · {cardCount} cards
            </p>
          </div>
        </div>
        <ProgressRing
          mastered={completed}
          total={total}
          size={34}
          accent={accent}
        />
      </div>
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="eyebrow text-muted-foreground text-[9.5px]">
          {pct === 100
            ? "Mastered"
            : lastVisited
              ? "Resume"
              : pct > 0
                ? "Continue"
                : "Start"}
        </span>
        <ArrowRight
          className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
          strokeWidth={1.8}
        />
      </div>
    </Link>
  );
}

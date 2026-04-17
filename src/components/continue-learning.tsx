"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import {
  getLastVisitedChapter,
  topicProgress,
  useLearnProgress,
} from "@/lib/learn-progress";
import { type TopicId, TopicMeta } from "@/lib/schema";

export type ContinueLearningTopic = {
  topicId: TopicId;
  slug: string;
  label: string;
  emoji: string;
  accent: string;
  chapters: Array<{ id: string; slug: string; label: string; order: number }>;
};

type TopicView = ContinueLearningTopic;

type Props = {
  topics: TopicView[];
};

export function ContinueLearning({ topics }: Props) {
  useLearnProgress();

  let best: {
    topic: TopicView;
    chapter: TopicView["chapters"][number];
    visited: number;
  } | null = null;

  for (const t of topics) {
    const ids = t.chapters.map((c) => c.id);
    const last = getLastVisitedChapter(ids);
    if (last && (!best || last.visited > best.visited)) {
      const chapter = t.chapters.find((c) => c.id === last.chapterId);
      if (chapter) best = { topic: t, chapter, visited: last.visited };
    }
  }

  if (!best) {
    const fallback = topics[0];
    if (!fallback || fallback.chapters.length === 0) return null;
    const meta = TopicMeta[fallback.topicId];
    return (
      <Link
        href={`/learn/${fallback.slug}/${fallback.chapters[0].slug}`}
        className="glass rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-foreground/20 active:scale-[0.99] transition-all group"
        style={{ "--accent": meta.accent } as React.CSSProperties}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="size-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: `color-mix(in oklch, ${meta.accent} 18%, transparent)`,
              color: meta.accent,
            }}
          >
            <BookOpen className="size-4" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="eyebrow text-muted-foreground/80 text-[9px]">
              Start learning
            </p>
            <p className="text-[13px] font-semibold leading-tight truncate">
              {fallback.label} · {fallback.chapters[0].label}
            </p>
          </div>
        </div>
        <ArrowRight
          className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 shrink-0"
          strokeWidth={1.8}
        />
      </Link>
    );
  }

  const ids = best.topic.chapters.map((c) => c.id);
  const { completed, total, pct } = topicProgress(best.topic.topicId, ids);

  return (
    <Link
      href={`/learn/${best.topic.slug}/${best.chapter.slug}`}
      className="glass topic-glow rounded-2xl p-4 flex flex-col gap-3 hover:border-foreground/20 active:scale-[0.99] transition-all group"
      style={{ "--accent": best.topic.accent } as React.CSSProperties}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="size-9 rounded-xl flex items-center justify-center shrink-0 text-[16px] leading-none"
            style={{
              background: `color-mix(in oklch, ${best.topic.accent} 18%, transparent)`,
            }}
            aria-hidden
          >
            {best.topic.emoji}
          </span>
          <div className="min-w-0">
            <p className="eyebrow text-muted-foreground/80 text-[9px]">
              Resume learning
            </p>
            <p className="text-[13px] font-semibold leading-tight truncate">
              {best.chapter.label}
            </p>
            <p className="text-[11px] text-muted-foreground/80 truncate">
              {best.topic.label}
            </p>
          </div>
        </div>
        <ArrowRight
          className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 shrink-0"
          strokeWidth={1.8}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: best.topic.accent }}
          />
        </div>
        <span className="font-mono text-[10px] tabular-nums text-muted-foreground shrink-0">
          {completed}/{total}
        </span>
      </div>
    </Link>
  );
}

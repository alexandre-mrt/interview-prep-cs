"use client";

import { BookOpen, CheckCircle2, CircleDashed, Lock, Zap } from "lucide-react";
import Link from "next/link";
import type { Chapter } from "@/lib/curriculum";
import {
  chapterGates,
  getChapterProgress,
  topicProgress,
  useLearnProgress,
} from "@/lib/learn-progress";
import type { TopicId } from "@/lib/schema";

type Props = {
  topicId: TopicId;
  topicSlug: string;
  accent: string;
  chapters: Chapter[];
};

export function ChapterList({ topicId, topicSlug, accent, chapters }: Props) {
  useLearnProgress();
  const chapterIds = chapters.map((c) => c.id);
  const { completed, total, pct } = topicProgress(topicId, chapterIds);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="eyebrow text-muted-foreground">Progress</span>
          <span className="font-mono text-[11px] tabular-nums text-foreground/80">
            {completed}/{total}
          </span>
        </div>
        <span
          className="font-mono text-[11px] tabular-nums"
          style={{ color: accent }}
        >
          {pct}%
        </span>
      </div>
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: accent }}
        />
      </div>

      <ol className="flex flex-col gap-2 mt-2">
        {chapters.map((ch, idx) => {
          const prev = chapters[idx - 1];
          const prevGates = prev
            ? chapterGates(getChapterProgress(prev.id))
            : { completed: true, read: true, drilled: true };
          const selfGates = chapterGates(getChapterProgress(ch.id));
          const locked = idx > 0 && !prevGates.completed && !selfGates.read;
          return (
            <li key={ch.id}>
              <Link
                href={`/learn/${topicSlug}/${ch.slug}`}
                className={`glass topic-glow relative flex items-center gap-3 rounded-2xl p-3.5 transition-all hover:border-foreground/20 active:scale-[0.995] ${
                  locked ? "opacity-70" : ""
                }`}
                style={{ "--accent": accent } as React.CSSProperties}
              >
                <span
                  className="size-8 rounded-full flex items-center justify-center shrink-0 font-mono text-[11px] tabular-nums"
                  style={{
                    background: selfGates.completed
                      ? `color-mix(in oklch, ${accent} 22%, transparent)`
                      : "var(--muted)",
                    color: selfGates.completed ? accent : undefined,
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold leading-tight truncate">
                    {ch.label}
                  </p>
                  <p className="eyebrow text-muted-foreground/80 text-[9px] mt-0.5">
                    {ch.cardCount} cards · {ch.difficultyMix.easy}E /{" "}
                    {ch.difficultyMix.medium}M / {ch.difficultyMix.hard}H
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <GateDot
                    active={selfGates.read}
                    icon={<BookOpen className="size-3" strokeWidth={2} />}
                    accent={accent}
                  />
                  <GateDot
                    active={selfGates.drilled}
                    icon={<Zap className="size-3" strokeWidth={2} />}
                    accent={accent}
                  />
                  {selfGates.completed ? (
                    <CheckCircle2
                      className="size-4"
                      style={{ color: accent }}
                      strokeWidth={2}
                    />
                  ) : locked ? (
                    <Lock
                      className="size-3.5 text-muted-foreground/60"
                      strokeWidth={2}
                    />
                  ) : (
                    <CircleDashed
                      className="size-4 text-muted-foreground/60"
                      strokeWidth={1.8}
                    />
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function GateDot({
  active,
  icon,
  accent,
}: {
  active: boolean;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <span
      className="size-5 rounded-full flex items-center justify-center transition-colors"
      style={{
        background: active
          ? `color-mix(in oklch, ${accent} 22%, transparent)`
          : "transparent",
        color: active ? accent : "var(--muted-foreground)",
        opacity: active ? 1 : 0.4,
      }}
    >
      {icon}
    </span>
  );
}

"use client";

import { motion } from "framer-motion";
import { BookOpen, ChevronDown, Lightbulb, Quote, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CardContent } from "@/components/card-content";
import { ChapterDrill } from "@/components/chapter-drill";
import type { ChapterContent } from "@/lib/chapter-content";
import type { Chapter } from "@/lib/curriculum";
import {
  chapterGates,
  markChapterRead,
  markChapterVisited,
  useLearnProgress,
} from "@/lib/learn-progress";
import type { Flashcard } from "@/lib/schema";

type Props = {
  topicSlug: string;
  topicLabel: string;
  topicEmoji: string;
  accent: string;
  chapter: Chapter;
  cards: Flashcard[];
  content: ChapterContent;
  prev: { slug: string; label: string } | null;
  next: { slug: string; label: string } | null;
};

type Section = "read" | "examples" | "drill" | "senior";

export function ChapterView({
  topicSlug,
  topicLabel,
  topicEmoji,
  accent,
  chapter,
  cards,
  content,
  prev,
  next,
}: Props) {
  const progressMap = useLearnProgress();
  const progress = progressMap[chapter.id];
  const gates = chapterGates(
    progress ?? {
      read: false,
      drillRecall: 0,
      drillRuns: 0,
      cardsReviewed: 0,
      lastVisited: 0,
      completedAt: null,
    },
  );

  const [activeSection, setActiveSection] = useState<Section>("read");
  const [drillOpen, setDrillOpen] = useState(false);
  const readRef = useRef<HTMLDivElement | null>(null);
  const readTriggered = useRef(false);

  useEffect(() => {
    markChapterVisited(chapter.id);
  }, [chapter.id]);

  useEffect(() => {
    if (readTriggered.current) return;
    const el = readRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            markChapterRead(chapter.id);
            readTriggered.current = true;
            obs.disconnect();
          }
        }
      },
      { threshold: [0, 0.6, 1] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [chapter.id]);

  const sections: Array<{
    id: Section;
    label: string;
    icon: typeof BookOpen;
    done: boolean;
  }> = [
    { id: "read", label: "Read", icon: BookOpen, done: gates.read },
    {
      id: "examples",
      label: "Examples",
      icon: Lightbulb,
      done: gates.read,
    },
    { id: "drill", label: "Drill", icon: Zap, done: gates.drilled },
    { id: "senior", label: "Senior", icon: Quote, done: gates.completed },
  ];

  return (
    <main
      className="min-h-dvh flex flex-col gap-8 p-6 max-w-2xl mx-auto w-full safe-top lg:max-w-4xl lg:p-10 lg:gap-12"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link
            href={`/learn/${topicSlug}`}
            className="eyebrow text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
          >
            ← {topicEmoji} {topicLabel}
          </Link>
          <span className="eyebrow font-mono text-[10px] text-muted-foreground tabular-nums">
            Chapter {String(chapter.order + 1).padStart(2, "0")}
          </span>
        </div>
        <div>
          <span className="eyebrow" style={{ color: accent }}>
            {chapter.cardCount} cards · {chapter.difficultyMix.easy}E /{" "}
            {chapter.difficultyMix.medium}M / {chapter.difficultyMix.hard}H
          </span>
          <h1 className="font-serif text-[36px] lg:text-[52px] leading-[0.95] tracking-[-0.02em] mt-2 text-balance">
            {chapter.label}
            <span className="italic text-muted-foreground/80">.</span>
          </h1>
        </div>

        <nav className="glass rounded-full p-1 flex items-center gap-1 self-start">
          {sections.map((s) => {
            const Icon = s.icon;
            const active = activeSection === s.id;
            return (
              <button
                type="button"
                key={s.id}
                onClick={() => {
                  setActiveSection(s.id);
                  document.getElementById(`sec-${s.id}`)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="chapter-section-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `color-mix(in oklch, ${accent} 18%, transparent)`,
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="relative z-10 inline-flex items-center gap-1.5">
                  <Icon
                    className="size-3"
                    strokeWidth={2}
                    style={s.done ? { color: accent } : undefined}
                  />
                  {s.label}
                </span>
              </button>
            );
          })}
        </nav>
      </header>

      <section id="sec-read" ref={readRef} className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <BookOpen
            className="size-3.5"
            style={{ color: accent }}
            strokeWidth={2}
          />
          <h2 className="eyebrow">Read</h2>
        </div>
        <div className="glass rounded-3xl p-5 lg:p-6 flex flex-col gap-5">
          {content.notes.raw ? (
            <CardContent text={content.notes.raw} />
          ) : (
            <>
              <p className="text-[15px] leading-relaxed text-foreground/90">
                {content.notes.overview}
              </p>
              {content.notes.keyPoints.length > 0 && (
                <div>
                  <p className="eyebrow text-muted-foreground mb-2">
                    Key points
                  </p>
                  <ul className="flex flex-col gap-2">
                    {content.notes.keyPoints.map((p) => (
                      <li
                        key={p}
                        className="text-[13.5px] leading-relaxed text-foreground/85 flex gap-2.5"
                      >
                        <span
                          className="mt-[7px] size-1.5 rounded-full shrink-0"
                          style={{ background: accent }}
                          aria-hidden
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {content.notes.pitfalls.length > 0 && (
                <div>
                  <p className="eyebrow text-muted-foreground mb-2">Pitfalls</p>
                  <ul className="flex flex-col gap-2">
                    {content.notes.pitfalls.map((p) => (
                      <li
                        key={p}
                        className="text-[13px] leading-relaxed text-foreground/80 flex gap-2.5"
                      >
                        <span
                          className="mt-[7px] size-1.5 rounded-full shrink-0 bg-rose-500/70"
                          aria-hidden
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {content.examples.items.length > 0 && (
        <section id="sec-examples" className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Lightbulb
              className="size-3.5"
              style={{ color: accent }}
              strokeWidth={2}
            />
            <h2 className="eyebrow">Worked examples</h2>
          </div>
          <div className="flex flex-col gap-3">
            {content.examples.items.map((item) => (
              <ExampleItem
                key={item.title}
                title={item.title}
                prompt={item.prompt}
                walkthrough={item.walkthrough}
                accent={accent}
              />
            ))}
          </div>
        </section>
      )}

      <section id="sec-drill" className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Zap className="size-3.5" style={{ color: accent }} strokeWidth={2} />
          <h2 className="eyebrow">Drill</h2>
        </div>
        {drillOpen ? (
          <ChapterDrill
            chapterId={chapter.id}
            cards={cards}
            accent={accent}
            onExit={() => setDrillOpen(false)}
          />
        ) : (
          <div
            className="glass-strong topic-glow rounded-3xl p-6 flex flex-col items-center gap-3 text-center"
            style={{ "--accent": accent } as React.CSSProperties}
          >
            <p className="eyebrow text-muted-foreground">
              {gates.drilled
                ? `Drilled · ${Math.round((progress?.drillRecall ?? 0) * 100)}% best`
                : "Time to lock it in"}
            </p>
            <p className="font-serif text-[28px] leading-none tracking-tight">
              {cards.length} cards await
              <span className="italic text-muted-foreground/80">.</span>
            </p>
            <p className="text-[13px] text-muted-foreground max-w-sm">
              Rate each card. Hit ≥80% recall to clear the gate — your ratings
              also feed the main SRS queue.
            </p>
            <button
              type="button"
              onClick={() => setDrillOpen(true)}
              className="glass mt-1 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold hover:border-foreground/30 transition-colors"
              style={{ color: accent }}
            >
              <Zap className="size-3.5" strokeWidth={2.2} />
              {gates.drilled ? "Drill again" : "Start drill"}
            </button>
          </div>
        )}
      </section>

      {content.senior.insights.length + content.senior.quotes.length > 0 && (
        <section id="sec-senior" className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Quote
              className="size-3.5"
              style={{ color: accent }}
              strokeWidth={2}
            />
            <h2 className="eyebrow">Senior signal</h2>
          </div>
          <div className="flex flex-col gap-3">
            {content.senior.insights.length > 0 && (
              <div className="glass rounded-3xl p-5 flex flex-col gap-2.5">
                <p className="eyebrow text-muted-foreground">Insights</p>
                <ul className="flex flex-col gap-2.5">
                  {content.senior.insights.map((ins) => (
                    <li
                      key={ins}
                      className="text-[13.5px] leading-relaxed text-foreground/85"
                    >
                      {ins}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {content.senior.quotes.length > 0 && (
              <div className="flex flex-col gap-2.5">
                {content.senior.quotes.map((q) => (
                  <blockquote
                    key={q}
                    className="glass rounded-2xl p-4 border-l-2 text-[13px] italic leading-relaxed text-foreground/80"
                    style={{ borderLeftColor: accent }}
                  >
                    {q}
                  </blockquote>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <footer className="grid grid-cols-2 gap-3 pt-6 border-t border-foreground/10">
        {prev ? (
          <Link
            href={`/learn/${topicSlug}/${prev.slug}`}
            className="glass rounded-2xl p-3.5 flex flex-col items-start gap-1 hover:border-foreground/20 active:scale-[0.99] transition-all"
          >
            <span className="eyebrow text-muted-foreground/80 text-[9px]">
              ← Previous
            </span>
            <span className="text-[13px] font-semibold truncate w-full">
              {prev.label}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/learn/${topicSlug}/${next.slug}`}
            className="glass rounded-2xl p-3.5 flex flex-col items-end gap-1 hover:border-foreground/20 active:scale-[0.99] transition-all text-right"
          >
            <span className="eyebrow text-muted-foreground/80 text-[9px]">
              Next →
            </span>
            <span className="text-[13px] font-semibold truncate w-full">
              {next.label}
            </span>
          </Link>
        ) : (
          <Link
            href={`/learn/${topicSlug}`}
            className="glass rounded-2xl p-3.5 flex flex-col items-end gap-1 hover:border-foreground/20 active:scale-[0.99] transition-all text-right"
          >
            <span className="eyebrow text-muted-foreground/80 text-[9px]">
              Chapter list →
            </span>
            <span className="text-[13px] font-semibold truncate w-full">
              Back to {topicLabel}
            </span>
          </Link>
        )}
      </footer>
    </main>
  );
}

function ExampleItem({
  title,
  prompt,
  walkthrough,
  accent,
}: {
  title: string;
  prompt: string;
  walkthrough: string;
  accent: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-3xl p-5 flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-3 text-left group"
      >
        <div className="flex-1 min-w-0">
          <p className="eyebrow" style={{ color: accent }}>
            Example
          </p>
          <p className="text-[14px] font-semibold mt-1 leading-snug">{title}</p>
        </div>
        <ChevronDown
          className={`size-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>
      <div className="pt-2 border-t border-foreground/10">
        <p className="eyebrow text-muted-foreground mb-2">Prompt</p>
        <div className="text-[13px] text-foreground/85">
          <CardContent text={prompt} />
        </div>
      </div>
      {open && (
        <div className="pt-2 border-t border-foreground/10">
          <p className="eyebrow text-muted-foreground mb-2">Walkthrough</p>
          <div className="text-[13px] text-foreground/85">
            <CardContent text={walkthrough} />
          </div>
        </div>
      )}
    </div>
  );
}

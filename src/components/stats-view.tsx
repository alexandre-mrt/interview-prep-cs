"use client";

import { Flame, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { TopicId } from "@/lib/schema";
import { projectedRetention } from "@/lib/srs";
import {
  dueCount,
  loadStates,
  loadStats,
  loadStreak,
  masteredCount,
  type SessionStats,
  type StreakData,
} from "@/lib/storage";

type TopicSummary = {
  topicId: TopicId;
  label: string;
  emoji: string;
  accent: string;
  cardIds: string[];
};

type StatsViewProps = {
  topics: TopicSummary[];
  totalCards: number;
};

export function StatsView({ topics, totalCards }: StatsViewProps) {
  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState<StreakData>({
    current: 0,
    longest: 0,
    lastReviewDate: "",
    daysReviewed: [],
  });
  const [stats, setStats] = useState<SessionStats>({
    totalReviews: 0,
    byRating: { 1: 0, 2: 0, 3: 0, 4: 0 },
    lastSessionAt: 0,
  });
  const [totalDue, setTotalDue] = useState(0);
  const [overallMastered, setOverallMastered] = useState(0);
  const [avgRetention, setAvgRetention] = useState(0);
  const [topicStats, setTopicStats] = useState<
    Array<TopicSummary & { mastered: number; due: number; pct: number }>
  >([]);

  useEffect(() => {
    const allIds = topics.flatMap((t) => t.cardIds);
    setStreak(loadStreak());
    setStats(loadStats());
    setTotalDue(dueCount(allIds));
    setOverallMastered(masteredCount(allIds));

    const states = loadStates();
    const seen = allIds.map((id) => states[id]).filter(Boolean);
    if (seen.length > 0) {
      const sum = seen.reduce((acc, s) => acc + projectedRetention(s), 0);
      setAvgRetention(sum / seen.length);
    }

    setTopicStats(
      topics.map((t) => {
        const mastered = masteredCount(t.cardIds);
        const due = dueCount(t.cardIds);
        const pct = t.cardIds.length === 0 ? 0 : mastered / t.cardIds.length;
        return { ...t, mastered, due, pct };
      }),
    );
    setMounted(true);
  }, [topics]);

  const totalReviews = stats.totalReviews;
  const recallTotal = stats.byRating[2] + stats.byRating[3] + stats.byRating[4];
  const recallPct =
    totalReviews > 0 ? Math.round((recallTotal / totalReviews) * 100) : 0;

  return (
    <>
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Home
        </Link>
        <h1 className="text-sm font-medium">Stats</h1>
        <div className="w-14" />
      </header>

      <section>
        <h2 className="text-[11px] tracking-widest uppercase text-muted-foreground font-medium mb-3">
          Overview
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Streak"
            value={mounted ? `${streak.current}d` : "—"}
            sub={mounted ? `longest ${streak.longest}d` : ""}
            icon={<Flame className="size-4 text-amber-500" />}
            tone="amber"
          />
          <StatCard
            label="Due now"
            value={mounted ? String(totalDue) : "—"}
            sub={`of ${totalCards} cards`}
            icon={<Target className="size-4 text-sky-500" />}
            tone="sky"
          />
          <StatCard
            label="Mastered"
            value={mounted ? String(overallMastered) : "—"}
            sub={
              mounted && totalCards > 0
                ? `${Math.round((overallMastered / totalCards) * 100)}%`
                : ""
            }
            icon={<TrendingUp className="size-4 text-emerald-500" />}
            tone="emerald"
          />
          <StatCard
            label="Retention"
            value={mounted ? `${Math.round(avgRetention * 100)}%` : "—"}
            sub={`${totalReviews} reviews`}
            icon={<TrendingUp className="size-4 text-fuchsia-500" />}
            tone="fuchsia"
          />
        </div>
      </section>

      {mounted && totalReviews > 0 && (
        <section>
          <h2 className="text-[11px] tracking-widest uppercase text-muted-foreground font-medium mb-3">
            Grade distribution · {recallPct}% recall
          </h2>
          <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-4">
            <div className="flex h-2.5 rounded-full overflow-hidden">
              <Bar
                count={stats.byRating[1]}
                total={totalReviews}
                color="oklch(0.65 0.22 20)"
              />
              <Bar
                count={stats.byRating[2]}
                total={totalReviews}
                color="oklch(0.78 0.17 70)"
              />
              <Bar
                count={stats.byRating[3]}
                total={totalReviews}
                color="oklch(0.72 0.15 150)"
              />
              <Bar
                count={stats.byRating[4]}
                total={totalReviews}
                color="oklch(0.78 0.16 175)"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3 text-center">
              <GradeLegend
                label="Again"
                value={stats.byRating[1]}
                color="text-rose-400"
              />
              <GradeLegend
                label="Hard"
                value={stats.byRating[2]}
                color="text-amber-400"
              />
              <GradeLegend
                label="Good"
                value={stats.byRating[3]}
                color="text-emerald-400"
              />
              <GradeLegend
                label="Easy"
                value={stats.byRating[4]}
                color="text-teal-400"
              />
            </div>
          </div>
        </section>
      )}

      <section className="pb-8">
        <h2 className="text-[11px] tracking-widest uppercase text-muted-foreground font-medium mb-3">
          By topic
        </h2>
        <ul className="flex flex-col gap-2">
          {topicStats.map((t) => (
            <li key={t.topicId}>
              <Link
                href={`/topic/${t.topicId}`}
                className="group flex items-center gap-3 rounded-2xl bg-card p-3.5 ring-1 ring-foreground/10 hover:ring-foreground/25 transition-all"
              >
                <span
                  aria-hidden
                  className="w-1 self-stretch rounded-full"
                  style={{ background: t.accent }}
                />
                <span className="text-xl shrink-0" aria-hidden>
                  {t.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-[13.5px] font-medium truncate">
                      {t.label}
                    </p>
                    <p className="text-[11px] tabular-nums text-muted-foreground shrink-0">
                      {mounted ? `${t.mastered}/${t.cardIds.length}` : "—"}
                    </p>
                  </div>
                  <div className="h-1 rounded-full bg-foreground/10 overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${Math.round(t.pct * 100)}%`,
                        background: t.accent,
                      }}
                    />
                  </div>
                </div>
                {mounted && t.due > 0 && (
                  <span className="text-[10px] tabular-nums font-semibold text-sky-400 bg-sky-500/10 rounded-full px-2 py-0.5 border border-sky-500/20 shrink-0">
                    {t.due} due
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  tone: "amber" | "sky" | "emerald" | "fuchsia";
}) {
  const toneBg: Record<typeof tone, string> = {
    amber: "bg-amber-500/10 border-amber-500/20",
    sky: "bg-sky-500/10 border-sky-500/20",
    emerald: "bg-emerald-500/10 border-emerald-500/20",
    fuchsia: "bg-fuchsia-500/10 border-fuchsia-500/20",
  };
  return (
    <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] tracking-widest uppercase text-muted-foreground font-medium">
          {label}
        </p>
        <span
          className={`size-6 rounded-md border flex items-center justify-center ${toneBg[tone]}`}
        >
          {icon}
        </span>
      </div>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      {sub && (
        <p className="text-[11px] text-muted-foreground mt-0.5 tabular-nums">
          {sub}
        </p>
      )}
    </div>
  );
}

function Bar({
  count,
  total,
  color,
}: {
  count: number;
  total: number;
  color: string;
}) {
  const pct = total === 0 ? 0 : (count / total) * 100;
  if (pct === 0) return null;
  return (
    <div
      style={{ width: `${pct}%`, background: color }}
      className="transition-all"
    />
  );
}

function GradeLegend({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <p className={`text-lg font-semibold tabular-nums ${color}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}

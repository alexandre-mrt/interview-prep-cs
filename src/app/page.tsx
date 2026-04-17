import { ArrowRight, Layers3, Timer } from "lucide-react";
import Link from "next/link";
import { DailyReviewCta } from "@/components/daily-review-cta";
import { ThemeToggle } from "@/components/theme-toggle";
import { TopicCard } from "@/components/topic-card";
import { loadAllFlashcards } from "@/lib/content-loader";
import { type TopicId, TopicMeta } from "@/lib/schema";

export default function Home() {
  const cards = loadAllFlashcards();
  const allCardIds = cards.map((c) => c.id);

  const topicGroups = Object.entries(TopicMeta).map(([topicId, meta]) => {
    const topicCards = cards.filter((c) => c.topic === topicId);
    return {
      ...meta,
      topicId: topicId as TopicId,
      totalCards: topicCards.length,
      cardIds: topicCards.map((c) => c.id),
    };
  });

  return (
    <main className="min-h-dvh flex flex-col gap-12 p-6 max-w-2xl mx-auto w-full safe-top">
      <div className="flex items-center justify-between pt-4">
        <span className="eyebrow text-muted-foreground">CS · senior track</span>
        <ThemeToggle />
      </div>

      <section>
        <DailyReviewCta allCardIds={allCardIds} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <h2 className="eyebrow text-muted-foreground">Topics</h2>
          <span className="eyebrow text-muted-foreground/70">
            {cards.length} cards
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {topicGroups.map((t) => (
            <TopicCard
              key={t.topicId}
              slug={t.slug}
              emoji={t.emoji}
              label={t.label}
              totalCards={t.totalCards}
              cardIds={t.cardIds}
            />
          ))}
        </div>
      </section>

      <section className="flex gap-2.5 pb-8">
        <Link
          href="/mock"
          className="flex-1 glass rounded-2xl p-4 flex items-center justify-between hover:border-foreground/20 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="size-9 rounded-xl bg-foreground/5 flex items-center justify-center">
              <Timer className="size-4" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-[13px] font-semibold leading-tight">
                Mock interview
              </p>
              <p className="eyebrow text-muted-foreground/80 text-[9px] mt-0.5">
                Timed practice
              </p>
            </div>
          </div>
          <ArrowRight
            className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
            strokeWidth={1.8}
          />
        </Link>
        <Link
          href="/review"
          className="flex-1 glass rounded-2xl p-4 flex items-center justify-between hover:border-foreground/20 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="size-9 rounded-xl bg-foreground/5 flex items-center justify-center">
              <Layers3 className="size-4" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-[13px] font-semibold leading-tight">
                All cards
              </p>
              <p className="eyebrow text-muted-foreground/80 text-[9px] mt-0.5">
                Browse &amp; shuffle
              </p>
            </div>
          </div>
          <ArrowRight
            className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
            strokeWidth={1.8}
          />
        </Link>
      </section>
    </main>
  );
}

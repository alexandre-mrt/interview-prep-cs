import Link from "next/link";
import { DailyReviewCta } from "@/components/daily-review-cta";
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
    <main className="min-h-dvh flex flex-col gap-10 p-6 max-w-2xl mx-auto w-full">
      <section className="pt-10">
        <DailyReviewCta allCardIds={allCardIds} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Topics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

      <footer className="flex gap-3 pb-6">
        <Link
          href="/mock"
          className="flex-1 text-center py-3 rounded-xl bg-card ring-1 ring-foreground/10 text-sm font-medium hover:ring-foreground/20 transition-all"
        >
          Mock interview
        </Link>
        <Link
          href="/review"
          className="flex-1 text-center py-3 rounded-xl bg-card ring-1 ring-foreground/10 text-sm font-medium hover:ring-foreground/20 transition-all"
        >
          All cards
        </Link>
      </footer>
    </main>
  );
}

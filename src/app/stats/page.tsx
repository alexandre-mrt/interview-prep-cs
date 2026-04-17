import { StatsView } from "@/components/stats-view";
import { loadAllFlashcards } from "@/lib/content-loader";
import { type TopicId, TopicMeta } from "@/lib/schema";

export default function StatsPage() {
  const cards = loadAllFlashcards();
  const topics = Object.entries(TopicMeta).map(([topicId, meta]) => {
    const topicCards = cards.filter((c) => c.topic === topicId);
    return {
      topicId: topicId as TopicId,
      label: meta.label,
      emoji: meta.emoji,
      accent: meta.accent,
      cardIds: topicCards.map((c) => c.id),
    };
  });

  return (
    <main className="min-h-dvh flex flex-col gap-8 p-6 max-w-2xl mx-auto w-full lg:max-w-5xl lg:p-10 lg:gap-10">
      <StatsView topics={topics} totalCards={cards.length} />
    </main>
  );
}

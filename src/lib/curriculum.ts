import { loadAllFlashcards } from "@/lib/content-loader";
import type { Flashcard } from "@/lib/schema";
import { type TopicId, TopicMeta } from "@/lib/schema";

export type Chapter = {
  id: string;
  topicId: TopicId;
  slug: string;
  label: string;
  cardCount: number;
  cardIds: string[];
  difficultyMix: { easy: number; medium: number; hard: number };
  order: number;
};

export type TopicCurriculum = {
  topicId: TopicId;
  label: string;
  emoji: string;
  accent: string;
  slug: string;
  chapters: Chapter[];
  totalCards: number;
};

function humanize(slug: string): string {
  return slug
    .split("-")
    .map((s) =>
      s.length <= 2 ? s.toUpperCase() : s[0].toUpperCase() + s.slice(1),
    )
    .join(" ");
}

function groupBySubtopic(cards: Flashcard[]): Map<string, Flashcard[]> {
  const map = new Map<string, Flashcard[]>();
  for (const c of cards) {
    const key = c.subtopic;
    const arr = map.get(key) ?? [];
    arr.push(c);
    map.set(key, arr);
  }
  return map;
}

function buildChapters(topicId: TopicId, cards: Flashcard[]): Chapter[] {
  const grouped = groupBySubtopic(cards);
  const slugs = [...grouped.keys()].sort();
  return slugs.map((slug, index) => {
    const chapterCards = grouped.get(slug) ?? [];
    const mix = { easy: 0, medium: 0, hard: 0 };
    for (const card of chapterCards) {
      if (card.difficulty === "easy") mix.easy++;
      else if (card.difficulty === "medium") mix.medium++;
      else mix.hard++;
    }
    return {
      id: `${topicId}/${slug}`,
      topicId,
      slug,
      label: humanize(slug),
      cardCount: chapterCards.length,
      cardIds: chapterCards.map((c) => c.id),
      difficultyMix: mix,
      order: index,
    };
  });
}

let cache: TopicCurriculum[] | null = null;

export function loadCurriculum(): TopicCurriculum[] {
  if (cache) return cache;
  const allCards = loadAllFlashcards();
  const result: TopicCurriculum[] = [];
  for (const [topicId, meta] of Object.entries(TopicMeta) as [
    TopicId,
    (typeof TopicMeta)[TopicId],
  ][]) {
    const topicCards = allCards.filter((c) => c.topic === topicId);
    const chapters = buildChapters(topicId, topicCards);
    result.push({
      topicId,
      label: meta.label,
      emoji: meta.emoji,
      accent: meta.accent,
      slug: meta.slug,
      chapters,
      totalCards: topicCards.length,
    });
  }
  cache = result;
  return result;
}

export function loadTopicCurriculum(topicId: TopicId): TopicCurriculum | null {
  return loadCurriculum().find((t) => t.topicId === topicId) ?? null;
}

export function loadChapter(
  topicId: TopicId,
  chapterSlug: string,
): {
  curriculum: TopicCurriculum;
  chapter: Chapter;
  cards: Flashcard[];
} | null {
  const curriculum = loadTopicCurriculum(topicId);
  if (!curriculum) return null;
  const chapter = curriculum.chapters.find((ch) => ch.slug === chapterSlug);
  if (!chapter) return null;
  const allCards = loadAllFlashcards();
  const idSet = new Set(chapter.cardIds);
  const cards = allCards.filter((c) => idSet.has(c.id));
  return { curriculum, chapter, cards };
}

export function getAllChapterPaths(): Array<{
  topic: string;
  chapter: string;
}> {
  const out: Array<{ topic: string; chapter: string }> = [];
  for (const t of loadCurriculum()) {
    for (const ch of t.chapters) {
      out.push({ topic: t.slug, chapter: ch.slug });
    }
  }
  return out;
}

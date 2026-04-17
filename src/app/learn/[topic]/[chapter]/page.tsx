import { notFound } from "next/navigation";
import { ChapterView } from "@/components/chapter-view";
import { loadChapterContent } from "@/lib/chapter-content";
import { getAllChapterPaths, loadChapter } from "@/lib/curriculum";
import { type TopicId, TopicMeta } from "@/lib/schema";

type Props = {
  params: Promise<{ topic: string; chapter: string }>;
};

export default async function ChapterPage({ params }: Props) {
  const { topic, chapter } = await params;
  const meta = TopicMeta[topic as TopicId];
  if (!meta) notFound();
  const loaded = loadChapter(topic as TopicId, chapter);
  if (!loaded) notFound();

  const { curriculum, chapter: ch, cards } = loaded;
  const content = loadChapterContent(curriculum.slug, ch.slug, cards);

  const idx = curriculum.chapters.findIndex((c) => c.slug === ch.slug);
  const prevCh = idx > 0 ? curriculum.chapters[idx - 1] : null;
  const nextCh =
    idx >= 0 && idx < curriculum.chapters.length - 1
      ? curriculum.chapters[idx + 1]
      : null;

  return (
    <ChapterView
      topicSlug={curriculum.slug}
      topicLabel={meta.label}
      topicEmoji={meta.emoji}
      accent={meta.accent}
      chapter={ch}
      cards={cards}
      content={content}
      prev={prevCh ? { slug: prevCh.slug, label: prevCh.label } : null}
      next={nextCh ? { slug: nextCh.slug, label: nextCh.label } : null}
    />
  );
}

export function generateStaticParams() {
  return getAllChapterPaths();
}

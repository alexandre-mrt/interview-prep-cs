import Link from "next/link";
import { notFound } from "next/navigation";
import { ChapterList } from "@/components/chapter-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { loadTopicCurriculum } from "@/lib/curriculum";
import { type TopicId, TopicMeta } from "@/lib/schema";

type Props = {
  params: Promise<{ topic: string }>;
};

export default async function LearnTopicPage({ params }: Props) {
  const { topic } = await params;
  const meta = TopicMeta[topic as TopicId];
  if (!meta) notFound();
  const curriculum = loadTopicCurriculum(topic as TopicId);
  if (!curriculum || curriculum.chapters.length === 0) notFound();

  return (
    <main className="min-h-dvh flex flex-col gap-8 p-6 max-w-2xl mx-auto w-full safe-top lg:max-w-4xl lg:p-10 lg:gap-12">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            href="/learn"
            className="eyebrow text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Learn
          </Link>
          <div className="flex items-center gap-3 mt-3">
            <span
              className="size-11 rounded-2xl flex items-center justify-center text-[24px] leading-none"
              style={{
                background: `color-mix(in oklch, ${meta.accent} 16%, transparent)`,
              }}
              aria-hidden
            >
              {meta.emoji}
            </span>
            <div className="min-w-0">
              <span className="eyebrow" style={{ color: meta.accent }}>
                Topic
              </span>
              <h1 className="font-serif text-[34px] lg:text-[48px] leading-[0.95] tracking-[-0.02em] mt-0.5 truncate">
                {meta.label}
                <span className="italic text-muted-foreground/80">.</span>
              </h1>
            </div>
          </div>
          <p className="text-[13px] text-muted-foreground/90 mt-3">
            {curriculum.chapters.length} chapters · {curriculum.totalCards}{" "}
            cards. Read, drill, repeat — until it feels inevitable.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <ChapterList
        topicId={curriculum.topicId}
        topicSlug={curriculum.slug}
        accent={meta.accent}
        chapters={curriculum.chapters}
      />

      <footer className="flex items-center justify-between gap-3 pt-4 border-t border-foreground/10">
        <Link
          href={`/topic/${curriculum.slug}`}
          className="eyebrow text-muted-foreground hover:text-foreground transition-colors"
        >
          Pure drill mode →
        </Link>
        <Link
          href="/mock"
          className="eyebrow text-muted-foreground hover:text-foreground transition-colors"
        >
          Mock interview →
        </Link>
      </footer>
    </main>
  );
}

export function generateStaticParams() {
  return Object.values(TopicMeta).map((meta) => ({ topic: meta.slug }));
}

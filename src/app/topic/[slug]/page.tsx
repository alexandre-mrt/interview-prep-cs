import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardDeck } from "@/components/card-deck";
import { loadFlashcardsByTopic } from "@/lib/content-loader";
import { type TopicId, TopicMeta } from "@/lib/schema";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
};

function loadTopicNotes(slug: string): string | null {
  const mdxPath = path.join(
    process.cwd(),
    "content",
    "cs",
    "topics",
    `${slug}.mdx`,
  );
  const mdPath = path.join(
    process.cwd(),
    "content",
    "cs",
    "topics",
    `${slug}.md`,
  );
  if (fs.existsSync(mdxPath)) return fs.readFileSync(mdxPath, "utf8");
  if (fs.existsSync(mdPath)) return fs.readFileSync(mdPath, "utf8");
  return null;
}

function renderMarkdown(raw: string): string {
  return raw
    .replace(
      /^### (.+)$/gm,
      "<h3 class='text-base font-semibold mt-5 mb-2'>$1</h3>",
    )
    .replace(
      /^## (.+)$/gm,
      "<h2 class='text-lg font-semibold mt-6 mb-2'>$1</h2>",
    )
    .replace(/^# (.+)$/gm, "<h1 class='text-xl font-bold mt-8 mb-3'>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /`(.+?)`/g,
      "<code class='bg-muted px-1 rounded text-xs font-mono'>$1</code>",
    )
    .replace(
      /^- (.+)$/gm,
      "<li class='ml-4 list-disc text-sm leading-relaxed'>$1</li>",
    )
    .replace(
      /^(\d+)\. (.+)$/gm,
      "<li class='ml-4 list-decimal text-sm leading-relaxed'>$2</li>",
    )
    .replace(
      /\n\n/g,
      "</p><p class='text-sm leading-relaxed text-foreground/80 mb-3'>",
    )
    .replace(/^/, "<p class='text-sm leading-relaxed text-foreground/80 mb-3'>")
    .concat("</p>");
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const meta = TopicMeta[slug as TopicId];
  if (!meta) notFound();

  const cards = loadFlashcardsByTopic(slug);
  const notes = loadTopicNotes(slug);

  return (
    <main className="min-h-dvh flex flex-col p-4 max-w-2xl mx-auto w-full pt-6">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Home
        </Link>
        <span className="text-sm font-medium">
          {meta.emoji} {meta.label}
        </span>
        <div className="w-14" />
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-4xl">{meta.emoji}</p>
          <h2 className="text-lg font-semibold">{meta.label}</h2>
          <p className="text-sm text-muted-foreground">
            No cards yet — check back soon.
          </p>
        </div>
      ) : (
        <section className="mb-10">
          <CardDeck cards={cards} initialMode="all" initialTopic={slug} />
        </section>
      )}

      {notes ? (
        <section className="border-t border-foreground/10 pt-8">
          <h2 className="text-base font-semibold mb-4">Notes</h2>
          <div
            className="prose-custom"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: safe static markdown from local files
            dangerouslySetInnerHTML={{ __html: renderMarkdown(notes) }}
          />
        </section>
      ) : (
        <section className="border-t border-foreground/10 pt-8">
          <p className="text-sm text-muted-foreground">Notes coming soon.</p>
        </section>
      )}
    </main>
  );
}

export function generateStaticParams() {
  return Object.keys(TopicMeta).map((slug) => ({ slug }));
}

import Link from "next/link";
import { LearnTopicCard } from "@/components/learn-topic-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { loadCurriculum } from "@/lib/curriculum";

export default function LearnIndexPage() {
  const curriculum = loadCurriculum();

  return (
    <main className="min-h-dvh flex flex-col gap-10 p-6 max-w-2xl mx-auto w-full safe-top lg:max-w-6xl lg:p-10 lg:gap-14">
      <header className="flex items-start justify-between lg:hidden">
        <div>
          <span className="eyebrow text-muted-foreground">Curriculum</span>
          <h1 className="font-serif text-[44px] leading-none tracking-[-0.02em] mt-2">
            Learn<span className="italic text-muted-foreground/80">.</span>
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <header className="hidden lg:block">
        <span className="eyebrow text-muted-foreground">Curriculum</span>
        <h1 className="font-serif text-[72px] leading-[0.92] tracking-[-0.02em] mt-3 text-balance">
          A senior engineer{" "}
          <span className="italic text-muted-foreground/85">studies</span>.
        </h1>
        <p className="text-[15px] text-muted-foreground/90 max-w-xl mt-4">
          Guided chapters per topic. Read the concept, drill the cards, absorb
          the senior nuance — then own the interview.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <h2 className="eyebrow text-muted-foreground">Topics</h2>
          <span className="eyebrow text-muted-foreground/70">
            {curriculum.reduce((sum, t) => sum + t.chapters.length, 0)} chapters
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {curriculum.map((t) => {
            const chapterIds = t.chapters.map((ch) => ch.id);
            const chapterSlugByID = Object.fromEntries(
              t.chapters.map((ch) => [ch.id, ch.slug]),
            );
            return (
              <LearnTopicCard
                key={t.topicId}
                topicId={t.topicId}
                topicSlug={t.slug}
                label={t.label}
                emoji={t.emoji}
                accent={t.accent}
                chapterCount={t.chapters.length}
                cardCount={t.totalCards}
                chapterIds={chapterIds}
                chapterSlugByID={chapterSlugByID}
              />
            );
          })}
        </div>
      </section>

      <section className="flex items-center justify-between gap-3 pt-2">
        <Link
          href="/review"
          className="eyebrow text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip to pure drill →
        </Link>
        <Link
          href="/mock"
          className="eyebrow text-muted-foreground hover:text-foreground transition-colors"
        >
          Mock interview →
        </Link>
      </section>
    </main>
  );
}

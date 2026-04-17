import Link from "next/link";
import { CardDeck } from "@/components/card-deck";
import { loadAllFlashcards } from "@/lib/content-loader";

type ReviewSearchParams = Promise<{
  mode?: string;
  topic?: string;
  difficulty?: string;
}>;

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: ReviewSearchParams;
}) {
  const params = await searchParams;
  const cards = loadAllFlashcards();
  const mode =
    params.mode === "due" || params.mode === "topic" ? params.mode : "all";

  return (
    <main className="min-h-dvh flex flex-col p-4 max-w-md mx-auto w-full pt-6 lg:max-w-3xl lg:p-10 lg:pt-10">
      <div className="flex items-center justify-between mb-6 lg:mb-10">
        <Link
          href="/"
          className="eyebrow text-muted-foreground hover:text-foreground transition-colors lg:hidden"
        >
          ← Home
        </Link>
        <div className="hidden lg:flex lg:flex-col lg:gap-1">
          <span className="eyebrow text-muted-foreground">Session</span>
          <h1 className="font-serif text-[32px] leading-none tracking-[-0.02em]">
            Review{" "}
            <span className="italic text-muted-foreground/90">deck.</span>
          </h1>
        </div>
        <span className="eyebrow text-muted-foreground lg:hidden">
          Flashcards
        </span>
        <div className="w-14 lg:hidden" />
      </div>

      <CardDeck
        cards={cards}
        initialMode={mode as "all" | "due" | "topic"}
        initialTopic={params.topic}
        initialDifficulty={params.difficulty}
      />
    </main>
  );
}

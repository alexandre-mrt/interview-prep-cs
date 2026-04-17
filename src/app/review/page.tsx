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
    <main className="min-h-dvh flex flex-col p-4 max-w-md mx-auto w-full pt-6">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Home
        </Link>
        <h1 className="text-sm font-medium">Flashcards</h1>
        <div className="w-14" />
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

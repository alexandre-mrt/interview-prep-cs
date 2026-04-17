import { MockSession } from "@/components/mock-session";
import { loadAllFlashcards } from "@/lib/content-loader";

export default function MockPage() {
  const cards = loadAllFlashcards().filter((c) => c.mock_eligible);
  return <MockSession cards={cards} />;
}

import { z } from "zod";

export const FlashcardSchema = z.object({
  id: z.string().min(1),
  topic: z.enum([
    "algos",
    "system-design",
    "backend",
    "blockchain",
    "ml",
    "mysten",
    "senior-signals",
    "classics",
    "behavioral",
  ]),
  subtopic: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  front: z.string().min(1),
  back: z.string().min(1),
  senior_nuance: z.string().optional(),
  quote_to_say: z.string().optional(),
  tags: z.array(z.string()).default([]),
  mock_eligible: z.boolean().default(false),
});
export type Flashcard = z.infer<typeof FlashcardSchema>;

export const TopicMeta = {
  algos: { label: "Algorithms & DS", emoji: "⚙️", slug: "algos" },
  "system-design": {
    label: "System Design",
    emoji: "🏗️",
    slug: "system-design",
  },
  backend: { label: "Backend & Infra", emoji: "🔧", slug: "backend" },
  blockchain: { label: "Blockchain", emoji: "⛓️", slug: "blockchain" },
  ml: { label: "ML / AI", emoji: "🧠", slug: "ml" },
  mysten: { label: "Mysten Labs", emoji: "🌊", slug: "mysten" },
  "senior-signals": {
    label: "Senior Signals",
    emoji: "🎯",
    slug: "senior-signals",
  },
  classics: { label: "OS · Net · Sec", emoji: "📚", slug: "classics" },
  behavioral: { label: "Behavioral", emoji: "💬", slug: "behavioral" },
} as const;
export type TopicId = keyof typeof TopicMeta;

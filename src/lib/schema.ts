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
  algos: {
    label: "Algorithms & DS",
    emoji: "⚙️",
    slug: "algos",
    accent: "oklch(0.72 0.15 220)",
  },
  "system-design": {
    label: "System Design",
    emoji: "🏗️",
    slug: "system-design",
    accent: "oklch(0.75 0.14 50)",
  },
  backend: {
    label: "Backend & Infra",
    emoji: "🔧",
    slug: "backend",
    accent: "oklch(0.72 0.13 160)",
  },
  blockchain: {
    label: "Blockchain",
    emoji: "⛓️",
    slug: "blockchain",
    accent: "oklch(0.72 0.18 300)",
  },
  ml: {
    label: "ML / AI",
    emoji: "🧠",
    slug: "ml",
    accent: "oklch(0.72 0.17 340)",
  },
  mysten: {
    label: "Mysten Labs",
    emoji: "🌊",
    slug: "mysten",
    accent: "oklch(0.72 0.15 200)",
  },
  "senior-signals": {
    label: "Senior Signals",
    emoji: "🎯",
    slug: "senior-signals",
    accent: "oklch(0.75 0.14 85)",
  },
  classics: {
    label: "OS · Net · Sec",
    emoji: "📚",
    slug: "classics",
    accent: "oklch(0.72 0.14 25)",
  },
  behavioral: {
    label: "Behavioral",
    emoji: "💬",
    slug: "behavioral",
    accent: "oklch(0.75 0.13 130)",
  },
} as const;
export type TopicId = keyof typeof TopicMeta;

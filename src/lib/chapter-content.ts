import fs from "node:fs";
import path from "node:path";
import type { Flashcard } from "@/lib/schema";

export type SynthSection = {
  heading: string;
  paragraphs: string[];
  bullets: string[];
};

export type ChapterContent = {
  notes: {
    overview: string;
    keyPoints: string[];
    pitfalls: string[];
    source: "override" | "synthesized";
    raw?: string;
  };
  examples: {
    items: Array<{ title: string; prompt: string; walkthrough: string }>;
    source: "override" | "synthesized";
    raw?: string;
  };
  senior: {
    insights: string[];
    quotes: string[];
    source: "override" | "synthesized";
    raw?: string;
  };
};

const CONTENT_SET = process.env.NEXT_PUBLIC_CONTENT_SET ?? "cs";

function readOptional(
  topicSlug: string,
  chapterSlug: string,
  file: string,
): string | null {
  const p = path.join(
    process.cwd(),
    "content",
    CONTENT_SET,
    "learn",
    topicSlug,
    chapterSlug,
    file,
  );
  try {
    if (fs.existsSync(p)) return fs.readFileSync(p, "utf8");
  } catch {}
  return null;
}

function firstSentence(text: string): string {
  const match = text.match(/^(.*?[.!?])(\s|$)/);
  return match ? match[1].trim() : text.slice(0, 180).trim();
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function hasKeyword(text: string, words: string[]): boolean {
  const lower = text.toLowerCase();
  return words.some((w) => lower.includes(w));
}

function pickPitfalls(cards: Flashcard[]): string[] {
  const keywords = [
    "pitfall",
    "common mistake",
    "gotcha",
    "never ",
    "don't ",
    "avoid",
  ];
  const out: string[] = [];
  for (const c of cards) {
    const sentences = splitSentences(c.back);
    for (const s of sentences) {
      if (hasKeyword(s, keywords) && s.length < 240) {
        out.push(s);
      }
    }
  }
  return Array.from(new Set(out)).slice(0, 6);
}

function pickKeyPoints(cards: Flashcard[]): string[] {
  const points = new Set<string>();
  const sorted = [...cards].sort((a, b) => {
    const order = { easy: 0, medium: 1, hard: 2 } as const;
    return order[a.difficulty] - order[b.difficulty];
  });
  for (const c of sorted) {
    const fs = firstSentence(c.back);
    if (fs && fs.length < 200) points.add(fs);
    if (points.size >= 6) break;
  }
  return [...points];
}

export function synthesizeNotes(cards: Flashcard[]): ChapterContent["notes"] {
  if (cards.length === 0) {
    return {
      overview: "No cards yet.",
      keyPoints: [],
      pitfalls: [],
      source: "synthesized",
    };
  }
  const intro = cards.find((c) => c.difficulty === "easy") ?? cards[0];
  const overview = firstSentence(intro.back);
  return {
    overview,
    keyPoints: pickKeyPoints(cards),
    pitfalls: pickPitfalls(cards),
    source: "synthesized",
  };
}

export function synthesizeExamples(
  cards: Flashcard[],
): ChapterContent["examples"] {
  const items: ChapterContent["examples"]["items"] = [];
  const withCode = cards.filter(
    (c) =>
      c.back.includes("```") ||
      /\b(function|class|def|const|let)\b/.test(c.back),
  );
  const mediumOrHard = cards.filter((c) => c.difficulty !== "easy");
  const pool =
    withCode.length > 0
      ? withCode
      : mediumOrHard.length > 0
        ? mediumOrHard
        : cards;
  for (const c of pool.slice(0, 2)) {
    items.push({
      title: c.subtopic
        ? `${c.subtopic}: ${firstSentence(c.front)}`
        : firstSentence(c.front),
      prompt: c.front,
      walkthrough: c.back,
    });
  }
  return { items, source: "synthesized" };
}

export function synthesizeSenior(cards: Flashcard[]): ChapterContent["senior"] {
  const insights: string[] = [];
  const quotes: string[] = [];
  for (const c of cards) {
    if (c.senior_nuance) insights.push(c.senior_nuance);
    if (c.quote_to_say) quotes.push(c.quote_to_say);
  }
  return {
    insights: Array.from(new Set(insights)),
    quotes: Array.from(new Set(quotes)),
    source: "synthesized",
  };
}

export function loadChapterContent(
  topicSlug: string,
  chapterSlug: string,
  cards: Flashcard[],
): ChapterContent {
  const notesOverride = readOptional(topicSlug, chapterSlug, "notes.md");
  const examplesOverride = readOptional(topicSlug, chapterSlug, "examples.md");
  const seniorOverride = readOptional(topicSlug, chapterSlug, "senior.md");

  const notes: ChapterContent["notes"] = notesOverride
    ? { ...synthesizeNotes(cards), source: "override", raw: notesOverride }
    : synthesizeNotes(cards);

  const examples: ChapterContent["examples"] = examplesOverride
    ? {
        ...synthesizeExamples(cards),
        source: "override",
        raw: examplesOverride,
      }
    : synthesizeExamples(cards);

  const senior: ChapterContent["senior"] = seniorOverride
    ? { ...synthesizeSenior(cards), source: "override", raw: seniorOverride }
    : synthesizeSenior(cards);

  return { notes, examples, senior };
}

import fs from "node:fs";
import path from "node:path";
import { type Flashcard, FlashcardSchema } from "./schema";

const CONTENT_SET = process.env.NEXT_PUBLIC_CONTENT_SET ?? "cs";

let cache: Flashcard[] | null = null;

export function loadAllFlashcards(): Flashcard[] {
  if (cache) return cache;
  const root = path.join(process.cwd(), "content", CONTENT_SET, "flashcards");
  const out: Flashcard[] = [];
  if (!fs.existsSync(root)) {
    cache = out;
    return out;
  }
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(p);
      } else if (entry.name.endsWith(".json")) {
        try {
          const raw = JSON.parse(fs.readFileSync(p, "utf8"));
          const arr = Array.isArray(raw) ? raw : [raw];
          for (const item of arr) {
            const parsed = FlashcardSchema.safeParse(item);
            if (parsed.success) {
              out.push(parsed.data);
            } else {
              console.warn(
                "[content-loader] invalid card in",
                p,
                parsed.error.issues[0],
              );
            }
          }
        } catch (e) {
          console.warn("[content-loader] parse error in", p, e);
        }
      }
    }
  };
  walk(root);
  cache = out;
  return out;
}

export function loadFlashcardsByTopic(topic: string): Flashcard[] {
  return loadAllFlashcards().filter((c) => c.topic === topic);
}

# Interview Prep — CS

Mobile-first flashcards for senior engineering interviews. 657 hand-authored cards covering algorithms, system design, backend/infra, blockchain, ML/AI, OS/networks/security classics, senior signals, behavioral, and a dedicated Mysten Labs section.

**Live:** https://interview-prep-cs.vercel.app

## Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript strict, Tailwind v4, shadcn/ui
- Zod for content validation
- Framer Motion for swipe gestures
- Fuse.js for cmd+K search
- SM-2 lite spaced repetition in localStorage
- PWA (manual service worker, offline-ready)
- Bun + Biome

## Content

657 flashcards across 9 topics:

| Topic | Cards |
|---|---|
| Algorithms & DS | 120 |
| System Design | 100 |
| Backend & Infra | 80 |
| Blockchain | 80 |
| Mysten Labs | 60 |
| ML / AI | 60 |
| Senior Signals | 50 |
| OS · Net · Sec | 50 |
| Behavioral | 30 |
| Seed | 27 |

Every card has `front`, `back`, optional `senior_nuance` and `quote_to_say`. Mock-eligible cards (387) feed the timed mock interview mode.

Content is a static JSON set under `content/cs/flashcards/<topic>/*.json`, validated at load time against `src/lib/schema.ts`. Swap `CONTENT_SET` to add a different set without touching UI code.

## Features

- **Home** — topic grid with progress rings + daily-review CTA
- **Review** — swipe viewer (left=hard, right=easy, up=medium, tap=flip)
- **Topic detail** — filtered review per topic, long-form notes for Mysten
- **Mock interview** — timer (2/3/5/10 min), topic filter, session summary
- **cmd+K** — fuzzy search across all cards
- **PWA** — install to phone, offline-first

## Develop

```bash
bun install
bun run dev
bun run build
bunx biome check --write .
```

## Content authoring

Each card:

```json
{
  "id": "topic-slug-short-name",
  "topic": "algos",
  "subtopic": "graphs",
  "difficulty": "medium",
  "front": "Prompt",
  "back": "Answer",
  "senior_nuance": "What a senior sees that a mid doesn't",
  "quote_to_say": "Memorable one-liner for interviews",
  "tags": ["graph", "bfs"],
  "mock_eligible": true
}
```

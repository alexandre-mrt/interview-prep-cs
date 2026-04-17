# Interview Prep CS — Night Shift Enriched Spec

## Goal
Build a mobile-first interview prep site for Computer Science (today). Tomorrow: same template, Finance content. User is sleeping — deliver a working, deployed site by morning.

## Target roles (content must land for all)
1. Blockchain / Smart contract — Sui Move, Solidity, Solana, ZK, contract security
2. Backend / Infra / DevOps — DBs, distributed systems, K8s, CI/CD, cloud, caching, queues
3. ML / AI engineer — ML systems, LLM apps, RAG, MLOps, vector DBs, evals
4. Scaling / System design at scale — sharding, consistent hashing, CAP, consensus, CDN, rate limiting
5. Mysten Labs — dedicated deep section (see MYSTEN_RESEARCH.md produced by research agent)

## Content scope (500-800 flashcards + long-form pages)
Target distribution:
- 120 algos & data structures
- 100 system design / scaling
- 80 backend / infra / DevOps
- 80 blockchain / smart contract
- 60 ML / AI
- 60 Mysten Labs (from MYSTEN_RESEARCH.md)
- 50 senior signals / behavioral tradeoffs
- 50 OS / networks / concurrency / security classics

Each flashcard:
```json
{
  "id": "unique-kebab-id",
  "topic": "algos" | "system-design" | "backend" | "blockchain" | "ml" | "mysten" | "senior-signals" | "classics",
  "subtopic": "e.g. hashmaps, caching, move-abilities",
  "difficulty": "easy" | "medium" | "hard",
  "front": "question",
  "back": "concise answer",
  "senior_nuance": "tradeoff or second-order insight a senior would mention",
  "quote_to_say": "optional quote-ready phrase",
  "tags": ["..."]
}
```

## Stack
- Next.js 15 (App Router) + TypeScript strict + Tailwind + shadcn/ui
- Framer Motion for swipe
- Fuse.js for cmd+k search
- PWA via next-pwa or manual service worker
- Bun package manager
- Biome for lint+format
- No backend — all content static JSON bundled

## UI requirements
### Home (Mixed mode — user choice)
- Hero CTA: "Start today's review" → daily SRS deck (~20-30 cards due)
- Below: topic grid with progress rings (cards seen / mastered)
- Mock interview entry point
- Dark mode default

### Flashcard viewer
- Full-screen swipe: left = hard, right = easy, up = medium, tap = flip
- Framer Motion drag with elastic rebound
- Progress saved in localStorage (SM-2 lite: next review date, ease factor)
- Filter bar: topic + difficulty + "due only" toggle
- Shuffle button

### Topic detail page
- Long-form MDX notes (senior-level)
- Embedded flashcard deck for that topic

### Mock interview mode (essential)
- Question bank (subset of flashcards marked mock-eligible)
- Chrono 2-5min (configurable)
- Reveal "strong answer outline" after timer or manual reveal
- Save self-rating (got it / partial / missed)

### Behavioral sections
- STAR stories: templates for Leadership, Conflict, Failure, Impact, Ambiguity, Disagreement — with placeholders user fills later
- Questions to ask the interviewer (senior-signal ones)
- Salary negotiation tactics + phrases

### Search (cmd+k)
- Fuse.js across all flashcards (front + back + tags)
- Works offline

### PWA
- Manifest + icons
- Service worker caches all content JSON + shell
- Works offline after first load

## Content loading architecture (swappable for finance tomorrow)
```
/content/
  cs/                    ← today
    flashcards/
      algos/*.json
      system-design/*.json
      ...
    topics/
      algos.mdx
      ...
    stars/
      leadership.mdx
      ...
  finance/               ← tomorrow, same shape
```
A `CONTENT_SET` env var or URL segment picks the set. Loader is generic.

## Deliverables (must have by morning)
- Working `bun dev` site
- Deployed to Vercel with live URL
- GitHub repo pushed
- README.md with scope + commands
- 500+ high-quality flashcards across distribution
- MYSTEN_RESEARCH.md consumed into the Mysten content
- Functional QA proof: screenshots from night-qa showing swipe viewer works on mobile viewport
- E2E script `scripts/e2e-test.ts` that smoke-tests site via puppeteer

## Priority order (if time-constrained)
1. Site shell + flashcard viewer + localStorage SRS — non-negotiable
2. 500 cards spread across domains
3. Search
4. Mock interview mode
5. PWA offline
6. Mysten deep section
7. STAR stories + negotiation
8. Vercel deploy

If Mysten research is too thin, reduce Mysten card count but keep site functional.

## Constraints
- All .md and code in English
- No Claude/AI mentions in commits, PRs, content, or UI
- Push to GitHub automatically (create repo `alexandremourot/interview-prep-cs` via `gh repo create`)
- Use /ralph-loop
- Max parallelism (one agent per domain for content)
- 3+ stability gate clean passes before PR
- Real deployed site URL loads and flashcard viewer works on mobile viewport

## Out of scope
- Backend / user accounts / cloud sync
- Paid features
- Tomorrow's finance content (separate session)
- Non-English content

## Tomorrow prep
Content is topic-config driven so swapping to `/content/finance/` is trivial. Document in README how to add a new content set.

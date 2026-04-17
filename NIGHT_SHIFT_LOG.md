# Night Shift Log — interview-prep-cs: Learning Platform Refont

## Mission
Transform the flashcard-only app into a structured learning platform. Add `/learn` path with guided chapters per topic. Each chapter = read notes → drill cards → senior insights, with progress tracking per chapter.

## Spec
User answered questionnaire:
1. **Structure**: Guided chapters per topic. Subtopic groupings (existing JSON files) become chapters.
2. **Content**: Chapter notes (markdown) + worked examples with code + senior insights consolidated.
3. **Scope**: Full refont with new `/learn` path. Existing routes stay functional.
4. **Progress**: Per chapter with gates (read, drilled, completed). % per topic.

## Architecture decisions
- **Chapters = subtopics**. Each flashcards JSON file is one chapter. Zero authoring overhead.
- **Runtime synthesis**: Notes/examples/senior sections generated at render from card data. Optional markdown overrides at `content/cs/learn/<topic>/<chapter>/{notes.md, examples.md, senior.md}`.
- **Soft gating**: Chapters greyed when prerequisites not met, but still navigable.
- **Additive migration**: `/review`, `/topic/:slug`, `/mock`, `/stats` preserved. `/learn` is new root for guided journeys.
- **Progress store**: new localStorage key `ipc-learn-progress-v1`, independent of SRS state.
- **ChapterDrill**: dedicated lean component wrapping `FlashcardViewer` (no filters), reports recall to progress store.

## Task plan (9 tasks, 6 parallel groups)

| ID | Group | Deps | Title |
|----|-------|------|-------|
| T1 | A | - | Schema + curriculum loader |
| T2 | B | T1 | Learn progress store |
| T3 | B | T1 | Content synthesis utility |
| T4 | C | T1,T2 | /learn index page |
| T5 | C | T1,T2 | /learn/[topic] page |
| T8 | C | T1,T2 | ChapterDrill component |
| T6 | D | T1,T2,T3,T8 | /learn/[topic]/[chapter] page (core) |
| T7 | E | T1,T2,T4 | Sidebar + home refactor |
| T9 | F | all | Build + biome + smoke test |

## Acceptance criteria
- `/learn` renders with topics grid and progress bars
- `/learn/algos` shows 11 chapters with progress
- `/learn/algos/arrays-strings` shows synthesized notes, Start drill, senior block
- Chapter drill completion updates progress (localStorage)
- Home page shows "Continue learning" section
- All existing routes still return 200
- `bun run build` green, `bunx biome check` clean

## Iterations


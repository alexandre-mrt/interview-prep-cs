# Night Shift Log — interview-prep-cs

## Mission
Deliver a deployed mobile-first interview prep site for Computer Science with 500+ flashcards, swipe viewer, mock interview mode, Mysten Labs deep section, and PWA offline support. Structure must be topic-config driven so tomorrow's Finance set plugs in cleanly.

## Architecture decisions
- **Content as static JSON** bundled into Next.js (no backend)
- **SRS** SM-2 lite in localStorage (ease factor, interval, next review)
- **Content set switch** via URL segment or env (default: cs, tomorrow: finance)
- **PWA** for offline mobile practice
- **Mysten section** is opus-authored from a dedicated research report

## Task graph
See NIGHT_SHIFT_STATE.json `tasks`. Parallelism:
- Shell (T01→T02→T03) sequential
- Content authoring (T09-T13, T15, T16, T17) fully parallel after T02
- UI features (T04, T06, T08) parallel after shell
- T14 (Mysten) waits on MYSTEN_RESEARCH.md
- Deploy gate (T19→T20→T21→T22) sequential at end

## Model tiering
- Opus: T14 Mysten content, T15 senior signals, T17 behavioral (phrasing-heavy)
- Sonnet: scaffolding, UI, most content
- Haiku: seed cards, deploy, README

## Iteration log
_(ralph-loop appends here)_

## Decisions
_(appended per iteration)_

## Summary
_(final summary lands here before PR creation)_

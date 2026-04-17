---
active: true
iteration: 23
session_id: 
max_iterations: 60
completion_promise: "NIGHT_SHIFT_COMPLETE"
started_at: "2026-04-17T16:27:41Z"
---

Night shift orchestrator. Project at /Users/alexandremourot/projects/misc/interview-prep-cs. Read NIGHT_SHIFT_STATE.json, NIGHT_SHIFT_ERRORS.json, NIGHT_SHIFT_LOG.md, NIGHT_SHIFT_ENRICHED_SPEC.md, MYSTEN_RESEARCH.md every iteration. Execute the 22 tasks using night-coder, night-tester, night-qa, night-fixer subagents. Launch independent content-authoring tasks in parallel with isolation worktree and run_in_background true. Model tiering: opus for T14 T15 T17, haiku for T18 T20 T22, sonnet otherwise. After each iteration merge worktrees sequentially, run bun run build and biome, update state, append log, WIP commit. No Claude or AI mentions anywhere. English .md. 500 plus flashcards before deploy. When all tasks done: functional verification via puppeteer, stability gate 3 clean passes, push to GitHub via gh repo create alexandremourot interview-prep-cs public source push, then vercel prod. Signal NIGHT_SHIFT_COMPLETE when fully done.

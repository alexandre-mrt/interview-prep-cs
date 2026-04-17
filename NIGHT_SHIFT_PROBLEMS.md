# Night Shift Problems Log

This file is the user's morning briefing. Every uncertainty, assumption, blocked task, or gap must land here.

Format:
```
### <CATEGORY>: <short title>
- **Iteration**: N
- **File**: <path:line>
- **What I needed**: <missing info>
- **What I did**: <decision or skip>
- **Confidence**: LOW / MEDIUM
- **User action needed**: <specific ask>
```

Categories: `UNCERTAINTY`, `ASSUMPTION`, `BLOCKED`, `UNFIXED`, `TEST GAP`, `DEPENDENCY`

---

## Entries

### DEPENDENCY: next-pwa skipped — Next.js 15/16 compatibility
- **Iteration**: 1
- **File**: package.json
- **What I needed**: next-pwa compatible with Next.js 15+ (App Router)
- **What I did**: Skipped next-pwa install. PWA support deferred to a later iteration (T08). Will evaluate @ducanh2912/next-pwa or manual service worker approach in T08.
- **Confidence**: MEDIUM
- **User action needed**: In T08, validate that @ducanh2912/next-pwa or a manual SW approach works with Next 15 App Router before installing.

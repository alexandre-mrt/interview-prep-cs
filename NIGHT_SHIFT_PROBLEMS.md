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

### DEPENDENCY: next-pwa skipped — manual SW used instead
- **Iteration**: 1 (resolved in T08 by UI mega-agent)
- **File**: public/sw.js
- **What I needed**: next-pwa compatible with Next.js 16 (App Router)
- **What I did**: Implemented a manual service worker (public/sw.js). Cache-first for /_next/static/ and /content/, stale-while-revalidate for shell pages. Registered via src/components/pwa-register.tsx. Manifest at public/manifest.json. Both are wired into layout.tsx.
- **Confidence**: HIGH
- **User action needed**: None — manual SW approach is production-ready.

### ASSUMPTION: PWA icons are minimal placeholders
- **Iteration**: 1
- **File**: public/icon-192.png, public/icon-512.png
- **What I needed**: Proper branded icons for PWA
- **What I did**: Generated minimal black-background PNG files with "IPC" text using Python PIL. Valid PNG files at correct sizes (192x192, 512x512).
- **Confidence**: MEDIUM
- **User action needed**: Replace with proper branded icons before production launch.

### ASSUMPTION: Topic notes use plain markdown renderer (no MDX components)
- **Iteration**: 1
- **File**: src/app/topic/[slug]/page.tsx
- **What I needed**: MDX rendering for topic notes
- **What I did**: Implemented lightweight regex-based markdown renderer (headers, bold, code, lists). No external dependency. If content uses custom MDX components they will not render.
- **Confidence**: MEDIUM
- **User action needed**: If rich MDX with custom components is needed, install next-mdx-remote.

### ASSUMPTION: Content JSON files not reformatted
- **Iteration**: 1
- **File**: content/**/*.json
- **What I needed**: Biome format compliance for all files
- **What I did**: Ran biome only on src/ — all src files are clean (0 errors, 0 warnings). Content JSON from parallel agents uses compact formatting that differs from biome multiline style. Not blocking.
- **Confidence**: HIGH
- **User action needed**: Run `bunx biome format --write content/` if consistent formatting is desired.

# CheatCode

A local-first workspace for understanding algorithms, solving unfamiliar problems, and preparing for Python technical interviews. The focus is **intuition → example → algorithm → code → correctness → complexity → practice**.

## Run locally

Use **Node.js 22.12+ LTS or Node.js 24+**, npm, and Python 3.10+ for the Python verification suite. Python is not required to use the dashboard. `.nvmrc` selects Node 24 if you use nvm.

```sh
git clone https://github.com/RohitPenna/CheatCode.git
cd CheatCode
npm install
npm run dev
```

Open the local URL Vite prints, normally **http://127.0.0.1:5173/**. No API key, paid service, backend, account, or database is required. The development server binds only to loopback by default.

## What works

- **Dashboard:** actual completion, mastery, review queues, study streak, activity calendar, bookmarks, and rule-based recommendations. New users start with zero activity.
- **NeetCode 150:** all 150 problems across the current 18 categories, original concise briefs, original links, category/difficulty/status/confidence filters, bookmarks, and personal notes. Completion is independent of confidence and status.
- **34 worked problem solutions:** standalone Python references, sample arguments/results, brute force, state, worked steps, correctness reasoning, and tested examples. Linked-list/tree adapters clearly identify their representation.
- **26 complete algorithm lessons:** Quick Review, Learn, and Deep Dive; progressive discovery with saved predictions; recognition quizzes; templates; invariants; complexity; edge cases; and follow-ups. Every category has a learning page.
- **Problem-Solving Lab:** a 12-step derivation workflow, constraint-based candidate recommendations with caveats, 20 algorithm comparisons, and a clickable pattern-relationship map.
- **Practice Arena:** eight original scenario prompts with hidden categories, multi-pattern selection, saved reasoning, reference solutions, and explicit self-review. These scenarios are also the mock interview pool.
- **Algorithm Visualizer:** 22 deterministic trace options, including array pointers, graph/tree traversals, heap insertion, linked-list reversal, topological sorting, Union-Find, Dijkstra, bounded Bellman–Ford, backtracking, interval operations, 1-D/2-D DP, and XOR. Supports stepping backward, autoplay/pause, restart, speed changes, state inspection, and supported custom inputs.
- **Pattern Recall:** 160 cards across ten challenge types, reveal controls, topic/type/difficulty filters, shuffle, due/new/missed queues, review history, and a transparent spaced-repetition schedule.
- **Python Toolkit:** 20 reference collections covering built-ins, containers, standard libraries, syntax, common bugs, and 26 copyable algorithm templates. Searchable cheat sheets are separate.
- **Mock interviews:** guided or realistic mode, 30/45/60-minute deadlines that survive refresh, progressive guided hints, saved scratchpad, reference review, eight explicit self-assessment ratings, and saved results.
- **Journal:** searchable personal mistakes and corrections, five clearly labeled starter notes based on the original brief, and links back to lessons.
- **Study planning:** editable interview date (default October 21, 2026), 5/10/15/30-minute plans, adaptive next-step suggestions, interview-day checklist, and automatic long-term mode after the date passes.
- **Settings:** light/dark/focus themes, validated JSON backup import/export, an import preview before replacement, and recovery behavior for unreadable storage.
- **Responsive navigation and global search:** desktop sidebar, phone drawer, keyboard focus indicators, reduced-motion support, and Cmd/Ctrl+K search.

## Content coverage is explicit

The checklist is complete; the full original build specification is **not yet exhausted**.

All 150 problems have individual study briefs. **34 have worked Python solutions; the remaining 116 currently have concise briefs plus related pattern lessons**, rather than complete individual editorials with every requested example/follow-up. Category templates are never labeled as those problems’ solutions.

Interactive Discovery currently uses saved predictions and progressive worked examples plus a recognition quiz. It is not a custom branching tutor for every algorithm. Visualizers show algorithm states, not arbitrary Python execution; graph/tree/interval and LCS examples are fixed. Some traces demonstrate a specific operation (for example heap insertion or edge-limited relaxation), not every variant of that algorithm.

The 26 lessons cover the foundations and selected intermediate topics, plus an optional Fenwick tree lesson. Further requested advanced topics such as segment trees, binary lifting, reservoir sampling, meet-in-the-middle, rolling hash, and full general Bellman–Ford negative-cycle detection remain future content.

There is no automatic grading of arbitrary writing/code, browser Python runtime, AI backend, authentication, or cloud sync. Mock results are explicitly self-assessed. No historical ChatGPT conversations were accessed. Practice scenarios are original presentations of familiar patterns, not a claim of access to confidential interview questions.

## Progress and privacy

Data is stored under `cheatcode.study.v1` in **localStorage**, scoped to the exact origin. `localhost` and `127.0.0.1` are different origins, as are different ports. Use one consistent URL or export/import between them.

Clearing site data, using a different browser profile, or ending an incognito session can lose local data. Use **Settings & backup → Export JSON** regularly. Import validates the complete versioned structure and previews counts before replacing existing data. If existing stored JSON is unreadable, automatic writes are blocked until you choose a recovery action; the original can be downloaded.

There is no telemetry. Educational data ships with the application. Optional Google Fonts requests provide typography; system fonts are used if unavailable. Core learning interactions work without runtime API requests after the app is loaded. This is not an installed offline PWA; a local/static server still needs to serve the application on a fresh visit.

## Review and recommendation rules

- Again: next review in 10 minutes, lapse count increases.
- Hard: at least 1 day, previous interval × 1.2, rounded.
- Good: at least 1 day, previous interval × 2.5, rounded.
- Easy: at least 4 days, previous interval × 3.5, rounded.
- Per-card history retains the latest 100 ratings; activity retains the latest 2,000 events.

Recommendations prioritize due reviewed cards, unreviewed journal topics, low-confidence lessons/problems, recent weak mock self-ratings, nearby interview rehearsal, and unfinished core foundations. The interface explains the chosen recommendation and lets you choose something else. No performance or study-time metrics are fabricated.

## Commands

```sh
npm run dev          # Local development
npm run build        # Strict TypeScript check + production build to dist/
npm run preview      # Serve the production build locally
npm test             # Content, trace, persistence, UI, and practice-reference checks
npm run test:python  # Trusted authored Python examples and differential checks
npm run check        # All tests plus the production build
npm run format       # Format TypeScript, JSON, CSS, HTML, and Markdown
```

Tests execute only trusted authored reference code; user scratchpad contents are never evaluated. The Python tests include independent brute-force checks for stale max-frequency windows, distinct-character windows, and stop-limited flight paths. Vitest tests use jsdom for interaction checks; browser QA is separately documented in `VALIDATION.md`.

## Project structure

- `src/data/problems.json`: verified checklist identity, category, difficulty, and original links.
- `src/data/briefs.json`: one original concise study brief per problem.
- `src/data/solutions.json`: worked Python solution references and executable examples.
- `src/data/lessons.json`: structured lessons, recognition quizzes, and Python examples.
- `src/data/practice.ts`, `comparisons.ts`, `toolkit.ts`: practice and reference content.
- `src/lib/store.tsx`: versioned persistence, backup validation, spaced repetition, dates, and streaks.
- `src/lib/recommend.ts`: explainable next-activity rules.
- `src/lib/traces.ts`: pure deterministic visualization traces.
- `src/components/`: shared controls, code blocks, and learning UI.
- `src/pages/`: separate feature pages.
- `tests/`: Vitest coverage; `scripts/test_templates.py`: trusted Python verification.

To add a worked problem solution, use its existing checklist slug in `solutions.json`, include executable cases, and run `npm run check`. To add a lesson, include every `Lesson` field and examples; recall cards are generated from the structured content. Do not change existing IDs casually: progress refers to those IDs.

## Checklist provenance

Verified October 18, 2026 using the [official NeetCode 150 page](https://neetcode.io/practice/practice/neetcode150) and [NeetCode’s own checklist metadata](https://github.com/neetcode-gh/leetcode/blob/main/.problemSiteData.json). Names are recognizable original-problem names. The current website places **Generate Parentheses under Backtracking**, while the repository metadata still places it under Stack; this application follows the website (Stack 6, Backtracking 10). Difficulty totals are 28 Easy, 101 Medium, and 21 Hard. Long third-party descriptions and solutions were not copied.

`python3 scripts/verify_checklist.py` checks identities and difficulties against fresh upstream metadata without modifying the app. Use `--file path/to/.problemSiteData.json` for an offline source snapshot. Category overrides are explicit in that script and must be rechecked against the official website when updating.

## Troubleshooting

- **Unsupported engine warning:** use Node 22 or 24 LTS. Node 23 on the original development machine passed tests but is outside the test runner’s supported release lines.
- **npm reports an internal peer-resolution error:** retry with a current npm on Node 24. During development, npm 11.5.2’s `edgesOut` error was worked around using `npm install --legacy-peer-deps`; all required peers are explicit in `package.json`.
- **Port is busy:** Vite prints another port. Remember that changing ports changes the browser’s localStorage origin.
- **Progress looks empty:** check the exact hostname, port, browser profile, and whether private browsing was used. Import a backup if needed.
- **Python tests cannot start:** install Python 3 and ensure `python3` is on PATH. The web app itself does not require Python.
- **A preview shows old code:** reload the page; after a production change run `npm run build` again.
- **Storage unavailable/full:** export the in-memory state using Settings. A visible banner reports failed persistence.

## Future deployment

No site has been deployed. When ready, a Vercel Vite project can build with `npm run build` and serve `dist`. Hash-based navigation avoids deep-route server rewrites. LocalStorage remains per browser/origin after deployment; export from the local URL and import on the deployed URL to move progress.

# Validation record

Validated during the October 18–19, 2026 build session.

## Automated checks

- `npm test`: **81 passing tests** across three files.
- `npm run test:python`: **55 lesson examples**, **84 worked problem-solution examples**, and **400 seeded differential checks** pass.
- `npm run build`: strict TypeScript compilation and Vite production build pass.
- `python3 scripts/verify_checklist.py --file <official snapshot>`: all **150 identities**, difficulties, and categories match, with the documented Generate Parentheses website override.
- Fresh `npm ci` in a separate temporary directory succeeds.
- Dependency audit: **zero reported vulnerabilities** at validation time.
- `git diff --check`: no whitespace errors.

Tests cover the current category counts, complete brief coverage, unique flashcards, backup shape validation, recovery from corrupt stored data, scheduling, calendar dates, streaks, recommendation branches, every trace type, selected trace invariants, completion/confidence independence, persistence after remount, filters, lesson mode state, flashcard ratings, animation controls, blind solution reveal, mock deadlines and self-assessment, themes, global search, import preview/replacement/rejection, and rendering of 17 primary routes.

Differential Python checks compare historical-max-frequency windows, distinct-character windows, and stop-limited relaxation with independent exhaustive oracles. These tests are deliberately bounded and do not prove correctness for all possible inputs. Arbitrary user-written code is never executed.

## Browser checks

Using the actual app browser, checked:

- Dashboard at a desktop breakpoint (1440×1000 requested viewport).
- Phone layout (390×844 requested viewport): tracker, mobile navigation, lesson, lab, mock setup, and settings. Measured document width stayed within the layout viewport on the inspected pages.
- Light and dark appearance.
- Tracker search, completion retained after reload, independently selected confidence, saved notes, and revealed problem brief.
- Dijkstra graph steps, distances, and candidate queue changes.
- Flashcard answer reveal, rating, queue decrease, and session review count.
- Production-build dashboard, worked Minimum Window Substring reference, and mock setup. No warning/error console entries were reported by the fresh production tab.

Interactive browser QA used a separate `localhost` origin from the user-facing `127.0.0.1` preview so test progress did not populate the user’s initial dashboard. Test-only browser tabs were closed, and temporary viewport overrides were reset.

During bulk source edits, Vite hot reload temporarily produced context-identity errors. A fresh load worked; the state module now requests a full reload when edited, keeping provider and consumer identities consistent. Production builds do not contain this development hook.

## Runtime and remaining limits

The development machine uses Node 23.11.0, which successfully ran the checks but is outside Vitest’s supported Node release lines. Node 22.12+ or 24+ LTS is specified in the README/package engines; `.nvmrc` selects 24. No global Node installation was changed.

Not every interaction, content paragraph, or browser/device combination was exhaustively tested. There is no screen-reader audit, remote deployment test, cross-device sync test, or Python execution sandbox. See README for the exact content coverage and deferred parts of the original specification.

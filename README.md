# STE-Lingo

Gamified, client-only app to learn Simplified Technical English (ASD-STE100).
Lessons are JSON files in `src/data/lessons/`. Progress lives in `localStorage`.

```sh
npm install
npm run dev
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run validate-lessons` | Check every lesson file against the Zod schema in `src/types/lesson.js` |
| `npm test` | Unit tests for grading and streak rules, plus a check that every lesson answer key passes |
| `npm run lint` | oxlint; warnings fail |
| `npm run build` | Validate lessons, then build |

CI (`.github/workflows/validate-lessons.yml`) runs all of these on every pull request.

## Add a lesson

1. Add `src/data/lessons/unit-NN-some-name.json`. The file name must start with its `unitId`; units appear in file-name order.
2. Use the four question types: `multiple_choice`, `word_bank`, `synonym_spotter`, `word_limit`. See the existing units for the exact fields.
3. Run `npm run validate-lessons && npm test`.

`synonym_spotter` indices count words in `sentence` split on single spaces.
`word_limit` passes when the text has at most `maxWords` words and contains every `acceptableKeywords` entry as whole words.

# AGENTS.md

Rules established for this repo. Only the frontend has agreed conventions so far; the Django backend has none yet — do not infer frontend rules onto it.

## Frontend (`frontend/`)

### `src/api/` structure

```
src/api/
├── server/                 # Django REST via axios — only HTTP calls
│   ├── client.ts           # createAxiosInstance (the axios factory)
│   ├── summary.ts          # filename = Django route segment (singular)
│   └── quiz.ts
├── services/               # one file per Supabase TABLE, filename = singular of table name
│   ├── summary.ts          # only functions that call supabase.from("...")
│   ├── quiz.ts
│   ├── profile.ts
│   └── auth.ts             # session helper (getUserIdAsync) — exception, not a table
├── storage/                # one file per Supabase STORAGE BUCKET
│   └── summary_bucket.ts   # only functions that call supabase.storage
├── queries/                # react-query hooks — the layer screens/components should call; filenames also singular (summary.ts, quiz.ts, profile.ts)
├── hooks/  types/  utils/
```

- **Table names are authoritative** (plural, as in the DB). Confirm from `frontend/supabase/migrations/` or `frontend/supabase/types/supabase.data.types.ts` before naming a file (tables: `profiles`, `summaries`, `quizzes`; bucket: `summary_bucket`). **Filenames take the singular** of the table across `api/` (`summaries` → `services/summary.ts`, `queries/summary.ts`), consistent with `server/` and `types/`.
- **Layer dependencies** (no cycles):
  - `queries` → `services` | `storage` | `server`
  - `server` → `services` only, for the error-status fallback (`markSummaryError` / `markQuizError`)
  - `services` ✗ `storage` ✗ `server`
- **Named exports only** in `src/api/` — no default exports.
- Supabase fallback writes belong in `services/` (`markSummaryError(id)`), never inline in `server/` request functions.

### Naming

- **Directories:** all lowercase; kebab-case for multi-word (`quiz-card`, `file-system`).
  - **Exception — component folders:** a folder that holds *one component split into multiple files* is **PascalCase** (`SummaryCard/`, `SummaryList/`, `QuizForm/`, `QuizCard/`) wherever it lives. Domain parents (`summary/`), collections (`ui/`, `navigation/`), screen folders, and their `components/` section containers stay lowercase.
- **Files:** PascalCase **iff** the module's primary export is a React component; otherwise kebab-case (`page-result.ts`, `use-query-updater.ts`). A folder that *is* the unit — screen folder or single-component folder — uses `index.tsx` as its main file; the folder name carries the identity (`quiz-list-screen/index.tsx`, `SummaryCard/index.tsx`).
- **List components** whose primary render is a list of items carry a `List` suffix: `SummaryList/`, `QuizList/` (never a bare plural like `Quizzes/`). Screen folder names follow the same rule (`quiz-list-screen`, `summary-list-screen`).
- **Extension = content:** `.tsx` only when the file contains JSX.
- **Exceptions:** `App.tsx` (Expo entry, imports resolve to it by name — never rename) and navigator/context barrels that export components.
- Case-sensitive filesystems (Linux CI, Android builds): imports must match path casing exactly. Case-only renames need two-step `git mv` (`git mv Quiz tmp && git mv tmp quiz`) so macOS checkouts stay safe.

### Component placement

```
src/components/
├── ui/                # generic presentational primitives — Themed*, buttons, state screens
│   └── index.ts       # the only components barrel
├── navigation/        # components consumed by navigators (AppHeader, CustomDrawerContent, UserCard)
├── summary/SummaryCard/   # cross-feature shared — stays here, not in a screen folder
├── quiz/QuizForm/         # feature-scoped unit shared by 2+ screens, kept out of screens/ by decision
src/screens/{feature}/{screen-kebab}/             # one folder per screen, e.g. quiz/quiz-list-screen/
│   ├── index.tsx                                  # orchestrator only — see rule below
│   └── components/                               # sections of exactly this screen
src/screens/{feature}/components/                 # shared by 2+ screens of that feature (OptionButton)
```

- Pick the deepest tier that covers **all** consumers; consumers count transitively. A component whose consumers span features is shared → `src/components/ui/` (or `navigation/` if it takes navigator props).
- A unit shared by 2+ screens of one feature belongs in `screens/{feature}/components/`, or at `components/{feature}/` when kept out of `screens/` (decision: `quiz/QuizForm/`).
- `navigation/` components may import from `ui/`, never the reverse.
- Cross-feature ≠ duplicated: e.g. `SummaryCardBase` consumed by quiz screens too — it stays in `components/summary/SummaryCard/`.
- **Composition root:** a folder's `index.tsx` is the only file that imports its sibling files; components never import sibling files. Exception: a thin override/wrapper pair where a leaf renders its base (`Option` → `OptionBase`) — that's an override, not composition. Private subcomponents stay inline in the file that renders them; shared non-component helpers (`constants.ts`) are fine. Cross-folder imports go through the folder's index.

### Screen orchestrator rule

- `screens/{feature}/{screen-kebab}/index.tsx` is only the orchestrator + state holder: it composes section components and passes `onX` props. Sections live in `components/{screen-kebab}/` and own their markup **and** their `StyleSheet` slice. Really small sections may stay inline in the screen file.
- **Context only at ≥3 levels of prop drilling.** Same-level section components receive props from the screen (or a screen-local hook like `use-summary-creation-form.ts`), not context.
- **`export default` is always the last statement of the file** when other declarations share it (applies repo-wide, except navigator/context provider barrels).

### `supabase/types/supabase.data.types.ts`

Generated file. Do not hand-edit; it was once corrupted by capturing TTY output (interactive CLI prompts pasted into the file). If regenerating, redirect CLI output to a file, never through a TTY prompt.

### Verification

```sh
cd frontend
npx tsc --noEmit        # must exit 0
npx eslint src          # baseline: 0 errors / 0 warnings — do not increase
npx expo start -c       # after renames: clear Metro cache
```

- Do **not** use `yarn` for anything: `/usr/bin/yarn` on this machine is an unrelated Python tool. Use `npx expo lint` / `npx eslint` (never `yarn lint`) and `npm install` (never `yarn install` — `npx expo install` also defaults to yarn here when a `yarn.lock` exists). `package-lock.json` is the lockfile.
- npm does not always hoist transitive deps that Metro needs (`expo-asset` ended up nested under `expo/` and unresolvable from `expo-font`). Such packages must be declared as **direct dependencies** in `package.json` so they land top-level.

### Layer note: summary creation orchestration

Upload (storage) + insert (services) for summary creation is orchestrated in the screen-local hook `summary-creation-screen/hooks/use-submit-summary.ts`, not in `api/` — single consumer, and `queries/` stays read-only. `services/` remains records-only (`insertSummary`).

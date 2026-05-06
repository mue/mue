# Mue Engineering Standards (GEMINI.md)

This file contains project-specific instructions and guidelines for Mue.

## Stack & Commands

- **Package Manager:** Always use `bun`. Never use `npm` or `yarn`.
- **Framework:** React 19, Vite 7, Manifest V3.
- **Core Commands:**
  - `bun install`: Install dependencies.
  - `bun run dev`: Start dev server.
  - `bun run build`: Production build for Chrome, Firefox, Safari.
  - `bun run lint`: Run ESLint and Stylelint.
  - `bun run lint:fix`: Auto-fix lint issues.
  - `bun run pretty`: Format with Prettier.
  - `bun run translations`: Sync locale files from `en_GB.json`.
  - `bun run translations:percentages`: Update translation stats.
  - `bun run translations:unused`: Find unused translation keys.
  - `bun run test:e2e:headless`: Run Cypress tests headlessly.

## Architecture & Patterns

- **State Management:** Use **localStorage** for persistent state.
- **Communication:** Use `src/utils/eventbus.js` for inter-widget/UI communication.
  - Register in `useEffect`, cleanup with `EventBus.off()`.
- **I18n:** All user-visible strings MUST use `src/i18n/locales/en_GB.json` as the base.
  - Use `useT()` hook or `getMessage()` helper.
- **Routing:** Hash-based router (`createHashRouter`) in `src/router/`.
- **Path Aliases:** Use `@/`, `components/`, `features/`, etc. (see `vite.config.mjs`).

## Coding Rules

- **No Comments:** Keep code self-explanatory through descriptive naming.
- **No Emojis:** Do not use emojis in code strings or logs (except user-facing toasts).
- **Naming:** Concise names. Use `const [open, setOpen] = useState(false)`, not `isOpen`.
- **Commits:** Conventional commits (`feat:`, `fix:`, etc.) are enforced.
- **Translations:** Edit `en_GB.json` first, then run `bun run translations`.

## Directory Structure

- `src/features/`: Feature-based organization (background, time, quote, etc.).
- `src/components/`: Shared UI elements and layouts.
- `src/utils/`: Shared utilities and helpers.
- `manifest/`: Extension manifest templates.
- `safari/`: Safari-specific project files.

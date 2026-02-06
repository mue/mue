# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Mue?

Mue is a browser extension (Chrome, Firefox, Safari) that replaces the new tab page with a customizable dashboard featuring widgets like clock, weather, quotes, greetings, quick links, and backgrounds. Built with React 19, Vite 7, and Manifest V3.

## Commands

```bash
bun install              # Install dependencies (always use bun, never npm/yarn)
bun run dev              # Dev server with HMR (opens browser automatically)
bun run dev:host         # Dev server exposed on network
bun run build            # Production build for all browsers (Chrome, Firefox, Safari)
bun run lint             # Run ESLint + Stylelint
bun run lint:fix         # Auto-fix lint issues
bun run pretty           # Format with Prettier
bun run translations     # Sync all locale files from en_GB.json base
bun run translations:percentages  # Update translation completion stats
bun run translations:unused       # Find unused translation keys
```

Build outputs: `build/chrome/`, `build/firefox/`, `safari/Mue Extension/Resources/`. Vite's `prepareBuilds` plugin (in `vite.config.mjs`) copies dist + manifests + icons into each browser folder and creates versioned zips.

There are no tests in this project.

## Architecture

### Bootstrap Flow

1. `src/index.jsx` - Initializes i18n from localStorage language, sets up Sentry, runs data migrations, exposes global `window.t()`, renders `<ErrorBoundary><App/></ErrorBoundary>`
2. `src/App.jsx` - `useAppSetup()` checks first-run state, calls `loadSettings()` (which applies theme, fonts, custom CSS to the DOM), listens for EventBus `'refresh'` events. Renders: `<TranslationProvider>` → `<Background>` + `<CustomWidgets>` + `<Widgets>` + `<Modals>`

### State Management (no Redux/Zustand)

All persistent state lives in **localStorage**. Components read from localStorage on mount and re-read when they receive EventBus refresh events. The only React Context is `TranslationContext` for i18n.

- `localStorage.getItem('key') === 'true'` is the standard boolean check pattern
- Settings changes write to localStorage, then emit `EventBus.emit('refresh', 'category')` to notify widgets
- `src/utils/settings/load.js` applies localStorage settings to the DOM (theme classes, injected style elements for custom fonts/CSS)

### EventBus (`src/utils/eventbus.js`)

Static class wrapping DOM CustomEvents. Primary communication mechanism between settings UI and widgets.

Key events:

- `'refresh'` with payload: `'quote'`, `'greeting'`, `'background'`, `'widgets'`, `'clock'`, `'other'` - triggers widget reload
- `'languageChange'` with `{language: 'en_GB'}` - switches locale
- `'modal'` with `'openMainModal'` - opens settings modal

Pattern: register in `useEffect`, clean up with `EventBus.off()` on unmount.

### Feature Organization (`src/features/`)

Each feature (background, time, quote, greeting, weather, search, quicklinks, message, navbar, stats, marketplace, welcome) follows this structure:

```
feature/
├── index.jsx           # Main component
├── options/index.jsx   # Settings panel UI
├── hooks/              # Feature-specific hooks (useQuoteState, useQuoteLoader, etc.)
├── components/         # Subcomponents
├── api/                # Data fetching/processing
└── scss/               # Styles
```

The `misc` feature is special - it contains the modal system (`modals/Modals.jsx`), widget layout (`CustomWidgets.jsx`, `views/Widgets.jsx`), and the settings view (`views/Settings.jsx`).

### Modal & Settings System

`Modals.jsx` orchestrates four modals (main, welcome, update, apps). The main modal has three tabs: Settings, Discover (marketplace), Library. Deep-linking via URL hash: `#settings/appearance/fonts`, `#discover/quote_packs`.

### Global Variables (`src/config/variables.js`)

Singleton object holding `language` (i18n instance), `languagecode`, `stats`, and `constants`. Mutated during initialization. `variables.getMessage()` is dynamically set by TranslationContext.

### Hooks

- `useFrequencyInterval()` - configurable update intervals with visibility-aware pause/resume
- `useCachedFetch()` - fetch with localStorage caching and TTL
- `useT()` / `useTranslation()` - access translation function from context

### Path Aliases (configured in `vite.config.mjs`)

Use these instead of relative imports: `@/`, `components/`, `contexts/`, `hooks/`, `assets/`, `config/`, `features/`, `lib/`, `scss/`, `translations/`, `utils/`, `i18n/`

## Code Rules

### Do not add comments

Keep code self-explanatory. Use descriptive names instead of comments.

### Do not use emojis in code strings

No emojis in console logs, placeholders, or code strings. Exception: user-facing toast notifications may include emojis.

### All user-visible strings must use i18n

Never hardcode user-facing text. Use `const t = useT(); t('widgets.greeting.morning')` or `getMessage('key')`. Console logs don't need i18n.

### Translation workflow
Edit `src/i18n/locales/en_GB.json` first (it's the base file), then run `bun run translations` to sync all other locales.

### Naming conventions
Concise names without redundant prefixes. `const [open, setOpen] = useState(false)` not `const [isOpen, setIsOpen]`. Exception: `is` prefix is fine for boolean-returning functions (`isValid()`), `has` prefix for boolean properties.

### Branch strategy
Three branches: `dev` (all PRs target here) → `beta` → `main`. Hotfix branches (`hotfix/*`) branch from `main`.

### Conventional commits
Enforced by commitlint: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `style:`, `perf:`. Scopes encouraged: `feat(weather): add hourly forecast`.

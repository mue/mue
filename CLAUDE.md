# Mue Development Guide

Mue is a fast, open-source new tab page browser extension for Chrome, Firefox, and Safari.

## Tech Stack

### Core Technologies
- **React 19** - Modern hooks and functional components only
- **Vite 7** - Build tool with SWC for fast compilation
- **Bun** - Package manager and JavaScript runtime (>= 1.3.0)
- **SCSS** - Styling with modern compiler API
- **Browser Extension (Manifest V3)** - Multi-browser support (Chrome, Firefox, Safari)

### Key Libraries
- **@dnd-kit** - Drag and drop functionality for widgets
- **@eartharoid/i18n** - Internationalization with multiple locales
- **@sentry/react** - Error tracking and monitoring
- **react-modal** - Accessible modal dialogs
- **react-toastify** - Toast notifications
- **IndexedDB & localStorage** - Client-side data persistence
- **Vite path aliases** - Imports use `@/`, `components/`, `hooks/`, `utils/`, etc.

### Development Tools
- **ESLint** - JavaScript/JSX linting with React plugin
- **Stylelint** - SCSS/CSS linting
- **Prettier** - Code formatting
- **Commitlint** - Conventional commit enforcement
- **Husky** - Git hooks for pre-commit checks

## Project Structure

```
src/
├── components/     # Reusable UI components
├── features/       # Feature-specific components (quote, greeting, weather, etc.)
├── contexts/       # React Context providers for shared state
├── hooks/          # Custom React hooks
├── utils/          # Utility functions and helpers
├── lib/            # Third-party library wrappers
├── i18n/           # Internationalization and locale files
├── scss/           # Global styles, variables, and mixins
├── config/         # Configuration files
└── assets/         # Static assets (icons, images)
```

## Development Rules

### 1. Translation Files
**en_GB.json is the base translation file.**

When updating translations:
1. Edit `src/i18n/locales/en_GB.json` first
2. Run `bun run translations` to sync changes to all locales
3. This ensures formatting remains consistent across all language files

Available translation scripts:
- `bun run translations` - Sync all locale files with en_GB
- `bun run translations:percentages` - Update completion percentages
- `bun run translations:unused` - Find unused translation keys

### 2. Branch Strategy
Use the **three-branch workflow**:
- `dev` - Active development (target for all PRs)
- `beta` - Release candidates for testing
- `main` - Production/stable releases

**Always create PRs targeting the `dev` branch.**

### 3. Commit Messages
Follow **conventional commits** format:
- `feat:` - New features
- `fix:` - Bug fixes
- `chore:` - Maintenance tasks
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test-related changes
- `style:` - Code style changes (formatting, etc.)

Commitlint will enforce this in pre-commit hooks.

### 4. Code Style & Quality

**Before committing:**
```bash
bun run lint:fix    # Auto-fix ESLint and Stylelint issues
bun run pretty      # Format code with Prettier
```

**Linting rules:**
- Follow ESLint configuration in `eslint.config.js`
- SCSS follows Stylelint standard SCSS rules
- Husky pre-commit hooks will block commits with linting errors

### 5. Commenting
**Do not add comments to the codebase.** Keep code clean and self-explanatory. Use descriptive variable/function names instead of comments.

### 6. Package Manager
**Always use Bun** (not npm or yarn):
```bash
bun install         # Install dependencies
bun run dev         # Start dev server
bun run build       # Production build
```

### 7. Build Targets
The project builds for **multiple browsers**:
- Chrome/Edge (Chromium)
- Firefox
- Safari (via Xcode)

**Test changes across all targets** when modifying:
- Core functionality
- Manifest files (`manifest/chrome.json`, `manifest/firefox.json`)
- Browser-specific APIs

Build outputs:
- `dist/` - Vite bundled output
- `build/chrome/` - Chrome extension
- `build/firefox/` - Firefox extension
- `safari/Mue Extension/Resources/` - Safari extension

### 8. State Management
- **Persistent settings** - Use `localStorage` via custom hooks
- **Shared state** - Use React Context (see `src/contexts/`)
- **Component state** - Use `useState`, `useReducer` for local state
- **Custom hooks** - Create hooks for reusable stateful logic

### 9. Styling Conventions
SCSS files are organized in `src/scss/`:
- `_variables.scss` - Color palette, breakpoints, sizes
- `_mixins.scss` - Reusable style mixins
- Component styles - Co-located in feature/component folders

**Use existing variables and mixins** for consistency.

### 10. Development Server
```bash
bun run dev         # Local development with HMR at localhost
bun run dev:host    # Expose on network for testing on other devices
```

Hot Module Replacement (HMR) is enabled for fast development.

### 11. Path Aliases
Use configured path aliases instead of relative imports:
```javascript
// Good
import Button from 'components/Button';
import { useLocalStorageState } from 'hooks/useLocalStorageState';
import { getWeather } from 'utils/api';

// Avoid
import Button from '../../../components/Button';
```

Available aliases: `@/`, `components/`, `contexts/`, `hooks/`, `assets/`, `config/`, `features/`, `lib/`, `scss/`, `translations/`, `utils/`

### 12. Error Handling
- Sentry is integrated for error tracking
- Use `ErrorBoundary` component for React error boundaries
- Handle async errors gracefully with try/catch
- Show user-friendly error messages via `react-toastify`

### 13. Browser Extension Best Practices
- Use Manifest V3 APIs (not deprecated V2 APIs)
- Test extension loading/unloading
- Handle permissions properly
- Use `background.js` for background tasks
- Store data in `localStorage` or `IndexedDB`, not sync storage
- Ensure cross-browser compatibility (check MDN for API support)

### 14. Internationalization (i18n)
- Use `@eartharoid/i18n` for translations
- Access translations via the i18n context
- Add new keys to `en_GB.json` first
- Test with multiple locales to ensure proper rendering
- Support RTL languages where applicable

### 15. Performance
- Lazy load components where appropriate
- Optimize images (use modern formats like WebP)
- Minimize bundle size (check Vite build output)
- Use `useMemo` and `useCallback` judiciously (only when needed)
- Profile performance with React DevTools

## Common Tasks

### Adding a New Feature
1. Create feature folder in `src/features/`
2. Add components, hooks, and styles
3. Update translations in `en_GB.json`
4. Run `bun run translations` to sync locales
5. Add tests if applicable
6. Run `bun run lint:fix` and `bun run pretty`
7. Commit with conventional commit message
8. Create PR targeting `dev` branch

### Debugging
- Use React DevTools for component inspection
- Check browser console for errors
- Use Sentry for production error tracking
- Test in all supported browsers

### Testing on Browsers
1. Run `bun run build`
2. Load unpacked extension from `build/chrome/` or `build/firefox/`
3. For Safari, open Xcode project and build from there

## Resources
- Repository: https://github.com/mue/mue
- Homepage: https://muetab.com
- Bug Reports: https://github.com/mue/mue/issues

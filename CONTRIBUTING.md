# Contributing to Mue

Thanks for your interest in contributing to Mue! We welcome contributions from the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Strategy](#branch-strategy)
- [Making Changes](#making-changes)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

## Code of Conduct

Please be respectful and constructive in your interactions with the community.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.3.0
- Node.js >= 20.0.0 (for some tooling)
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/mue.git
   cd mue
   ```

3. Install dependencies:
   ```bash
   bun install
   ```

4. Start development server:
   ```bash
   bun run dev
   ```

## Development Workflow

### Scripts

- `bun run dev` - Start development server with hot reload
- `bun run dev:host` - Start development server accessible on network
- `bun run build` - Build production extension for all browsers
- `bun run lint` - Run ESLint and Stylelint
- `bun run lint:fix` - Auto-fix linting issues
- `bun run pretty` - Format code with Prettier

### Testing Your Changes

1. Load the extension in your browser:
   - **Chrome/Edge**: Go to `chrome://extensions`, enable Developer mode, click "Load unpacked", select `dist` folder
   - **Firefox**: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select any file in `dist` folder

2. Test your changes thoroughly across different browsers

## Branch Strategy

Mue uses a three-branch workflow:

```
dev (active development)
 ↓
beta (release candidates)
 ↓
main (production/stable)
```

### Branches

- **`dev`** - Active development branch
  - All feature and bug fix PRs merge here first
  - Maintainers can push directly for small fixes
  - Contributors must create PRs
  - CI must pass before merge

- **`beta`** - Release candidate testing
  - PRs from `dev` → `beta` for release candidates
  - Triggers beta release workflow
  - Requires 2 maintainer approvals
  - Used for testing with beta testers before production

- **`main`** - Production/stable releases
  - PRs from `beta` → `main` only
  - Triggers production release workflow
  - Requires 2 maintainer approvals + manual environment approval
  - Represents current live extension version

### Special Branches

- **`hotfix/*`** - Emergency production fixes
  - Branch from `main` for critical bugs
  - Triggers hotfix workflow (auto-merges to all branches)
  - Maintainers only

## Making Changes

### For Contributors

1. Create a feature branch from `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our code style

3. Test your changes locally

4. Commit your changes (see [Commit Messages](#commit-messages))

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request targeting the `dev` branch

### For Maintainers

Maintainers can push directly to `dev` for small fixes, or follow the contributor process for larger changes.

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/) for automated changelog generation.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `perf:` - Performance improvement
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks, dependency updates

### Examples

```bash
feat(weather): add hourly forecast widget
fix(greeting): resolve time zone display issue
perf(background): optimize image loading
docs(readme): update installation instructions
chore: bump version to 7.6.0
```

### Breaking Changes

For breaking changes, add `BREAKING CHANGE:` in the commit body:

```bash
feat(api): change settings storage format

BREAKING CHANGE: Settings format has changed. Users will need to reconfigure their settings.
```

## Pull Request Process

1. **Fill out the PR template** completely

2. **Ensure all checks pass**:
   - ✅ Build succeeds
   - ✅ Linting passes
   - ✅ No merge conflicts

3. **Get reviews**:
   - Contributors: 1 maintainer approval required
   - Beta → Main: 2 maintainer approvals required

4. **Address review feedback**

5. **Squash commits** if requested (maintainers can squash on merge)

6. **Wait for merge** - maintainers will merge when ready

### PR Guidelines

- Keep PRs focused on a single feature/fix
- Include screenshots/videos for UI changes
- Update documentation if needed
- Link related issues
- Test on multiple browsers

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **Major** (8.0.0): Breaking changes, major feature overhauls
- **Minor** (7.6.0): New features, backward-compatible
- **Patch** (7.5.1): Bug fixes, small improvements

### Release Workflow (Maintainers Only)

#### 1. Development Phase

Contributors and maintainers work on `dev` branch.

#### 2. Create Beta Release

When ready for testing:

1. Run version bump workflow:
   ```
   Actions → Version Bump → Run workflow
   - Branch: dev
   - Bump type: minor/major/patch
   - Pre-release: beta
   ```

2. Create PR from `dev` → `beta`

3. Merge PR (triggers beta release workflow)

4. Share beta release with testers

5. Gather feedback and fix issues on `dev`

6. Repeat until stable

#### 3. Promote to Production

When beta is stable:

1. Create PR from `beta` → `main` with checklist:
   - [ ] Beta tested for X days
   - [ ] All critical bugs resolved
   - [ ] Y+ testers approved
   - [ ] Release notes prepared

2. Get 2 maintainer approvals

3. Merge PR (triggers production release workflow)

4. Workflow pauses for manual approval (10 min wait)

5. Approve in GitHub Actions → Environments → production

6. Release is created on GitHub

7. Manually trigger store submission:
   ```
   Actions → Submit → Run workflow
   - Enter version tag (e.g., v7.6.0)
   ```

#### 4. Emergency Hotfix

For critical production bugs:

1. Create hotfix branch from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-bug-fix
   ```

2. Fix the issue and commit

3. Push branch:
   ```bash
   git push origin hotfix/critical-bug-fix
   ```

4. Run hotfix workflow:
   ```
   Actions → Hotfix Release → Run workflow
   - Description: Brief description
   - Branch name: hotfix/critical-bug-fix
   ```

5. Workflow will:
   - Auto-bump patch version
   - Merge to `main`
   - Create release
   - Back-merge to `beta` and `dev`

6. Immediately submit to stores

## Questions?

- 💬 Join our [Discord](https://discord.gg/zv8C9F8) (if available)
- 📧 Email: [contact info]
- 🐛 Report bugs: [GitHub Issues](https://github.com/mue/mue/issues)

## License

By contributing, you agree that your contributions will be licensed under the BSD-3-Clause License.

# Mue Release Process

This document outlines the complete release process for Mue maintainers.

## 📋 Table of Contents

- [Overview](#overview)
- [Version Numbering](#version-numbering)
- [Pre-Release Checklist](#pre-release-checklist)
- [Beta Release Process](#beta-release-process)
- [Production Release Process](#production-release-process)
- [Hotfix Release Process](#hotfix-release-process)
- [Post-Release Tasks](#post-release-tasks)
- [Store Submission](#store-submission)
- [Troubleshooting](#troubleshooting)

## Overview

Mue uses a three-branch release workflow:

```
dev → beta → main
```

- **`dev`**: Active development and feature integration
- **`beta`**: Release candidates for community testing
- **`main`**: Production-ready stable releases

## Version Numbering

We follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

### When to Bump

| Type | When | Example |
|------|------|---------|
| **Major** (x.0.0) | Breaking changes, API changes, major UI overhaul | 7.5.0 → 8.0.0 |
| **Minor** (0.x.0) | New features, backward-compatible changes | 7.5.0 → 7.6.0 |
| **Patch** (0.0.x) | Bug fixes, small improvements | 7.5.0 → 7.5.1 |

### Beta Versions

Beta versions follow the format: `MAJOR.MINOR.PATCH-beta.X`

Example: `7.6.0-beta.1`, `7.6.0-beta.2`

## Pre-Release Checklist

Before starting any release:

- [ ] All intended features/fixes are merged to `dev`
- [ ] No critical bugs in issue tracker
- [ ] `dev` branch builds successfully
- [ ] All CI checks passing
- [ ] Translation updates synced from Weblate (if applicable)
- [ ] Breaking changes documented

## Beta Release Process

### Step 1: Version Bump

1. Go to **Actions** → **Version Bump** → **Run workflow**

2. Configure:
   - **Branch**: `dev`
   - **Bump type**: Choose `patch`, `minor`, or `major`
   - **Pre-release**: Select `beta`

3. Click **Run workflow**

4. Workflow will:
   - Calculate new version (e.g., `7.6.0-beta.1`)
   - Update all 6 version files
   - Create git tag
   - Push to `dev`

### Step 2: Create Beta PR

1. Go to **Pull Requests** → **New pull request**

2. Configure:
   - Base: `beta`
   - Compare: `dev`

3. Fill in PR template:
   - Add changelog preview
   - List major changes
   - Add testing notes

4. Get 2 maintainer approvals

### Step 3: Merge and Release

1. **Merge PR** to `beta` branch

2. **Beta Release Workflow** auto-triggers:
   - Builds extension for all browsers
   - Creates GitHub pre-release
   - Uploads Chrome/Firefox ZIPs
   - Generates changelog

3. **Verify release**:
   - Check [Releases page](https://github.com/mue/mue/releases)
   - Download and test ZIPs
   - Verify version numbers

### Step 4: Beta Testing

1. **Share with testers**:
   - Post release link in Discord/testing channel
   - Include installation instructions
   - Provide feedback form/issue template

2. **Monitor feedback**:
   - Track issues tagged with beta version
   - Prioritize critical bugs
   - Document all feedback

3. **Fix issues**:
   - Fix bugs on `dev` branch
   - Create new beta (repeat from Step 1)
   - Increment beta number (7.6.0-beta.2, etc.)

4. **Minimum beta period**: 3-7 days (depending on changes)

5. **Stability criteria**:
   - No P0/P1 bugs reported
   - Positive feedback from 5+ testers
   - All critical features tested

## Production Release Process

### Step 1: Pre-Production Checks

- [ ] Beta has been stable for minimum period
- [ ] All critical beta bugs resolved
- [ ] Release notes prepared
- [ ] Store credentials verified
- [ ] Team notified of pending release

### Step 2: Version Bump to Stable

1. Go to **Actions** → **Version Bump** → **Run workflow**

2. Configure:
   - **Branch**: `beta`
   - **Bump type**: Usually same as beta (minor/major/patch)
   - **Pre-release**: Leave empty (stable release)

3. This updates `7.6.0-beta.X` → `7.6.0`

### Step 3: Create Production PR

1. Go to **Pull Requests** → **New pull request**

2. Configure:
   - Base: `main`
   - Compare: `beta`

3. Fill in **release PR checklist**:
   - [ ] Beta tested for X days
   - [ ] All critical bugs resolved
   - [ ] 5+ beta testers approved
   - [ ] Release notes prepared
   - [ ] Store submission ready
   - [ ] Changelog updated on website

4. Get 2 maintainer approvals

### Step 4: Merge and Release

1. **Merge PR** to `main`

2. **Production Release Workflow** starts:
   - Builds extension
   - Creates production tag
   - Generates full changelog
   - Creates GitHub release
   - **Pauses for manual approval**

3. **Review in GitHub**:
   - Go to **Actions** → **Production Release** → running workflow
   - Review release notes
   - Check build artifacts
   - **Approve deployment** in Environments → production

4. **Review period** - Workflow waits for your approval (10 min deployment protection)

5. **Release completes**:
   - GitHub release published
   - ZIPs uploaded
   - Tag created

### Step 5: Store Submission

**Manual submission required** (for now):

1. Go to **Actions** → **Submit** → **Run workflow**

2. Enter version tag: `v7.6.0` (include the 'v' prefix to match the release tag)

3. Click **Run workflow**

4. Monitor submission workflow:
   - Chrome Web Store submission
   - Firefox Add-ons submission
   - Edge Add-ons submission

5. **Verify store listings**:
   - Chrome: https://chromewebstore.google.com/detail/mue/bngmbednanpcfochchhgbkookpiaiaid
   - Edge: https://microsoftedge.microsoft.com/addons/detail/mue/aepnglgjfokepefimhbnibfjekidhmja
   - Firefox: https://addons.mozilla.org/en-GB/firefox/addon/mue/

6. **Store review times**:
   - Chrome: 1-3 days
   - Edge: 1-2 days
   - Firefox: hours to days

### Step 6: Sync Branches

After production release, sync version to other branches:

```bash
# Update dev and beta with main
git checkout dev
git pull origin dev
git merge main
git push origin dev

git checkout beta
git pull origin beta
git merge main
git push origin beta
```

## Hotfix Release Process

### When to Use Hotfix

**Only for critical production bugs:**
- Security vulnerabilities
- Data loss bugs
- Extension completely broken
- Critical functionality broken for all users

### Process

1. **Create hotfix branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/brief-description
   ```

2. **Fix the bug**:
   - Make minimal changes (hotfix only)
   - Test thoroughly
   - Commit with conventional format

3. **Push branch**:
   ```bash
   git push origin hotfix/brief-description
   ```

4. **Run hotfix workflow**:
   - Go to **Actions** → **Hotfix Release** → **Run workflow**
   - **Description**: Brief bug description
   - **Branch name**: `hotfix/brief-description`
   - Click **Run workflow**

5. **Approve deployment**:
   - Workflow pauses for approval
   - Review changes carefully
   - Approve in **Environments** → **production**

6. **Workflow automatically**:
   - Bumps patch version (7.6.0 → 7.6.1)
   - Merges to `main`
   - Creates release tag
   - Builds and releases
   - Back-merges to `beta` and `dev`

7. **Submit to stores immediately**:
   - Go to **Actions** → **Submit** → **Run workflow**
   - Enter new version (e.g., `7.6.1`)

8. **Notify users**:
   - Post urgent update notice
   - Update website changelog
   - Notify via social media if critical

9. **Clean up**:
   ```bash
   git push origin --delete hotfix/brief-description
   ```

## Post-Release Tasks

After any production release:

### Immediate (within 24 hours)

- [ ] Verify store submissions completed
- [ ] Update https://muetab.com/blog/changelog
- [ ] Announce on Discord/social media
- [ ] Monitor issue tracker for new reports
- [ ] Verify demo site (demo.muetab.com) is updated

### Within 1 Week

- [ ] Review analytics for adoption rate
- [ ] Address any quick-fix bugs as patch release
- [ ] Update roadmap/milestones
- [ ] Thank beta testers and contributors

### Ongoing

- [ ] Monitor store reviews/ratings
- [ ] Respond to user feedback
- [ ] Plan next release cycle

## Store Submission

### Required Credentials

Stored in GitHub Secrets as `SUBMIT_KEYS`:

```json
{
  "chrome": {
    "extId": "bngmbednanpcfochchhgbkookpiaiaid",
    "clientId": "...",
    "clientSecret": "...",
    "refreshToken": "..."
  },
  "firefox": {
    "extId": "{ac143a20-4b61-4c81-abdd-4bff77032972}",
    "jwtIssuer": "...",
    "jwtSecret": "..."
  },
  "edge": {
    "productId": "...",
    "clientId": "...",
    "clientSecret": "...",
    "accessTokenUrl": "..."
  }
}
```

### Beta Distribution

**Chrome/Edge Beta**:
- Use unlisted listing (share link with testers)
- Or use trusted testers group (max 1000)

**Firefox Beta**:
- Upload as unlisted to AMO
- Share download link from GitHub Releases

**Safari Beta**:
- Currently manual sideload from GitHub Releases

## Troubleshooting

### Build Fails

**Issue**: Build fails in workflow

**Solutions**:
1. Check CI logs for specific error
2. Run `bun run build` locally to reproduce
3. Ensure all dependencies installed
4. Check for linting errors: `bun run lint`

### Version Mismatch

**Issue**: Version numbers don't match across files

**Solutions**:
1. Re-run Version Bump workflow
2. Manually verify all 6 files:
   - package.json
   - manifest/chrome.json
   - manifest/firefox.json
   - safari/Mue Extension/Resources/manifest.json
   - safari/Mue.xcodeproj/project.pbxproj
   - src/config/constants.js

### Tag Already Exists

**Issue**: Git tag already exists for version

**Solutions**:
1. Delete existing tag:
   ```bash
   git tag -d v7.6.0
   git push origin :refs/tags/v7.6.0
   ```
2. Re-run workflow

### Store Submission Fails

**Issue**: PlasmoHQ BPP submission fails

**Solutions**:
1. Check workflow logs for specific error
2. Verify credentials in `SUBMIT_KEYS` secret
3. Check store developer console for issues
4. Try manual submission as fallback

### Merge Conflicts

**Issue**: Conflicts when merging beta → main

**Solutions**:
1. Update beta with main first:
   ```bash
   git checkout beta
   git merge main
   git push origin beta
   ```
2. Create new PR from beta → main

## Emergency Rollback

If a production release has critical bugs:

### Option 1: Hotfix (Preferred)

Follow [Hotfix Process](#hotfix-release-process) to quickly patch and release.

### Option 2: Store Rollback

Each store allows rolling back to previous version:

**Chrome Web Store**:
1. Go to Developer Dashboard
2. Select Mue extension
3. Package → Select previous version
4. Publish

**Firefox Add-ons**:
1. Go to Developer Hub
2. Select Mue add-on
3. Manage Status & Versions
4. Enable previous version

**Edge Add-ons**:
1. Go to Partner Center
2. Select Mue extension
3. Packages → Restore previous

### Option 3: Revert and Re-release

```bash
git checkout main
git revert <commit-hash>
git push origin main
```

Then follow production release process.

## Questions?

Contact maintainers:
- @davidcralph
- @alexsparkes

Or open a discussion: https://github.com/mue/mue/discussions

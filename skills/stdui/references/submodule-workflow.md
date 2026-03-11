# stdui Submodule Workflow

stdui lives at `libs/stdui/` as a git submodule. When developing both the design system and a consuming app simultaneously, follow these conventions.

## Setup

```bash
# Clone with submodules
git clone --recurse-submodules <repo-url>

# Or init after clone
git submodule update --init --recursive
```

## Daily Workflow

### Making changes to stdui

1. `cd libs/stdui` — enter the submodule
2. Create a branch: `git checkout -b agent/<description>` (or `feat/<description>` for manual work)
3. Make changes, commit, push the branch
4. Merge to `main` in the submodule, push main
5. `cd ../..` — return to parent repo
6. `git add libs/stdui` — update the submodule pointer
7. Commit the parent repo (the pointer references the new submodule commit)

### Branch naming

- `agent/<description>` — changes made by Claude Code agents
- `feat/<description>` — manual feature work
- `fix/<description>` — manual bug fixes

### Key rules

- **Always push the submodule before the parent** — the parent's pointer references a specific commit that the remote must have
- **Multiple agents may modify stdui in parallel** — branches prevent conflicts
- **Parent submodule pointer should reference a commit on stdui's `main` branch** — merge feature branches before updating the pointer

## Checking for Dirty Submodules

Before committing in the parent repo, check for uncommitted submodule changes:

```bash
git submodule foreach --quiet 'if [ -n "$(git status --porcelain)" ]; then echo "$sm_path has uncommitted changes"; fi'
```

If stdui has uncommitted changes, commit and push them first.

## Common Commands

```bash
# Check submodule status
git submodule status

# Pull latest submodule changes
cd libs/stdui && git pull origin main && cd ../..
git add libs/stdui && git commit -m "chore: update stdui submodule"

# See what changed in stdui since last pointer update
cd libs/stdui && git log --oneline HEAD...origin/main
```

## Consuming stdui

Import paths in consuming apps:

```typescript
import { Button, Card, Badge } from "@stdui/react"           // Components
import { StduiProvider, useTheme } from "@stdui/react/theme"  // Theme
import "@stdui/react/styles"                                   // CSS tokens
```

The `@stdui/react` package resolves via workspace linking (bun workspace or npm workspaces). No need to publish — the submodule IS the package.

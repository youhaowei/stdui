# design-sync NOTES — @wystack/ui

Repo gotchas discovered during the first sync. Read before any re-sync.

## Build setup (this repo is TS-source-only)

- `@wystack/ui` ships **TS source directly** — `package.json` `main`/`exports` point at `src/index.ts`, NO build script, NO committed `dist/`. Consumed by TS-aware bundlers (vite in storybook, the DashFrame Electron bundler).
- **The converter (esbuild) bundles the TS source directly** — pass `--entry packages/ui/src/index.ts`. No dist JS needed for the bundle.
- **BUT component detection needs `.d.ts`.** With no `.d.ts`, the converter finds `0 exported PascalCase symbols` → 0 components. Before each build, emit declarations:
  ```bash
  (cd packages/ui && bunx tsc --declaration --emitDeclarationOnly --outDir dist)
  ```
  `findTypesRoot` auto-probes `dist/` and parses the 76 `.d.ts`. This `dist/` is gitignored build output — regenerate it each run; do NOT add a `types` field to the committed package.json pointing at gitignored dist (dangles on fresh clone for real consumers).
- **bun monorepo node_modules is sparse at the package root** — pass `--node-modules packages/ui/node_modules` (where `react`/`react-dom` symlinks resolve), NOT the repo root.

## [GENERAL] dts entry mismatch (OPEN — converter-internals)

- `findTypesRoot` resolves the types root to `dist/` correctly, but `projectFor` (dts.mjs ~L90) recomputes the *entry* from `pj.types`/`pj.typings` → falls back to `packages/ui/index.d.ts` (absent) → `getSourceFile(entry)` undefined → 0 exports.
- VERIFIED the data is fine: adding `dist/**/*.d.ts` to a ts-morph project and reading `dist/index.d.ts` yields **231 exports** incl. all PascalCase components (Button→ButtonPrimitive, Badge, Dialog, Card, Tabs, Input, Select…).
- The fix must make the converter's dts entry = `dist/index.d.ts` WITHOUT a committed package.json `types` pointing at gitignored dist. Candidate: a `.design-sync/overrides/dts.mjs` fork that uses the resolved typesRoot for the entry, declared in `cfg.libOverrides`.

## Title→export name mismatches (need cfg.titleMap)

- Storybook title `Primitives/Button` / `Components/Button` → export is `ButtonPrimitive` (exported as `Button as ButtonPrimitive`). Will need `cfg.titleMap {"Button": "ButtonPrimitive"}` (and check ButtonGroup→ButtonGroupPrimitive, Tooltip→TooltipPrimitive — all aliased `…Primitive`).
- 21 storybook components total; resolve each title→export after the dts entry fix lands.

## Decorators / provider

- `! preview decorator bundle failed: Could not resolve "tailwindcss"` — the `.storybook/preview` decorators import tailwind. Set `cfg.provider` to supply the theme/token context the decorators provided, OR resolve tailwind for the decorator bundle.

## CSS

- `cssEntry: packages/ui/src/styles/tokens.css not found — skipped` (path resolution) BUT `[CSS_FROM_STORYBOOK]` recovered the compiled CSS from sb-reference (81KB) — CSS is OK via the storybook fallback. tokens.css is the design-system token source (per CLAUDE.md).

## Source fixes made to unblock (committed to stdui)

- `packages/ui/src/primitives/sheet.tsx`: imported `Drawer` from `@base-ui/react@1.2.0` which exports `DrawerPreview` (drawer renamed to preview-namespace in 1.2.0). Changed import to `DrawerPreview as DrawerPrimitive`. tsc clean. Real bug — sheet was broken for all consumers, not just design-sync.

## Re-sync risks

- The `dist/` d.ts emit is a manual pre-build step (not in `cfg.buildCmd` yet — set it once the entry fix lands). If skipped, components drop to 0 silently.
- React 19.2.4 (skill says React 18+; 19 works). Storybook 10.2.16, vite 6.
- `@base-ui/react` preview-namespace renames (Drawer→DrawerPreview) can recur on other unstable primitives if the dep bumps — watch the storybook build for "is not exported" errors.

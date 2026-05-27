# Copilot Instructions

Personal website of Frederik Schönfeldt — built with Eleventy (11ty), Nunjucks, TailwindCSS v3, Alpine.js, and esbuild. Playwright is used for E2E and visual snapshot tests.

## Commands

```bash
pnpm install          # install dependencies
pnpm start            # dev server (Eleventy + Tailwind + esbuild watchers, concurrently)
pnpm build            # production build (clean → build CSS/JS → Eleventy → hash assets → generate CV PDF)
pnpm test:e2e         # run Playwright E2E tests (requires built site served via pnpm start:e2e)
pnpm test:unit        # run Playwright unit tests in assets/js/
pnpm test             # full pipeline: build + unit + e2e
```

Run a single test file:
```bash
pnpm playwright test tests/index.spec.ts
```

Update snapshots after intentional visual changes:
```bash
pnpm playwright test --update-snapshots
# For CI (Linux) snapshots use Docker:
docker build -t my-playwright-ci . && docker run --rm --network host -v "$(pwd)":/work -w /work my-playwright-ci bash ./scripts/create_ci_snapshots.sh
```

## Architecture

### Build pipeline
1. `pnpm build` runs `build-css` (Tailwind → `_site/css/`) and `build-js` (esbuild bundles → `_site/js/`) in parallel.
2. `node hash` generates `_data/hash.json` mapping asset paths to content-hashed filenames (e.g. `styles.abc1234.css`).
3. Eleventy reads `src/` (input) and `_data/` (global data) and outputs to `_site/`.
4. CV is printed to PDF via Playwright (`tests/cv.print.spec.ts`) as a post-build step.

In dev (`pnpm start`), Tailwind and esbuild write to `src/_build/` which Eleventy passthrough-copies into `_site/`. No hashing in dev.

### Directory layout
- `src/` — Eleventy input; `.njk` templates and `.md` content
- `src/_includes/layouts/` — base layouts (`base.njk`, `project.njk`, `a4doc.njk`, `vacation.njk`, `manager.njk`, `minimal.njk`)
- `src/_includes/components/` — reusable Nunjucks components
- `assets/css/styles.css` — Tailwind entry point
- `assets/js/` — JS entry points bundled by esbuild (`app.js`, `app_manager.js`, `app_vacation.js`)
- `_data/` — global Eleventy data (`site.json` with base URL, `hash.json` generated at build time)
- `_site/` — build output (do not edit directly)
- `tests/` — Playwright tests; `*.spec.ts-snapshots/` hold platform-specific PNG baselines

### Templating
- Nunjucks (`.njk`) for layouts and pages; Markdown (`.md`) for content.
- Global Nunjucks variables injected from env: `personal_address`, `personal_phone`, `personal_mail`, `cv_htaccess_user_01/02`, `cv_htaccess_password_01/02` — set these in `.envrc.local` (see `.envrc.local.example`).
- Asset paths in templates come from `{{ hash['/css/styles.css'] }}` to resolve hashed filenames.

### Styling
- TailwindCSS v3 with custom theme: `gray` = stone, `blue` = sky, `xs` breakpoint at 400 px, `canDisplayA4` media query at 875 px.
- Custom font families: `font-heading` (Anton), `font-space` (Space Mono), `font-spacegrotesk`, `font-dotted` (Doto), `font-serif` (Merriweather).
- Per-project accent colours live in `tailwind.config.js` (e.g. `laufmaus.accent`).

### A4 Docs
Markdown files under `src/a4docs/` render as print-ready A4 pages via the `a4doc.njk` layout. Accessible at `/a4docs/<slug>` in dev.

### Deployment
FTP-based via `bin/deploy.sh`; credentials come from env vars (`FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, `FTP_SUBDIR`). Also configured for Netlify (`netlify.toml`).

# Christopher B Fernandes — Portfolio

A vibrant, fully responsive **Angular PWA** personal portfolio. Data-driven (local
JSON), trilingual (**EN / HI / KN**), light + dark themes, and auto-deployed to
**GitHub Pages** via GitHub Actions.

- Standalone components + **signals** for theme/locale/state
- **Tailwind CSS** (utility-first, mobile-first), CSS-variable design tokens
- **PWA**: service worker offline caching + installable manifest
- Sections: Hero · Timeline · Projects · **Code Hacks** (searchable, syntax-highlighted, copy-to-clipboard) · Contact
- Jamstack: no server in production — content lives in `src/assets/data/*.json`

---

## Quick start

```bash
npm install
npm start            # http://localhost:4200  (service worker disabled in dev)
```

Production build:

```bash
npm run build                       # outputs to dist/cf-portfolio/browser
```

---

## How this project was scaffolded

If you ever want to recreate the toolchain from scratch, these are the exact steps
(the repo already has all of this wired up):

```bash
# 1. New standalone Angular app (no SSR, CSS)
ng new cf-portfolio --standalone --style=css --routing=false --ssr=false

# 2. Add PWA support (creates manifest.webmanifest + ngsw-config.json, sets serviceWorker:true)
ng add @angular/pwa

# 3. Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

# 4. Add the @tailwind directives to src/styles.css and the token mappings to
#    tailwind.config.js  (already done in this repo).
```

---

## Editing your content

All content is data — no need to touch components.

| File | What it holds |
|------|---------------|
| `src/assets/data/profile.json` | name, headline, status badge, socials, skills |
| `src/assets/data/experience.json` | timeline roles (supports `**bold**` metrics) |
| `src/assets/data/projects.json` | project cards |
| `src/assets/data/snippets.json` | Code Hacks entries |
| `src/assets/data/ui.json` | navigation + section labels |

Every user-facing string is `{ "en": "…", "hi": "…", "kn": "…" }`. Switching the
language in the navbar swaps locales live (no reload), driven by the `locale` signal.

### Regenerate data from a résumé

```bash
# paste résumé text into scripts/resume.txt, then:
npm run parse-resume
```

This stubs `hi`/`kn` with the English text so you can translate in place. `snippets.json`
and `ui.json` are hand-maintained.

---

## Deploy to GitHub Pages

1. Push this repo to GitHub with the default branch named **`main`**.
2. In **Settings → Pages**, set **Source = GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds with
   `--base-href "/<repo-name>/"` (derived automatically), adds a `404.html`
   SPA fallback + `.nojekyll`, and publishes.

> The workflow infers the base-href from the repo name. If you serve from a custom
> domain or the user/organisation root (`<user>.github.io`), build with
> `--base-href "/"` instead (see `build:ghpages` in `package.json`).

---

## Things to fill in before you ship

- [ ] Replace the placeholder social URLs in `profile.json` (GitHub / LinkedIn / Medium).
- [ ] Confirm `src/assets/Christopher_Fernandes_Resume.pdf` is the version you want served.
- [ ] Review the Hindi/Kannada translations (machine-assisted drafts where noted).
- [ ] Optional: tweak the status-badge label in `profile.json`.

---

Built with Angular, Tailwind & signals.

# Toolzy

A free, client-side PDF tools, converters and calculators website (merge, split,
compress, rotate, watermark, page numbers, images <-> PDF, currency/unit/timezone
conversion, calculators, text/data tools and more) built with React + TypeScript +
Vite. All processing runs entirely in the browser via `pdf-lib` and `pdf.js` - no
backend, no file uploads, no server storage. That makes it a static site: cheap,
fast, and trivial to deploy anywhere.

## Name & domain

The site is branded **Toolzy**, using `toolzy.app` as the placeholder
domain throughout this repo's SEO config (`index.html`, `robots.txt`,
`sitemap.xml`, `.env.example`). Other options considered, in case `toolzy.app`
turns out to be unavailable:

| Priority | Name | Domain (verify availability before buying) | Why |
| --- | --- | --- | --- |
| 1 | **Toolzy** | toolzy.app / toolzy.io | Short, brandable, memorable, low collision risk as a coined word. Current brand for this repo. |
| 2 | **ToolCraft** | toolcraft.app | Keyword-relevant ("tool"), professional tone, but collides with existing hardware/machining brands named "Toolcraft". |
| 3 | **AnyToolKit** | anytoolkit.com | Strong "toolkit" keyword match, describes the all-in-one positioning directly. |
| 4 | **UtilityKit** | utilitykit.app | Clear, descriptive, good SEO keyword match for "utility"/"toolkit" searches. |
| 5 | **QuickKit** | quickkit.app | Short, emphasizes the instant/no-signup value proposition. |

Always confirm live availability via a registrar (Namecheap, Google
Domains/Squarespace, Cloudflare Registrar) before committing - availability
changes constantly and can't be verified from this environment.

Once you pick a real domain, update:
1. `VITE_SITE_URL` in your hosting provider's environment variables (see `.env.example`).
2. The hardcoded fallback URLs in `index.html` (`canonical`, `og:*`, `twitter:*`, JSON-LD `url`).
3. `public/robots.txt` (`Sitemap:` line) and `public/sitemap.xml` (`<loc>` entries).

## Why this stack

- **Platform independent**: pure static HTML/CSS/JS output (`npm run build`
  produces a `dist/` folder). Runs on any static host - no runtime, no
  database, no server language lock-in.
- **Easy deployment**: drag-and-drop `dist/` to Netlify, or connect the repo to
  Vercel / Cloudflare Pages / GitHub Pages for automatic CI deploys.
- **Accurate functionality**: PDF operations use `pdf-lib` (a mature,
  well-tested PDF manipulation library) and `pdf.js` (Mozilla's PDF renderer,
  the same engine behind Firefox's built-in PDF viewer) - no experimental or
  unmaintained dependencies.
- **Privacy as a feature**: since nothing is uploaded, there's no server
  storage/GDPR risk for user documents, and no infrastructure cost that scales
  with usage.

## Tools included

| Tool | Description |
| --- | --- |
| Merge PDF | Combine multiple PDFs, reorderable, into one file |
| Split PDF | Extract a page range, or split every page into a ZIP |
| Remove Pages | Delete specific pages/ranges |
| Rotate PDF | Rotate all pages 90/180/270 degrees |
| Compress PDF | Re-save with optimized object streams to shrink file size |
| Add Watermark | Diagonal text watermark with adjustable opacity |
| Add Page Numbers | "Page X of N" footer on every page |
| Images to PDF | Combine JPG/PNG images into one PDF |
| PDF to Images | Export each page as PNG/JPG (zipped if multi-page) |

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
npm run preview  # preview the production build locally
```

## SEO

This is a client-rendered SPA, so SEO relies on Google/Bing's JS-rendering crawlers
plus static fallbacks that work even without JS execution:

- **Per-page metadata**: [src/components/Seo.tsx](src/components/Seo.tsx) updates
  `document.title`, meta description, canonical link, and Open Graph/Twitter tags
  on every route change. Each tool page passes a keyword-tailored `seoDescription`
  distinct from its on-screen UI copy (avoids duplicate-content issues across pages).
- **Static defaults in `index.html`**: full title/description/OG/Twitter tags plus a
  `WebApplication` JSON-LD structured data block, so the initial (pre-JS) HTML
  response is already meaningful to crawlers and social-media unfurlers.
- **`public/robots.txt`** allows all crawling and points to the sitemap.
- **`public/sitemap.xml`** lists all 11 routes (home, premium, 9 tools) with priorities.
- **`public/site.webmanifest`** adds installability signals (helps mobile/PWA-aware
  ranking signals and "Add to Home Screen").
- **Performance**: tool pages are code-split (`React.lazy`) so the crawlable home
  page stays small; Google Fonts are preconnected.

**Manual follow-ups after choosing a real domain** (see "Suggested name & domain"
above): set `VITE_SITE_URL`, update the hardcoded fallback URLs in `index.html`,
`public/robots.txt`, and `public/sitemap.xml`, and add a real 1200x630
`public/og-image.png` (referenced by the OG/Twitter tags but not included in this
repo - generate one with your brand mark before launch, since a good preview image
meaningfully improves social-share click-through rates).

## Testing

```bash
npm run test:gen-assets   # generate sample PDFs/images into %TEMP%\pdf-toolkit-test-assets
npm run test:pdf-lib      # run deterministic checks against every pdf-lib operation (merge, split,
                           # extract range, delete pages, rotate, watermark, page numbers, images-to-pdf, compress)
```

See [TEST_REPORT.md](./TEST_REPORT.md) for the full functional test log, including browser-level tool checks and
bugs found/fixed.

## Deployment

The app is a static SPA - the build output (`dist/`) is just HTML/CSS/JS with no server-side
code, so it can be hosted anywhere that can serve static files.

### Option A: Static hosting platform (fastest, zero server management)

- **Netlify**: `npm run build`, publish directory `dist`. `public/_redirects` (already included,
  `/* /index.html 200`) handles client-side routing.
- **Vercel**: import the repo, framework preset "Vite", output directory `dist`. Vercel
  auto-handles SPA fallback routing.
- **Cloudflare Pages**: see the dedicated walkthrough below.
- **GitHub Pages**: build command `npm run build`, output `dist`. Keep `base: './'` in
  `vite.config.ts` (already set) so assets resolve correctly under a repo subpath.

No environment variables are required to deploy a working, ad-free site.

#### Deploying to Cloudflare Pages

**Via the dashboard (connects to Git, auto-deploys on every push):**
1. Push this repo to GitHub/GitLab.
2. Cloudflare dashboard -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect
   to Git** -> select the repo.
3. Build settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `pdf-toolkit` (only if this repo lives inside a monorepo/parent folder;
     leave blank if `pdf-toolkit/` is the repo root itself)
4. Environment variables (Pages project settings -> **Environment variables**), optional:
   - `VITE_SITE_URL` = your real domain, e.g. `https://www.toolzy.app`
   - `VITE_ADSENSE_CLIENT` = your AdSense publisher ID, if/when you enable ads
5. Save and deploy. Cloudflare Pages natively supports the `public/_redirects` file already in
   this repo, so client-side routes (`/tools/merge-pdf`, etc.) work correctly on direct load and
   refresh with no extra config.
6. Add your custom domain under the Pages project's **Custom domains** tab - Cloudflare issues
   and renews the TLS certificate automatically.

**Via the CLI (no dashboard/Git connection needed - good for quick previews):**
```bash
npm install
npm run build
npx wrangler pages deploy dist --project-name=toolzy
```
The first run prompts you to log in and create the Pages project; subsequent runs redeploy the
same project. Pass `--branch=production` to publish straight to the production URL instead of a
preview URL.

### Option B: Your own server (VPS, dedicated box, on-prem) with Docker

This repo includes a `Dockerfile` and `nginx.conf` that build the app and serve it with nginx,
including SPA fallback routing (so a direct link/refresh on `/tools/merge-pdf` works).

```bash
# On the server (or any machine with Docker), from the pdf-toolkit/ folder:
docker build -t toolzy .
docker run -d --name toolzy -p 80:80 --restart unless-stopped toolzy
```

To pass build-time config (e.g. `VITE_SITE_URL`, `VITE_ADSENSE_CLIENT`), add `--build-arg` +
`ARG`/`ENV` lines to the Dockerfile's build stage, or bake a `.env.production` file into the
image before building - Vite only reads these at build time, not at container runtime.

For HTTPS, put this container behind a reverse proxy that handles TLS (e.g. Caddy, Traefik, or
nginx/Certbot on the host) rather than terminating SSL inside the app container.

### Option C: Your own server without Docker (plain nginx/Apache)

```bash
npm install
npm run build            # produces dist/
# copy the contents of dist/ to your web root, e.g.:
scp -r dist/* user@your-server:/var/www/toolzy/
```

Then point your web server at that folder with SPA fallback enabled:

- **nginx**: use the `location / { try_files $uri $uri/ /index.html; }` block from this repo's
  `nginx.conf` inside your site's server block, pointing `root` at the uploaded folder.
- **Apache**: add a `.htaccess` in the web root:
  ```apache
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
  </IfModule>
  ```

Any static-file web server works as long as it falls back unknown paths to `index.html` - the
app's own React Router then renders the right screen client-side.

## Monetization

Monetization is designed to never interfere with tool functionality:

1. **Ad slots are isolated.** `src/components/AdSlot.tsx` renders ads in
   dedicated layout zones (top banner, bottom banner, sidebar - see
   `ToolLayout.tsx`) that are structurally separate from the dropzone/buttons
   of every tool. Ads can never overlay or block interactive controls.
2. **Ads fail silently.** `AdSlot` is wrapped in a React error boundary and
   all script loading is wrapped in `try/catch` + `.catch()`. If an ad
   blocker strips the script or AdSense fails to load, the rest of the page
   (and all PDF processing) continues to work normally.
3. **Zero-config in dev/no-ads mode.** Set `VITE_ADSENSE_CLIENT` (see
   `.env.example`) to your AdSense publisher ID (`ca-pub-XXXXXXXXXXXX`) to
   enable ads. Leave it empty and no ad markup renders at all - useful for
   local development or a fully ad-free premium tier.
4. **Premium toggle.** `src/context/PremiumContext.tsx` persists a
   `isPremium` flag (currently `localStorage`-backed for demo purposes) that
   `AdSlot` checks before rendering. Wire `setPremium(true)` to a real
   payment webhook (Stripe/Paddle/LemonSqueezy) to build an ads-free paid
   tier without touching any tool code.

### To go live with ads

1. Apply for a Google AdSense account and get your publisher ID.
2. Set `VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXX` in your host's environment
   variables (Netlify/Vercel project settings).
3. Create ad units in the AdSense dashboard and update the `slotId` props in
   `Home.tsx` / `ToolLayout.tsx` if you want per-slot targeting (currently
   using AdSense "auto" responsive ads, which don't require per-slot IDs).
4. Redeploy.

### Other monetization options (compatible with this architecture)

- Freemium limits (e.g. cap batch merge/split file counts for free users,
  enforced client-side or via a lightweight usage-check API).
- One-time "Buy me a coffee" / Stripe Checkout link on the Premium page.
- Affiliate placements in the sidebar ad zone instead of AdSense.

## Architecture

```
src/
  components/   Shared UI: Header, Footer, AdSlot, FileDropzone, ToolLayout, ToolCard
  context/      PremiumContext (ad visibility + premium state)
  hooks/        useAsyncTask (shared processing/error state for tool pages)
  lib/          pdfUtils.ts (pdf-lib operations), pdfToImages.ts (pdf.js rendering),
                fileHelpers.ts (download/zip helpers), tools.ts (tool catalog)
  pages/        Home, Premium, and one page per tool under pages/tools/
```

Tool pages are lazy-loaded (`React.lazy`) so the landing page stays small and
fast, while the heavier `pdf-lib`/`pdf.js` bundle only loads once a user opens
a specific tool.

## Limitations / roadmap

- `compressPdf` re-serializes the PDF with optimized object streams; it does
  not re-encode embedded images at lower resolution/quality. For deeper
  compression, a server-side tool (e.g. Ghostscript) would be needed - this
  can be added later as an optional paid "advanced compression" API without
  changing the rest of the app.
- PDF encryption/password protection is not implemented (`pdf-lib` does not
  support setting new passwords). Could be added via a WASM library like
  `pdf-encrypt` if needed.
- Word/Excel/PowerPoint conversion is out of scope for a pure client-side
  tool and would require a server-side conversion service.

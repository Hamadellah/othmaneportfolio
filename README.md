# Othmane Hamadellah — Interactive 3D Particle Portfolio

React + Vite + Three.js + React Three Fiber. The hero is a ~66,000-particle portrait of you
that assembles on load, glows under the cursor, pushes particles away from it and turns its head
towards it. All sections of the original portfolio (`all.jsx`) are kept.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

Needs Node 18+. Try `http://localhost:5173/?particles=100000` to test other particle counts.

## Two things you need to add

1. **Your CV** → `public/othmane-cv.pdf` (the "Download CV" buttons point to `/othmane-cv.pdf`).
2. Nothing else. The original `othmane12.webp`, `othmane-photo.jpg` and `othmane-bg.mp4` were not
   supplied, and the particle portrait replaces them (see "What changed").

## How the 3D portrait is made (and what it is not)

No image-to-3D service was available while building this, so **this is not an AI-generated
mesh**. It is a local, two-view reconstruction from `assets/front-view.png` and
`assets/side-view.png` — `tools/reconstruct.py`:

1. Both views are aligned on shared landmarks (hair top, eyes, mouth, chin, bust base).
2. For each height, the front silhouette gives the width and the side silhouette gives the depth
   (nose, lips, chin, back of the head, shoulders). Each row is a superellipse in that box.
3. The rows are meshed with marching cubes → `public/models/my-portrait.glb`.
4. Both clay photos are saved as tone maps (`public/textures/*-tone.jpg`). In the browser every
   particle samples them, so the real eyes, brows, lips and hair curls appear on the surface.

Result: your real proportions, profile and hairstyle, but a smoothed head shape. Fine geometry
(individual curls, ears, nostrils) comes from the photo tones, not from geometry, so it is best seen
within roughly ±30° of the front. Head rotation is limited for that reason.

Re-run after changing the images: `npm run reconstruct`
(needs `pip install numpy scipy opencv-python scikit-image trimesh`).

**For a true mesh**: generate a GLB from the two images with an image-to-3D tool (Meshy, Tripo,
Rodin, Hunyuan3D …), put it at `public/models/my-portrait.glb` (head at the origin, ~2 units tall,
face towards +Z), and update `src/data/portrait-meta.json` / `src/utils/generatePoints.js` if you
want to bake colour from the mesh instead of projecting the two photos.

## Interactions (src/shaders/vertexShader.glsl)

| Effect | Where |
| --- | --- |
| Intro: scattered cloud → portrait, staggered | `uProgress`, `INTRO_SECONDS` in `ParticlePortrait.jsx` |
| Cursor push + soft attraction ring | `uRadius`, `uStrength` |
| Cursor light + glow | `vLight` (vertex/fragment), `CursorGlow.jsx` |
| Head follows cursor | `Rig` in `Scene.jsx` |
| Breathing / floating (never static) | `uMotion` |
| Touch screens | a ghost cursor drifts over the portrait when idle (`utils/pointer.js`) |

## Performance and fallbacks

- One `THREE.Points` draw call; `BufferGeometry` + `ShaderMaterial`; all animation lives in uniforms (no React re-renders).
- Particle budget by device: 66k desktop, 48k on weaker desktops, 30–40k on phones.
- DPR capped (2 desktop, 1.5 mobile) and dropped to 1 by `PerformanceMonitor` if frames are slow.
- Render loop pauses when the hero is off-screen.
- `prefers-reduced-motion`: no intro, minimal idle motion, no cursor push.
- No WebGL, or the GLB fails to load: the static clay portrait in the original avatar ring is shown.
- Loader uses real byte progress from the three.js loaders.

## What changed from all.jsx

All content (text, projects, skills, education, services, contact details) is unchanged and split
into components under `src/components/`. The hero avatar photo is replaced by the particle portrait.
I removed the full-page video backdrop and the code-rain canvas (and the unused photo import): they
competed with the portrait and need assets that were not provided. `AmbientBackground.jsx` is the
quiet replacement; they can be restored from `all.jsx` if you want them back.

## Structure

```
assets/                 your two reference images
tools/reconstruct.py    two-view reconstruction (GLB + tone textures)
public/models/          my-portrait.glb
public/textures/        front-tone.jpg, side-tone.jpg
src/components/         Hero, Scene, ParticlePortrait, CursorGlow, Loader, WebGLFallback, Navbar, sections…
src/shaders/            vertexShader.glsl, fragmentShader.glsl
src/utils/              generatePoints.js (surface sampling), pointer.js
src/data/               portrait-meta.json (mapping from the reconstruction)
all.jsx                 your original single-file portfolio (reference only, not imported)
```

---

# v1.1 — head-only portrait, responsive hero, SEO

## What changed
- **Head only.** The reconstruction and sampler now stop just below the chin (the neck dissolves in the shader). No shoulders, chest or clothing. Re-generate with `npm run reconstruct` (needs Python deps from `tools/`).
- **Desktop hero:** copy on the left (name, title, intro, CTAs, social links), the head on the right in a fixed stage. Entrance animations are CSS only.
- **Cursor:** only the head reacts, with a few degrees of smooth rotation plus the particle push/glow, and only while the cursor is near the head. The text and layout never move.
- **Mobile hero (≤767 px):** head first and centred, then name/title/CTAs, then intro and stats. Fewer particles (30–40k) and a lower pixel ratio. Not a shrunk desktop.
- **Code splitting:** three.js / R3F / drei / shaders live in a lazy chunk (`Scene-*.js`); the main bundle is ~80 kB gzip.

## Configure your domain (required before deploying)
Copy `.env.example` to `.env` and set:
```
VITE_SITE_URL=https://www.your-domain.com
```
It feeds the canonical URL, Open Graph/Twitter URLs, JSON-LD, `robots.txt` and `sitemap.xml`. On Netlify, Cloudflare Pages and Vercel the host's own URL is used if you don't set it. If it is missing, the build prints a warning and uses `https://your-domain.example`.
Also **add your CV** as `public/othmane-cv.pdf` (the build warns while it is missing).

## Build and deploy
```
npm install
npm run build      # vite build + static HTML prerender into dist/
npm run preview    # test the production build locally
```
Upload `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, your own server). Set `VITE_SITE_URL` in the host's environment variables. `public/_headers` adds caching headers on Netlify/Cloudflare.

## SEO — what is in place
- Unique title and description, canonical, `lang`, viewport, robots meta, Open Graph, Twitter card, favicon set, web manifest, `og-image.png` (1200×630).
- JSON-LD `Person` (+ `WebSite`) using only real data: name, job title, Beni Mellal/MA, languages, ISTA NTIC Beni Mellal, and `sameAs` = your LinkedIn and GitHub. Nothing invented.
- `robots.txt` and `sitemap.xml` generated at build time from your domain.
- Build-time prerender: the full text, headings and links are in the first HTML response (one `<h1>`, `<h2>` per section, `<h3>` for cards), so crawlers don't depend on JavaScript or the canvas.
- Semantic `<header>`, `<nav>`, `<main>`, `<section aria-labelledby>`, skip link, crawlable `#anchor` navigation, alt text on images.
- No-WebGL / no-JS / failed-asset visitors get a static portrait image (`/portrait.jpg`) with descriptive alt text.

## Getting indexed by Google
1. Set `VITE_SITE_URL` and deploy over HTTPS.
2. Open [Google Search Console](https://search.google.com/search-console) and add a property. A **Domain** property (DNS TXT record) covers all subdomains; a **URL-prefix** property also allows an HTML-file or meta-tag check.
3. Verify ownership (add the TXT record at your DNS provider, then click Verify).
4. **Sitemaps** → submit `https://your-domain/sitemap.xml`.
5. **URL Inspection** → paste your homepage URL → *Request indexing*.
6. Monitor **Pages** (indexing), **Performance** (queries for your name) and **Core Web Vitals**.
7. Help it along: link to the site from your LinkedIn and GitHub profiles, and use the same name ("Othmane Hamadellah") everywhere.

Indexing and ranking are decided by Google. Nothing here can guarantee that the site is indexed quickly or ranks first, even for your own name. These steps just remove technical obstacles and give Google clear identity signals.

## Honest notes
- The 3D head is a local two-photo silhouette reconstruction with photo tones for detail, not an AI-generated scan. Detail is best within about ±30° of front-on.
- Frame rates were only checked with software rendering. Test on a real phone and laptop; `?particles=40000` in the URL lowers the count.

---

# v1.2 — images instead of icons, component architecture

## Structure
```
src/
├── components/
│   ├── Navbar, Hero, About, WhatIBuild, Skills, Projects, Experience (education + certifications), Services, Contact, Footer, AmbientBackground
│   ├── common/   Reveal, SectionTitle, SectionDivider, GlassCard, GlowOrb, TechLogo, Icon, Visual, ImageCard, SocialLinks, logos.js
│   └── 3d/       Scene, ParticlePortrait, CursorGlow, Loader, WebGLFallback   (protected: only import paths changed)
├── data/portfolioData.js   all portfolio content (skills, projects, timeline, services, contact)
├── assets/logos/           official brand SVGs      assets/projects/  project banners
├── shaders/, utils/        untouched 3D code
```
## Images
- Brand logos are local SVGs (devicon / simple-icons). Technologies without an official logo (REST API, MVC, Authentication, TCP/IP, Virtualization, Admin dashboards, IT consulting, ENAA/ISTA) keep a minimal line icon instead of an unrelated picture.
- Project banners (`src/assets/projects/*.svg`) show each project's real tech-stack logos. They are not screenshots (none exist in the repos). To use a real screenshot, add e.g. `src/assets/projects/linkup.webp` and delete the same-named `.svg`; the card picks it up automatically. `npm run thumbs` regenerates the SVG banners.
- Add a logo: drop `name.svg` in `src/assets/logos/` and use `name` in `portfolioData.js`.

---

# v1.3 — navigation and transition polish
Single-page site, so there are no routes to transition between; the motion is on section navigation. No animation library was added (CSS transforms/opacity + IntersectionObserver keep the bundle unchanged).
- `utils/scroll.js`: eased, interruptible scroll to a section (distance-aware duration, instant under `prefers-reduced-motion`), updates the URL hash and moves focus to the section.
- `hooks` → `useScrollSpy`: active section from scroll position; paused during programmatic scrolls so the nav doesn't flicker.
- `Navbar`: one underline that slides between links, hover underline, header slide-in after the loader, hamburger that morphs into a cross, mobile menu that opens with a height + staggered fade (Escape closes it).
- `Reveal`: subtler distances, one-shot (never replays), capped stagger delay; title underline draws in; project banners settle in. Styles are in `styles/motion.css`.
- The 3D files, shaders, model and textures are unchanged (byte-identical).

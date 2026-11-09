/**
 * Build step 2 — static HTML for crawlers and first paint.
 *
 * `vite build` produces dist/index.html with an empty <div id="root">. This script
 * renders the React app to a string (react-dom/server, no browser needed) and writes
 * it into that div, so Google and social crawlers receive the real headings, text and
 * links in the very first HTML response, without having to run JavaScript.
 * In the browser, main.jsx then replaces this markup with the live app (createRoot).
 */
import { createServer } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "dist", "index.html");
if (!fs.existsSync(file)) throw new Error("dist/index.html not found — run `vite build` first");

const vite = await createServer({
  root,
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true },
});

try {
  const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");
  const markup = render();
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes('<div id="root"></div>')) throw new Error('<div id="root"></div> not found in dist/index.html');
  // In the SSR pass, imported images resolve to their dev paths (/src/assets/...). Point them at the
  // hashed files Vite just emitted into dist/assets, so the static HTML shows the same images.
  const built = fs.readdirSync(path.join(root, "dist", "assets"));
  let missing = 0;
  const fixed = markup.replace(/\/src\/assets\/(?:logos|projects)\/([\w-]+)\.(\w+)/g, (m, name, ext) => {
    const re = new RegExp(`^${name}-[\\w-]{8}\\.${ext}$`);
    const hit = built.find((f) => re.test(f));
    if (!hit) missing++;
    return hit ? `/assets/${hit}` : m;
  });
  if (missing) throw new Error(`prerender: ${missing} image path(s) could not be mapped to dist/assets`);
  fs.writeFileSync(file, html.replace('<div id="root"></div>', `<div id="root">${fixed}</div>`));
  console.log(`prerender: wrote ${(markup.length / 1024).toFixed(1)} kB of static HTML into dist/index.html`);
} finally {
  await vite.close();
}

if (!fs.existsSync(path.join(root, "public", "othmane-cv.pdf"))) {
  console.warn("\n⚠  public/othmane-cv.pdf is missing — the “Download CV” buttons will 404. Add your CV there.\n");
}

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const PLACEHOLDER = "https://your-domain.example";

/**
 * Production domain, used for the canonical URL, Open Graph URLs, JSON-LD,
 * robots.txt and sitemap.xml. Set it once:
 *   - VITE_SITE_URL in .env (or in your host's environment variables), e.g. https://www.mydomain.com
 * Netlify / Cloudflare Pages / Vercel URLs are picked up automatically as a fallback.
 */
function resolveSiteUrl(mode) {
  const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
  let url =
    env.VITE_SITE_URL ||
    env.URL || // Netlify (primary site URL)
    env.CF_PAGES_URL || // Cloudflare Pages
    (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    PLACEHOLDER;
  if (!/^https?:\/\//.test(url)) url = `https://${url}`;
  return url.replace(/\/+$/, "");
}

function seoPlugin(siteUrl) {
  const today = new Date().toISOString().slice(0, 10);
  return {
    name: "portfolio-seo",
    // replaces __SITE_URL__ in index.html (canonical, og:url, JSON-LD, ...)
    transformIndexHtml: { order: "pre", handler: (html) => html.replaceAll("__SITE_URL__", siteUrl) },
    generateBundle() {
      if (siteUrl === PLACEHOLDER) {
        this.warn(
          "VITE_SITE_URL is not set: canonical URL, sitemap.xml and robots.txt use the placeholder " +
            `${PLACEHOLDER}. Set VITE_SITE_URL to your real domain before deploying (see README).`
        );
      }
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${siteUrl}/portrait.jpg</image:loc>
      <image:title>Othmane Hamadellah — Full-Stack Web Developer</image:title>
    </image:image>
  </url>
</urlset>
`,
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), seoPlugin(resolveSiteUrl(mode))],
  build: { chunkSizeWarningLimit: 1500, target: "es2020", assetsInlineLimit: 0 } // logos stay separate cacheable files, not data URIs in the JS/HTML,
}));

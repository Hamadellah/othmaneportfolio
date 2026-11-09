// Generates src/assets/projects/<slug>.svg: a brand-coloured banner showing each project's real tech stack
// (official logos from src/assets/logos). These are NOT screenshots. To use a real screenshot, drop
// <slug>.webp (or .png/.jpg) next to the SVG and point `image` in src/data/portfolioData.js at it.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logos = path.join(root, "src/assets/logos");
const out = path.join(root, "src/assets/projects");
fs.mkdirSync(out, { recursive: true });

const PROJECTS = [
  { slug: "pharmafefo", color: "#00f5ff", stack: ["php", "mysql", "bootstrap"] },
  { slug: "bde-events", color: "#b855ff", stack: ["laravel", "react", "mysql", "docker"] },
  { slug: "linkup", color: "#ff4d8d", stack: ["laravel", "mysql", "tailwindcss"] },
  { slug: "eduquiz", color: "#39d98a", stack: ["laravel", "mysql", "bootstrap"] },
];

const W = 640, H = 320, TILE = 96, GAP = 22;
const uri = (name) => "data:image/svg+xml;base64," + fs.readFileSync(path.join(logos, `${name}.svg`)).toString("base64");

for (const { slug, color, stack } of PROJECTS) {
  const total = stack.length * TILE + (stack.length - 1) * GAP;
  const x0 = (W - total) / 2, y0 = (H - TILE) / 2 + 8;
  const tiles = stack.map((name, i) => {
    const x = x0 + i * (TILE + GAP);
    return `<g><rect x="${x}" y="${y0}" width="${TILE}" height="${TILE}" rx="22" fill="#ffffff" fill-opacity="0.07" stroke="${color}" stroke-opacity="0.35"/>
    <image href="${uri(name)}" x="${x + 22}" y="${y0 + 22}" width="52" height="52"/></g>`;
  }).join("\n  ");
  fs.writeFileSync(path.join(out, `${slug}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${color}" stop-opacity="0.20"/><stop offset="1" stop-color="#050510" stop-opacity="1"/></linearGradient>
    <radialGradient id="glow" cx="50%" cy="55%" r="55%"><stop offset="0" stop-color="${color}" stop-opacity="0.28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="#fff" fill-opacity="0.07"/></pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="#07071a"/>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="0" y="0" width="${W}" height="30" fill="#000" fill-opacity="0.25"/>
  <circle cx="18" cy="15" r="4.5" fill="#fff" fill-opacity="0.25"/><circle cx="34" cy="15" r="4.5" fill="#fff" fill-opacity="0.18"/><circle cx="50" cy="15" r="4.5" fill="#fff" fill-opacity="0.12"/>
  ${tiles}
</svg>
`);
}
console.log("project banners written to", out);

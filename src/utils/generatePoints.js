import * as THREE from "three";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import meta from "../data/portrait-meta.json";

/** Head-only bust: vertical centre and height of the sampled head (world units). */
export const HEAD = {
  top: meta.yTop,
  bottom: meta.yCut,
  height: meta.yTop - meta.yCut,
  centerY: (meta.yTop + meta.yCut) / 2,
  chinY: meta.yChin,
};

/** Small deterministic PRNG so the portrait looks identical on every load. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Decode a loaded <img> into a Float32 luminance map (0..1). */
function toToneMap(img) {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const px = ctx.getImageData(0, 0, w, h).data;
  const data = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) data[i] = px[i * 4] / 255;
  return { data, w, h };
}

function sampleTone(map, u, v) {
  const x = Math.min(Math.max(u, 0), 1) * (map.w - 1);
  const y = Math.min(Math.max(v, 0), 1) * (map.h - 1);
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const x1 = Math.min(x0 + 1, map.w - 1), y1 = Math.min(y0 + 1, map.h - 1);
  const fx = x - x0, fy = y - y0;
  const d = map.data;
  const a = d[y0 * map.w + x0], b = d[y0 * map.w + x1];
  const c = d[y1 * map.w + x0], e = d[y1 * map.w + x1];
  return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + e * fx) * fy;
}

/**
 * Probability of keeping a surface sample (importance sampling).
 * The head only turns a few degrees, so most of the budget goes to the face;
 * the back of the skull and the short neck get a lighter density.
 */
function densityAt(y, nz) {
  const neck = Math.min(Math.max((y - meta.yCut) / Math.max(meta.yChin - meta.yCut, 1e-3), 0), 1);
  const neckK = 0.35 + 0.65 * neck * neck * (3 - 2 * neck);
  const b = Math.min(Math.max((nz + 0.7) / 0.7, 0), 1);
  const facing = 0.3 + 0.7 * (b * b * (3 - 2 * b));
  return neckK * facing;
}

/**
 * Scatter `count` points over the reconstructed bust surface.
 *
 * Positions and normals come from the actual GLB geometry
 * (MeshSurfaceSampler, area-weighted). Each point then looks up its tone in
 * the two clay photographs: front-facing points read the front view, side- and
 * back-facing points read the side view, blended by the surface normal. The
 * tone also pushes the point slightly along its normal, which turns the flat
 * hull into a relief with real depth in the curls and facial features.
 */
export function generatePoints({ geometry, frontImg, sideImg, count, relief = 0.016, seed = 1337 }) {
  const rand = mulberry32(seed);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
  const sampler = new MeshSurfaceSampler(mesh).setRandomGenerator(rand).build();

  const front = toToneMap(frontImg);
  const side = toToneMap(sideImg);

  const positions = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const randoms = new Float32Array(count * 4);
  const tones = new Float32Array(count);

  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  const { yTop, yBottom } = meta;
  const fx0 = meta.front.xMin, fx1 = meta.front.xMax;
  const sz0 = meta.side.zNear, sz1 = meta.side.zFar;

  for (let i = 0; i < count; i++) {
    // Importance sampling: most of the budget goes to the head and neck so
    // the face and curls resolve; the torso keeps a sparse, fading density.
    do {
      sampler.sample(p, n);
      // never put points on the flat cut at the bottom of the neck
    } while ((n.y < -0.5 && p.y < meta.yCut + 0.02) || rand() > densityAt(p.y, n.z));
    const v = (yTop - p.y) / (yTop - yBottom);
    const tf = sampleTone(front, (p.x - fx0) / (fx1 - fx0), v);
    const ts = sampleTone(side, (sz0 - p.z) / (sz0 - sz1), v);

    const wf = Math.max(n.z, 0) ** 2;
    const ws = n.x * n.x + Math.max(-n.z, 0) ** 2 + 0.6 * n.y * n.y;
    const tone = (wf * tf + ws * ts + 1e-3 * 0.45) / (wf + ws + 1e-3);

    const push = (Math.min(Math.max(tone, 0.08), 0.92) - 0.55) * relief;
    positions[i * 3] = p.x + n.x * push;
    positions[i * 3 + 1] = p.y + n.y * push;
    positions[i * 3 + 2] = p.z + n.z * push;
    normals[i * 3] = n.x;
    normals[i * 3 + 1] = n.y;
    normals[i * 3 + 2] = n.z;
    tones[i] = Math.min(Math.max((tone - 0.12) / 0.62, 0), 1);

    // Where the particle starts: a loose, slightly flattened cloud.
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const r = 2.2 + rand() * 4.2;
    scatter[i * 3] = Math.sin(phi) * Math.cos(theta) * r * 1.35;
    scatter[i * 3 + 1] = Math.cos(phi) * r * 0.85;
    scatter[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r - 1.0;

    randoms[i * 4] = rand();      // assemble stagger
    randoms[i * 4 + 1] = rand();  // size variation
    randoms[i * 4 + 2] = rand();  // phase
    randoms[i * 4 + 3] = rand();  // cursor response
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setAttribute("aNormal", new THREE.BufferAttribute(normals, 3));
  g.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
  g.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 4));
  g.setAttribute("aTone", new THREE.BufferAttribute(tones, 1));
  // Shader moves points far from their rest position, so skip frustum culling.
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 12);
  return g;
}

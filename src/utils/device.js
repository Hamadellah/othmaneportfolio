// Light-weight device helpers (no three.js import: used by the main bundle).

/** Pick a particle budget that matches the device. */
export function pickParticleCount() {
  const forced = Number(new URLSearchParams(window.location.search).get("particles"));
  if (forced >= 1000 && forced <= 200000) return Math.round(forced); // e.g. /?particles=66000
  const coarse = window.matchMedia?.("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  if (small || coarse) return cores <= 4 || mem <= 2 ? 30000 : 40000;
  if (cores <= 4 || mem <= 4) return 48000;
  return 66000;
}

/**
 * Tiny progress store shared by the page (Loader, in the main bundle) and the
 * lazy 3D chunk. It keeps the heavy three.js / drei code out of the main bundle:
 * the Loader only needs this file.
 *
 *   stage 1  the 3D chunk is downloading   -> 0..18 %   (eased, size unknown)
 *   stage 2  GLB + textures are downloading -> 18..96 % (real bytes, from three.js' LoadingManager)
 *   done     particles are built            -> 100 %
 */
let state = { progress: 0, label: "Starting" };
const listeners = new Set();

export const loadProgress = {
  get: () => state,
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  set(progress, label) {
    const next = { progress: Math.max(state.progress, progress), label: label ?? state.label };
    if (next.progress === state.progress && next.label === state.label) return;
    state = next;
    listeners.forEach((fn) => fn(state));
  },
};

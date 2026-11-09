/**
 * Eased scrolling between sections.
 * Native `scroll-behavior: smooth` is browser-tuned and can't be interrupted cleanly or timed;
 * this animates window.scrollTo with a distance-aware duration and an ease-in-out curve,
 * stops as soon as the visitor takes over (wheel / touch / keys), and skips the animation
 * entirely for `prefers-reduced-motion`.
 */
let raf = 0;
let locked = false;
const listeners = new Set();

/** True while a programmatic scroll is running (the scroll-spy pauses so the nav doesn't flicker). */
export const isAutoScrolling = () => locked;

const reduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function release() {
  locked = false;
  cancelAnimationFrame(raf);
  document.documentElement.style.scrollBehavior = "";
  for (const ev of ["wheel", "touchstart", "keydown", "mousedown"]) window.removeEventListener(ev, cancel);
  window.dispatchEvent(new Event("scroll")); // let the scroll-spy settle on the final position
}
function cancel() { if (locked) release(); }

export function scrollToSection(id, { onStart } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  onStart?.(id);
  history.replaceState(null, "", `#${id}`);

  const maxY = () => document.documentElement.scrollHeight - window.innerHeight;
  const targetY = () => (id === "home" ? 0 : Math.min(Math.max(0, el.getBoundingClientRect().top + window.scrollY), maxY()));
  const finish = () => {
    // keyboard / screen-reader users land on the section, without a second scroll
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };

  cancelAnimationFrame(raf);
  if (reduced()) {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, targetY());
    document.documentElement.style.scrollBehavior = "";
    finish();
    return;
  }

  const startY = window.scrollY;
  const dist = Math.abs(targetY() - startY);
  if (dist < 2) return finish();
  const duration = Math.min(1100, 450 + dist * 0.22);
  const t0 = performance.now();

  locked = true;
  document.documentElement.style.scrollBehavior = "auto"; // CSS smoothing would fight the animation
  for (const ev of ["wheel", "touchstart", "keydown", "mousedown"]) window.addEventListener(ev, cancel, { passive: true });

  const step = (now) => {
    if (!locked) return;
    const p = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, startY + (targetY() - startY) * easeInOutCubic(p));
    if (p < 1) raf = requestAnimationFrame(step);
    else { release(); finish(); }
  };
  raf = requestAnimationFrame(step);
}

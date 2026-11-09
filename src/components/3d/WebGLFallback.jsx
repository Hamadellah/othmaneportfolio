/** Detect WebGL support without throwing (false on the server). */
export function hasWebGL() {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Static portrait for crawlers, no-JS visitors, devices without WebGL, or if the 3D
 * asset fails: the clay head in the cyan/violet ring of the original avatar.
 * It is real HTML with a descriptive alt text, so it is indexable.
 */
export default function WebGLFallback() {
  return (
    <div className="portrait-fallback">
      <div className="portrait-fallback__ring" />
      <div className="portrait-fallback__img">
        <img
          src="/portrait.jpg"
          width="480"
          height="480"
          decoding="async"
          alt="Clay-style portrait of Othmane Hamadellah, full-stack web developer from Beni Mellal, Morocco"
        />
      </div>
    </div>
  );
}

import { useReveal } from "../../hooks";

/** Animates its children into view with a chosen effect (fires once). */
export function Reveal({ children, effect = "fadeUp", delay = 0, style = {} }) {
  const [ref, visible] = useReveal(0.1);
  const d = Math.min(delay, 360); // long stagger delays would otherwise lag items that scroll in later
  const base = { transition: `opacity 0.8s ease ${d}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${d}ms`, willChange: visible ? "auto" : "opacity, transform" };
  const hidden = {
    fadeUp:    { opacity: 0, transform: "translateY(28px)" },
    fadeLeft:  { opacity: 0, transform: "translateX(-32px)" },
    fadeRight: { opacity: 0, transform: "translateX(32px)" },
    fadeIn:    { opacity: 0, transform: "scale(0.97)" },
    slideUp:   { opacity: 0, transform: "translateY(40px) scale(0.98)" },
  }[effect] || { opacity: 0 };
  const shown = { opacity: 1, transform: "none" };
  return (
    <div ref={ref} data-reveal data-visible={visible ? "true" : "false"} style={{ ...base, ...(visible ? shown : hidden), ...style }}>
      {children}
    </div>
  );
}

export default Reveal;

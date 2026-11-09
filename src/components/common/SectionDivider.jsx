import { useReveal } from "../../hooks";

/** Glowing divider between sections. */
export default function SectionDivider({ color1 = "#00f5ff", color2 = "#b855ff" }) {
  const [ref, visible] = useReveal(0.5);
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2rem", overflow: "hidden" }}>
      <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${color1}44)`, transition: "opacity 1s ease", opacity: visible ? 1 : 0 }} />
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color1, margin: "0 12px", boxShadow: `0 0 12px ${color1}`, transition: "opacity 0.8s 0.3s ease, transform 0.8s 0.3s cubic-bezier(0.22,1,0.36,1)", opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0)" }} />
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: color2, margin: "0 8px", boxShadow: `0 0 10px ${color2}`, transition: "opacity 0.8s 0.45s ease, transform 0.8s 0.45s cubic-bezier(0.22,1,0.36,1)", opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0)" }} />
      <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#fff", margin: "0 8px", transition: "opacity 0.8s 0.55s ease, transform 0.8s 0.55s cubic-bezier(0.22,1,0.36,1)", opacity: visible ? 0.4 : 0, transform: visible ? "scale(1)" : "scale(0)" }} />
      <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${color2}44, transparent)`, transition: "opacity 1s ease", opacity: visible ? 1 : 0 }} />
    </div>
  );
}

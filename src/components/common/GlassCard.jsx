import { useState } from "react";
import { COLORS } from "../../theme";

export default function GlassCard({ children, accentColor = COLORS.cyan, style = {} }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="glass-card" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)", border: `1px solid ${hovered ? accentColor + "44" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, padding: "1.25rem", transition: "all 0.3s ease", boxShadow: hovered ? `0 0 30px ${accentColor}22` : "none", transform: hovered ? "translateY(-4px)" : "translateY(0)", ...style }}>
      {children}
    </div>
  );
}

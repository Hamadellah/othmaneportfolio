import { COLORS } from "../../theme";
import { Reveal } from "./Reveal";

/** Section heading: small tag line, H2, gradient underline. */
export default function SectionTitle({ tag, title, center = false }) {
  return (
    <Reveal effect="fadeUp" delay={0}>
    <div style={{ marginBottom: "3rem", textAlign: center ? "center" : "left" }}>
      <span style={{ color: COLORS.cyan, fontSize: 12, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>{tag}</span>
      <h2 style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)", fontWeight: 800, color: "#fff", margin: "0.5rem 0 0", fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
      <div className="section-title__bar" style={{ width: 60, height: 3, background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.purple})`, borderRadius: 2, marginTop: "1rem", marginLeft: center ? "auto" : 0, marginRight: center ? "auto" : 0 }} />
    </div>
    </Reveal>
  );
}

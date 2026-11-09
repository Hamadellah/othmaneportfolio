import { COLORS } from "../theme";
import { useIsMobile } from "../hooks";
import { ABOUT } from "../data/portfolioData";
import { Reveal, SectionDivider, SectionTitle, GlassCard, GlowOrb, TechLogo, Icon, Visual } from "./common";

export default function About() {
  const isMobile = useIsMobile();
  return (
    <>
    <SectionDivider color1="#00f5ff" color2="#4f8ef7" />
    <section id="about" style={{ padding: isMobile ? "70px 1.25rem" : "100px 2rem", position: "relative" }}>
      <GlowOrb x="70%" y="50%" color={COLORS.blue} size={300} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle tag="01. About Me" title="Who I Am" />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "2rem" : "4rem", alignItems: "center" }}>
          <Reveal effect="fadeLeft" delay={100}>
          <div>
            {ABOUT.paragraphs.map((text, i) => (
              <p key={i} style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.9, fontSize: 15, marginBottom: i === 0 ? "1.25rem" : "1.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>{text}</p>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.75rem" }}>
              {ABOUT.facts.map(({ logo, icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ flexShrink: 0, width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", color: COLORS.cyan }}>
                    {logo ? <TechLogo name={logo} size={18} alt="" /> : <Icon name={icon} size={17} />}
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "'Space Grotesk', sans-serif", wordBreak: "break-all" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {ABOUT.highlights.map(({ visual, title, desc, color }, i) => (
              <Reveal key={title} effect="fadeIn" delay={150 + i * 100}>
              <GlassCard accentColor={color} style={{ padding: "1rem" }}>
                <div style={{ marginBottom: 12, minHeight: 28, display: "flex", alignItems: "center" }}><Visual visual={visual} size={28} color={color} /></div>
                <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.6, fontFamily: "'Space Grotesk', sans-serif" }}>{desc}</p>
              </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

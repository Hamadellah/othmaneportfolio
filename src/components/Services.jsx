import { COLORS } from "../theme";
import { useIsMobile } from "../hooks";
import { SERVICES } from "../data/portfolioData";
import { Reveal, SectionDivider, SectionTitle, GlassCard, GlowOrb, Visual } from "./common";

export default function Services() {
  const isMobile = useIsMobile();
  return (
    <>
    <SectionDivider color1="#b855ff" color2="#00ff88" />
    <section id="services" style={{ padding: isMobile ? "70px 1.25rem" : "100px 2rem", position: "relative" }}>
      <GlowOrb x="80%" y="40%" color={COLORS.purple} size={300} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle tag="05. Services" title="What I Offer" center />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} effect="slideUp" delay={i * 100}>
            <GlassCard accentColor={s.color}>
              <div style={{ minWidth: 46, width: "fit-content", height: 46, padding: "0 11px", borderRadius: 12, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <Visual visual={s.visual} size={24} color={s.color} />
              </div>
              <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>{s.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.7, fontFamily: "'Space Grotesk', sans-serif" }}>{s.desc}</p>
            </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

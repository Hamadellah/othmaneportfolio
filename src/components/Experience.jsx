import { COLORS } from "../theme";
import { useIsMobile } from "../hooks";
import { TIMELINE } from "../data/portfolioData";
import { Reveal, SectionDivider, SectionTitle, GlassCard, GlowOrb, Visual } from "./common";

const font = "'Space Grotesk', sans-serif";

/** Content of one education / certification card (shared by the mobile and desktop timelines). */
function TimelineCard({ item, style }) {
  return (
    <GlassCard accentColor={item.color} style={style}>
      <div style={{ marginBottom: 8, minHeight: 28, display: "flex", alignItems: "center" }}><Visual visual={item.visual} size={26} color={item.color} /></div>
      <span style={{ fontSize: 11, color: item.color, fontWeight: 600, fontFamily: font, letterSpacing: 1 }}>{item.kind} · {item.year}</span>
      <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "5px 0", fontFamily: font }}>{item.title}</h3>
      <div style={{ fontSize: 12, color: item.color, marginBottom: 6, fontFamily: font }}>{item.org}</div>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0, fontFamily: font }}>{item.desc}</p>
    </GlassCard>
  );
}

export default function Experience() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <>
      <SectionDivider color1="#4f8ef7" color2="#b855ff" />
      <section id="experience" style={{ padding: "70px 1.25rem", position: "relative" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionTitle tag="04. Education & Certifications" title="My Journey" />
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", paddingLeft: "1.5rem", borderLeft: `2px solid rgba(0,245,255,0.2)` }}>
            {TIMELINE.map((item, i) => (
              <Reveal key={item.title} effect="fadeLeft" delay={i * 120}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: -28, top: 18, width: 14, height: 14, borderRadius: "50%", background: item.color, boxShadow: `0 0 12px ${item.color}` }} />
                <TimelineCard item={item} style={{ padding: "1rem" }} />
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      </>
    );
  }

  return (
    <>
    <SectionDivider color1="#4f8ef7" color2="#b855ff" />
    <section id="experience" style={{ padding: "100px 2rem", position: "relative" }}>
      <GlowOrb x="-5%" y="50%" color={COLORS.cyan} size={300} />
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <SectionTitle tag="04. Education & Certifications" title="My Journey" center />
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "linear-gradient(180deg, transparent, rgba(0,245,255,0.3), transparent)", transform: "translateX(-50%)" }} />
          {TIMELINE.map((item, i) => (
            <Reveal key={item.title} effect={i % 2 === 0 ? "fadeLeft" : "fadeRight"} delay={i * 100}>
            <div style={{ display: "flex", gap: "2rem", marginBottom: "2.5rem", flexDirection: i % 2 === 0 ? "row" : "row-reverse", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}><TimelineCard item={item} /></div>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: item.color, flexShrink: 0, marginTop: 18, boxShadow: `0 0 16px ${item.color}`, zIndex: 1 }} />
              <div style={{ flex: 1 }} />
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

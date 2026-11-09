import { COLORS } from "../theme";
import { useIsMobile } from "../hooks";
import { SKILLS } from "../data/portfolioData";
import { Reveal, SectionDivider, SectionTitle, GlassCard, GlowOrb, TechLogo, Icon, Visual } from "./common";

const ALL_SKILLS = SKILLS.flatMap((g) => g.items.map((i) => i.name));

export default function Skills() {
  const isMobile = useIsMobile();
  return (
    <>
      <SectionDivider color1="#b855ff" color2="#00f5ff" />
      <section id="skills" style={{ padding: isMobile ? "70px 1.25rem" : "100px 2rem", position: "relative" }}>
        <GlowOrb x="-5%" y="30%" color={COLORS.purple} size={300} />
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionTitle tag="02. Skills" title="Technical Arsenal" center />
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {SKILLS.map(({ cat, color, visual, items }, i) => (
              <Reveal key={cat} effect="slideUp" delay={i * 120}>
                <GlassCard accentColor={color}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Visual visual={visual} size={22} />
                    </div>
                    <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{cat}</h3>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {items.map(({ name, logo, icon }) => (
                      <span key={name} className="skill-chip" style={{ padding: "4px 10px", borderRadius: 8, background: `${color}15`, border: `1px solid ${color}33`, color: "#fff", fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}>
                        {logo ? <TechLogo name={logo} size={16} /> : <span style={{ color, display: "inline-flex" }}><Icon name={icon} size={15} /></span>}
                        {name}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
          <Reveal effect="fadeUp" delay={200}>
            <div style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", gap: "0.6rem", justifyContent: "center" }}>
              {ALL_SKILLS.map(tag => (
                <span key={tag} style={{ padding: "5px 14px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "'Space Grotesk', sans-serif", cursor: "default" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,245,255,0.1)"; e.currentTarget.style.borderColor = "rgba(0,245,255,0.3)"; e.currentTarget.style.color = COLORS.cyan; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

import { useIsMobile } from "../hooks";
import { WHAT_I_BUILD } from "../data/portfolioData";
import { Reveal, SectionDivider, SectionTitle, GlassCard, Visual } from "./common";

export default function WhatIBuild() {
  const isMobile = useIsMobile();
  return (
    <>
    <SectionDivider color1="#00f5ff" color2="#b855ff" />
    <section id="what-i-build" style={{ padding: isMobile ? "60px 1.25rem" : "80px 2rem", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle tag="What I Build" title="Building Blocks" center />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {WHAT_I_BUILD.map((item, i) => (
            <Reveal key={item.label} effect="fadeIn" delay={i * 80}>
              <GlassCard accentColor={item.color} style={{ textAlign: "center", padding: "1.25rem 1rem" }}>
                <div style={{ marginBottom: 10, minHeight: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Visual visual={item.visual} size={32} color={item.color} />
                </div>
                <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.4 }}>{item.label}</div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

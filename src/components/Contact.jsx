import { useState } from "react";
import { COLORS } from "../theme";
import { useIsMobile } from "../hooks";
import { CONTACT_LINKS } from "../data/portfolioData";
import { Reveal, SectionDivider, SectionTitle, GlassCard, GlowOrb, Icon, SocialLinks } from "./common";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const isMobile = useIsMobile();
  const handle = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <>
    <SectionDivider color1="#00f5ff" color2="#4f8ef7" />
    <section id="contact" style={{ padding: isMobile ? "70px 1.25rem" : "100px 2rem", position: "relative" }}>
      <GlowOrb x="20%" y="30%" color={COLORS.cyan} size={300} />
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <SectionTitle tag="06. Contact" title="Let's Connect" center />
        <Reveal effect="fadeIn" delay={100}>
        <GlassCard accentColor={COLORS.cyan} style={{ padding: isMobile ? "1.5rem" : "2.5rem" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ color: COLORS.cyan, marginBottom: "1rem", display: "flex", justifyContent: "center" }}><Icon name="check" size={56} strokeWidth={1.5} /></div>
              <h3 style={{ color: COLORS.cyan, fontSize: 22, fontFamily: "'Space Grotesk', sans-serif" }}>Message sent!</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Space Grotesk', sans-serif" }}>I'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                {[["name", "Name", "Your name"], ["email", "Email", "your@email.com"]].map(([k, label, placeholder]) => (
                  <div key={k}>
                    <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontFamily: "'Space Grotesk', sans-serif" }}>{label}</label>
                    <input value={form[k]} onChange={handle(k)} placeholder={placeholder} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "11px 14px", color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = COLORS.cyan} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontFamily: "'Space Grotesk', sans-serif" }}>Message</label>
                <textarea value={form.msg} onChange={handle("msg")} placeholder="Tell me about your project..." rows={5} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "11px 14px", color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = COLORS.cyan} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              <button onClick={() => setSent(true)} style={{ width: "100%", background: "linear-gradient(135deg, #00f5ff, #4f8ef7)", color: "#000", padding: "14px 32px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>Send Message <Icon name="send" size={17} /></button>
              <SocialLinks links={CONTACT_LINKS} gap={isMobile ? "1.25rem" : "2rem"} />
            </div>
          )}
        </GlassCard>
        </Reveal>
      </div>
    </section>
    </>
  );
}

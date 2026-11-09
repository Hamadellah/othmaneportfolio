import { FOOTER_LINKS, FOOTER_TAGLINE } from "../data/portfolioData";
import { SocialLinks } from "./common";

export default function Footer() {
  return (
    <footer style={{ padding: "2.5rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 26, fontWeight: 800, background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "0.5rem" }}>OH.</div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "1.25rem" }}>{FOOTER_TAGLINE}</p>
        <SocialLinks links={FOOTER_LINKS} variant="round" />
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "'Space Grotesk', sans-serif" }}>© 2026 Othmane Hamadellah. Crafted with passion.</p>
      </div>
    </footer>
  );
}

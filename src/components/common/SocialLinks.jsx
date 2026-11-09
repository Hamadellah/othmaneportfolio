import TechLogo from "./TechLogo";
import Icon from "./Icon";
import { COLORS } from "../../theme";

/**
 * Social / contact links.
 *  variant="stack": logo above label and value (contact card)
 *  variant="round": round logo buttons (footer)
 * Each link: { key, label, value, href, logo? | icon?, external? }
 */
export default function SocialLinks({ links, variant = "stack", gap }) {
  if (variant === "round") {
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: gap ?? "1rem", marginBottom: "1.25rem" }}>
        {links.map(({ key, label, href, logo, icon, external }) => (
          <a key={key} href={href} aria-label={label} className="social-round" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {logo ? <TechLogo name={logo} size={18} alt="" /> : <Icon name={icon} size={17} />}
          </a>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: gap ?? "2rem", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" }}>
      {links.map(({ key, label, value, href, logo, icon }) => (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="social-stack" style={{ textAlign: "center", textDecoration: "none" }}>
          <div style={{ height: 28, marginBottom: 6, display: "flex", justifyContent: "center", alignItems: "center", color: COLORS.cyan }}>
            {logo ? <TechLogo name={logo} size={26} alt={`${label} logo`} /> : <Icon name={icon} size={24} />}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk', sans-serif" }}>{label}</div>
          <div style={{ fontSize: 11, color: COLORS.cyan, fontFamily: "'Space Grotesk', sans-serif", wordBreak: "break-all" }}>{value}</div>
        </a>
      ))}
    </div>
  );
}

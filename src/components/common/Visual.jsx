import TechLogo from "./TechLogo";
import Icon from "./Icon";

/**
 * Renders the visual of a data entry: one or more brand logos, or a minimal icon
 * when no relevant logo exists.  visual = { logos: ["php", "react"] } | { icon: "chart" }
 */
export default function Visual({ visual, size = 22, color, label }) {
  if (visual?.logos) {
    return (
      <span className="visual-logos">
        {visual.logos.map((n) => <TechLogo key={n} name={n} size={size} />)}
      </span>
    );
  }
  return (
    <span className="visual-icon" style={{ color, display: "inline-flex" }} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <Icon name={visual?.icon} size={size} />
    </span>
  );
}

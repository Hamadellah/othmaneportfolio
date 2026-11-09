import { logoUrl, logoAlt } from "./logos";

/** An official brand logo from src/assets/logos, with a subtle hover lift (see styles/media.css). */
export default function TechLogo({ name, size = 24, alt, className = "" }) {
  const src = logoUrl(name);
  if (!src) return null;
  return (
    <img
      className={`tech-logo ${className}`}
      src={src}
      alt={alt ?? logoAlt(name)}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      draggable="false"
    />
  );
}

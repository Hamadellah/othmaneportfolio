/**
 * Banner image of a card: fixed height, object-fit: cover, tinted overlay that
 * clears and zooms slightly on hover (styles/media.css).
 */
export default function ImageCard({ src, alt, color, hovered = false, height = 150, width = 640, imgHeight = 320 }) {
  return (
    <div
      className="image-card"
      data-hovered={hovered ? "true" : "false"}
      style={{ height, background: `linear-gradient(135deg, ${color}22, ${color}08)` }}
    >
      <img className="image-card__img" src={src} alt={alt} width={width} height={imgHeight} loading="lazy" decoding="async" />
      <div className="image-card__shade" />
    </div>
  );
}

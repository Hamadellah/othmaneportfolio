export default function GlowOrb({ x, y, color, size = 300 }) {
  return <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: color, filter: "blur(80px)", opacity: 0.1, pointerEvents: "none" }} />;
}

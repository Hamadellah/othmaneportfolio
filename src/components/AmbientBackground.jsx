/**
 * Quiet fixed backdrop for the whole page: deep navy with two slow cyan/violet
 * washes. Replaces the original photo/video backdrop so the particle portrait
 * stays the single visual centrepiece (see README).
 */
export default function AmbientBackground() {
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden", background: "#050510", pointerEvents: "none" }}>
      <div style={{ position: "absolute", width: "46vw", height: "46vw", top: "-14%", left: "-12%", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,245,255,0.11), transparent 70%)", filter: "blur(70px)", animation: "aurora1 18s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: "46vw", height: "46vw", bottom: "-16%", right: "-12%", borderRadius: "50%", background: "radial-gradient(circle, rgba(184,85,255,0.12), transparent 70%)", filter: "blur(80px)", animation: "aurora2 22s ease-in-out infinite" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 0%, rgba(5,5,16,0.55) 100%)" }} />
    </div>
  );
}

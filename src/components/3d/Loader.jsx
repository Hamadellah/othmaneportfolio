import { useEffect, useRef, useState } from "react";
import { loadProgress } from "../../utils/loadProgress";

/**
 * Loading screen with real progress. The percentage comes from loadProgress:
 * the real byte counts of the GLB + tone textures (three.js LoadingManager),
 * preceded by an eased phase while the 3D chunk itself downloads.
 * When the particle system is built (`ready`) the bar completes and fades out.
 */
export default function Loader({ ready, onDone }) {
  const [snap, setSnap] = useState(loadProgress.get());
  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => loadProgress.subscribe(setSnap), []);

  const target = ready ? 100 : Math.min(snap.progress, 96);

  useEffect(() => {
    let raf;
    const tick = () => {
      setShown((s) => {
        const next = s + (target - s) * 0.14;
        return Math.abs(target - next) < 0.2 ? target : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  // Fade out once the particle system is built and the bar has filled.
  // The timer is deliberately not cleared on re-render: it must fire once.
  useEffect(() => {
    if (ready && shown >= 99.5 && !doneRef.current) {
      doneRef.current = true;
      setLeaving(true);
      setTimeout(() => onDoneRef.current?.(), 700);
    }
  }, [ready, shown]);

  const label = ready ? "Ready" : snap.label;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed", inset: 0, background: "#050510", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", zIndex: 9999,
        opacity: leaving ? 0 : 1, transition: "opacity 0.7s ease", pointerEvents: leaving ? "none" : "auto",
      }}
    >
      <div style={{ fontSize: 44, fontWeight: 900, background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "2rem" }}>OH.</div>
      <div style={{ width: 180, height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 1, overflow: "hidden", marginBottom: "1rem" }}>
        <div style={{ height: "100%", width: `${shown}%`, background: "linear-gradient(90deg, #00f5ff, #b855ff)" }} />
      </div>
      <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}>{label}… {Math.round(shown)}%</span>
    </div>
  );
}

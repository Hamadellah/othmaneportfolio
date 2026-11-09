import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import ParticlePortrait from "./ParticlePortrait";
import CursorGlow from "./CursorGlow";
import { attachPointer, pointer } from "../../utils/pointer";
import { HEAD } from "../../utils/generatePoints";

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

/**
 * The head's stage. The canvas is exactly the size of its own box in the page
 * (right column on desktop, centred block on phones), so the head stays put:
 * the camera frames it to fit, and nothing else on the page is part of the scene.
 *
 * Only the *rotation* reacts to the pointer — a few degrees towards the cursor,
 * measured from the head's own centre — plus a slow idle sway so it never looks frozen.
 */
function Rig({ children }) {
  const head = useRef();
  const { camera, size } = useThree();

  useFrame((state, dt) => {
    const g = head.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const aspect = size.width / size.height;
    const tanHalf = Math.tan((camera.fov * Math.PI) / 360);

    // Fit the head (plus a margin for the rotation) into the stage.
    const wantH = HEAD.height * 1.26;
    const wantW = 1.28;
    const dist = Math.max(wantH / (2 * tanHalf), wantW / (2 * tanHalf * aspect));
    camera.position.z += (dist - camera.position.z) * (1 - Math.exp(-dt * 6));

    const a = pointer.active;
    const ryT = clamp(pointer.sx * 0.3, -0.42, 0.42) * a + Math.sin(t * 0.42) * 0.045 * (1 - 0.7 * a);
    const rxT = clamp(-pointer.sy * 0.13, -0.2, 0.2) * a + Math.sin(t * 0.31 + 1.3) * 0.02;
    const k = 1 - Math.exp(-dt * 4);
    g.rotation.y += (ryT - g.rotation.y) * k;
    g.rotation.x += (rxT - g.rotation.x) * k;
  });

  // Fixed vertical offset: the head's visual centre sits at the centre of the stage.
  return (
    <group position={[0, -HEAD.centerY, 0]}>
      <group ref={head}>{children}</group>
    </group>
  );
}

export default function Scene({ count, play, active, reducedMotion, onReady }) {
  const wrapRef = useRef(null);
  const [dprMax, setDprMax] = useState(() => (window.innerWidth < 768 ? 1.5 : 2));

  useEffect(() => attachPointer(() => wrapRef.current?.getBoundingClientRect()), []);

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, dprMax]}
        camera={{ fov: 30, position: [0, 0, 3.4], near: 0.1, far: 40 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <PerformanceMonitor onDecline={() => setDprMax(1)} />
        <CursorGlow />
        <Suspense fallback={null}>
          <Rig>
            <ParticlePortrait count={count} play={play} reducedMotion={reducedMotion} onReady={onReady} />
          </Rig>
        </Suspense>
      </Canvas>
    </div>
  );
}

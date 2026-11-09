import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import vertexShader from "../../shaders/vertexShader.glsl?raw";
import fragmentShader from "../../shaders/fragmentShader.glsl?raw";
import { generatePoints, HEAD } from "../../utils/generatePoints";
import { pointer, updatePointer } from "../../utils/pointer";
import { loadProgress } from "../../utils/loadProgress";

const MODEL_URL = "/models/my-portrait.glb";
const FRONT_URL = "/textures/front-tone.jpg";
const SIDE_URL = "/textures/side-tone.jpg";
const INTRO_SECONDS = 3.6;

// Real download progress: GLB bytes fill 18 -> 84 %, the item count of three's
// LoadingManager (GLB + 2 tone maps) tops it up to 96 %.
const onGlbProgress = (e) => {
  if (e.total) loadProgress.set(18 + (e.loaded / e.total) * 66, "Loading 3D portrait");
};
THREE.DefaultLoadingManager.onProgress = (_url, done, total) =>
  loadProgress.set(18 + (done / Math.max(total, 1)) * 78, "Loading 3D portrait");

// Start fetching as soon as this chunk is evaluated (before React renders it).
useLoader.preload(GLTFLoader, MODEL_URL, undefined, onGlbProgress);
useLoader.preload(THREE.ImageLoader, FRONT_URL);
useLoader.preload(THREE.ImageLoader, SIDE_URL);

/**
 * The portrait: ~66k points sampled on the reconstructed head surface and drawn
 * with a custom ShaderMaterial. Everything that changes per frame is a uniform
 * mutated inside useFrame — React never re-renders for animation.
 */
export default function ParticlePortrait({ count, play, reducedMotion, onReady }) {
  const gltf = useLoader(GLTFLoader, MODEL_URL, undefined, onGlbProgress);
  const frontImg = useLoader(THREE.ImageLoader, FRONT_URL);
  const sideImg = useLoader(THREE.ImageLoader, SIDE_URL);
  const { size, gl } = useThree();
  const startRef = useRef(null);

  const geometry = useMemo(() => {
    let source = null;
    gltf.scene.traverse((o) => {
      if (!source && o.isMesh) source = o.geometry;
    });
    if (!source) throw new Error("my-portrait.glb contains no mesh");
    return generatePoints({ geometry: source, frontImg, sideImg, count });
  }, [gltf, frontImg, sideImg, count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uViewH: { value: 800 },
          uAspect: { value: 1 },
          uSize: { value: 0.0046 },
          uMouse: { value: new THREE.Vector2(10, 10) },
          uMouseActive: { value: 0 },
          uRadius: { value: 0.3 },
          uStrength: { value: 0.16 },
          uMotion: { value: 1 },
          uOpacity: { value: 0.5 },
          // neck dissolves between the bottom of the cut and a little under the chin
          uNeckFade: { value: new THREE.Vector2(HEAD.bottom + 0.005, HEAD.chinY + 0.02) },
          uColorLow: { value: new THREE.Color("#6f7dff") },
          uColorHigh: { value: new THREE.Color("#dff8ff") },
          uRimColor: { value: new THREE.Color("#b855ff") },
          uLightColor: { value: new THREE.Color("#00f5ff") },
        },
      }),
    []
  );

  useEffect(() => {
    onReady?.();
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material, onReady]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    updatePointer(t, Math.min(dt, 0.05));

    if (play && startRef.current === null) startRef.current = t + 0.25;
    let progress = 0;
    if (startRef.current !== null) {
      progress = reducedMotion ? 1 : Math.min(Math.max((t - startRef.current) / INTRO_SECONDS, 0), 1);
    }

    const small = window.innerWidth < 768;
    const u = material.uniforms;
    u.uTime.value = t;
    u.uProgress.value = progress;
    u.uViewH.value = size.height * gl.getPixelRatio();
    u.uAspect.value = size.width / size.height;
    u.uMouse.value.set(pointer.sx, pointer.sy);
    u.uMouseActive.value = reducedMotion ? 0 : pointer.inside;
    u.uMotion.value = reducedMotion ? 0.25 : 1;
    u.uRadius.value = small ? 0.2 : 0.26;       // cursor reach, as a fraction of the stage height
    u.uStrength.value = small ? 0.07 : 0.1;     // push distance in view units
    // the head fills the stage, so points are sized relative to it; slightly larger on phones
    u.uSize.value = (small ? 0.0052 : 0.0042) * (66000 / count) ** 0.35;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

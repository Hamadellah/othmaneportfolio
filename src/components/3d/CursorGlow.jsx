import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { pointer } from "../../utils/pointer";

const vertex = /* glsl */ `
  varying vec2 vNdc;
  void main() {
    vNdc = position.xy;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform float uActive;
  uniform float uTime;
  varying vec2 vNdc;
  void main() {
    vec2 d = (vNdc - uMouse) * vec2(uAspect, 1.0);
    float r2 = dot(d, d);
    float halo = exp(-r2 * 7.0);          // wide, soft
    float core = exp(-r2 * 46.0);         // tight bright centre
    vec3 cyan = vec3(0.0, 0.96, 1.0);
    vec3 violet = vec3(0.72, 0.33, 1.0);
    vec3 col = mix(violet, cyan, smoothstep(0.0, 0.5, halo + core)) ;
    float g = (halo * 0.16 + core * 0.22) * uActive * (0.94 + 0.06 * sin(uTime * 2.0));
    gl_FragColor = vec4(col * g, g);
  }
`;

/** Additive quad covering the head's stage only; draws a soft glow under the cursor. */
export default function CursorGlow() {
  const size = useThree((s) => s.size);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uMouse: { value: new THREE.Vector2(10, 10) },
          uAspect: { value: size.width / size.height },
          uActive: { value: 0 },
          uTime: { value: 0 },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state) => {
    const u = material.uniforms;
    u.uMouse.value.set(pointer.sx, pointer.sy);
    u.uAspect.value = state.size.width / state.size.height;
    u.uActive.value = pointer.inside;
    u.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

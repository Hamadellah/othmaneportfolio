// Particle portrait — vertex shader
// Handles: cinematic assemble, breathing / floating, cursor push + attraction,
// size attenuation, facing-based depth shading.

uniform float uTime;
uniform float uProgress;     // 0 = scattered cloud, 1 = assembled portrait
uniform float uViewH;        // drawing-buffer height in px
uniform float uAspect;       // width / height
uniform float uSize;         // base particle size in world units
uniform vec2  uMouse;        // cursor in NDC (-1..1)
uniform float uMouseActive;  // 0..1
uniform float uRadius;       // cursor influence radius (NDC height units)
uniform float uStrength;     // cursor push strength (view-space units)
uniform float uMotion;       // 1 = full idle motion, lower for reduced motion
uniform vec2  uNeckFade;     // y where the neck is fully dissolved .. fully visible

attribute vec3 aNormal;
attribute vec3 aScatter;
attribute vec4 aRandom;      // x stagger, y size, z phase, w cursor response
attribute float aTone;

varying float vTone;
varying float vAlpha;
varying float vLight;
varying float vRim;
varying float vSpark;

const float PI = 3.14159265359;

void main() {
  // ---- assemble ---------------------------------------------------------
  float t = clamp(uProgress * 1.75 - aRandom.x * 0.75, 0.0, 1.0);
  float e = 1.0 - pow(1.0 - t, 3.0);                    // ease-out cubic

  // ---- idle life: breathing + floating (never static) --------------------
  float phase = aRandom.z * 6.2831853;
  vec3 rest = position;
  float breath = sin(uTime * 0.85) * 0.5 + 0.5;
  rest += aNormal * (sin(uTime * 0.7 + phase) * 0.0035 + breath * 0.003) * uMotion;
  rest.y += sin(uTime * 0.55 + rest.x * 1.7 + phase) * 0.0025 * uMotion;
  rest.x += cos(uTime * 0.5 + rest.y * 1.9 + phase) * 0.002 * uMotion;
  rest.y *= 1.0 + 0.004 * breath * uMotion;             // chest rises slightly

  vec3 p = mix(aScatter, rest, e);
  // spiral perturbation while travelling
  float travel = (1.0 - e) * sin(e * PI) * 2.0;
  p += vec3(cos(phase * 3.0), sin(phase * 2.0), cos(phase)) * travel * 0.35;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);

  // ---- cursor: push inside, soft attraction in a wider ring --------------
  vec4 clip0 = projectionMatrix * mv;
  vec2 ndc = clip0.xy / clip0.w;
  vec2 d = (ndc - uMouse) * vec2(uAspect, 1.0);
  float dist = length(d);
  vec2 dir = d / max(dist, 1e-4);
  vec2 tang = vec2(-dir.y, dir.x);

  float inner = smoothstep(uRadius, 0.0, dist);
  float outer = smoothstep(uRadius * 2.4, uRadius * 0.9, dist) * (1.0 - inner);
  float wob = sin(uTime * 1.6 + phase * 5.0);
  float resp = 0.55 + aRandom.w * 0.9;
  float settled = smoothstep(0.55, 1.0, uProgress) * uMouseActive;

  vec2 push = dir * inner * 1.0 + tang * wob * inner * 0.35;
  vec2 pull = -dir * outer * 0.18;
  mv.xy += (push + pull) * uStrength * resp * settled;
  mv.z  += inner * uStrength * 1.4 * aRandom.y * settled;     // pop towards the camera

  gl_Position = projectionMatrix * mv;

  // ---- shading ------------------------------------------------------------
  vec3 nv = normalize(normalMatrix * aNormal);
  vec3 viewDir = normalize(-mv.xyz);
  float facing = dot(nv, viewDir);                              // 1 = faces the camera
  float front = smoothstep(-0.25, 0.65, facing);

  vTone = pow(clamp(aTone, 0.0, 1.0), 1.4);
  vLight = (inner * inner * 1.2 + outer * 0.25) * settled;      // cursor behaves like a light
  vRim = pow(1.0 - clamp(facing, 0.0, 1.0), 2.5);

  // dissolve the neck into the page (head-only portrait)
  float fade = smoothstep(uNeckFade.x, uNeckFade.y, p.y);
  float arrive = smoothstep(0.0, 0.35, t);
  vAlpha = mix(0.14, 1.0, front) * fade * arrive;

  float twinkle = step(0.965, fract(aRandom.y * 91.7 + uTime * 0.12 + aRandom.x));
  vSpark = twinkle * 0.8;

  // ---- size ----------------------------------------------------------------
  float size = uSize * (0.75 + aRandom.y * 0.6) * (0.85 + aTone * 0.5);
  size *= 1.0 + vLight * 0.9 + twinkle * 0.8;
  size *= 1.0 + (1.0 - e) * 0.6;                                // bigger while scattered
  gl_PointSize = max(size * uViewH * 0.5 * projectionMatrix[1][1] / -mv.z, 1.0);
}

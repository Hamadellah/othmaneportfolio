// Particle portrait — fragment shader
// Soft round particle, clay tone from the reference photos, cyan/violet accents
// from the portfolio palette, cursor "light" boost.

precision highp float;

uniform vec3 uColorLow;    // shadow tint
uniform vec3 uColorHigh;   // highlight tint
uniform vec3 uRimColor;
uniform vec3 uLightColor;
uniform float uOpacity;

varying float vTone;
varying float vAlpha;
varying float vLight;
varying float vRim;
varying float vSpark;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;

  float core = smoothstep(0.5, 0.0, d);
  float disc = smoothstep(0.5, 0.28, d);
  float shape = mix(core * core, disc, 0.55);

  vec3 col = mix(uColorLow, uColorHigh, vTone);
  col *= 0.45 + vTone * 1.25;
  col += uRimColor * vRim * 0.55;
  col += uLightColor * vLight * 1.1;
  col += vec3(vSpark);

  float a = shape * vAlpha * uOpacity * (0.1 + vTone * 1.25 + vLight);
  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
}

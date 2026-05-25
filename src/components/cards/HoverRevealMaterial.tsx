'use client';

import { ScreenQuad } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface HoverRevealMaterialProps {
    isHovered: boolean;
    colorA: string;
    colorB: string;
    speed: number;
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uHover;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;

  // 2D simplex noise (Ashima Arts, MIT license).
  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
    );
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(
      dot(x0, x0),
      dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)
    ), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime;

    // Reveal state: warped two-color gradient with brightness lift.
    vec2 warpedUv = uv;
    warpedUv.x += snoise(uv * 3.0 + vec2(t * 0.4, 0.0)) * 0.2;
    warpedUv.y += snoise(uv * 3.0 + vec2(0.0, t * 0.3)) * 0.2;
    vec3 reveal = mix(uColorA, uColorB, smoothstep(0.0, 1.0, warpedUv.x));
    reveal = mix(reveal, vec3(1.0), 0.08);

    // Cover state: darker, more muted version of the same palette.
    vec3 cover = mix(uColorA * 0.18, uColorB * 0.18, smoothstep(0.0, 1.0, uv.y));

    // Slowly drifting noise that determines the reveal pattern.
    float maskNoise = snoise(uv * 2.0 + vec2(t * 0.1, t * 0.05)) * 0.5 + 0.5;

    // Remap hover [0, 1] to [-0.25, 1.25] so the edges are fully covered/revealed.
    float effectiveHover = mix(-0.25, 1.25, uHover);
    float mask = smoothstep(maskNoise - 0.08, maskNoise + 0.08, effectiveHover);

    vec3 col = mix(cover, reveal, mask);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function HoverRevealMaterial({
    isHovered,
    colorA,
    colorB,
    speed,
}: HoverRevealMaterialProps) {
    const matRef = useRef<THREE.ShaderMaterial>(null);
    const hoverCurrent = useRef(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uHover: { value: 0 },
            uColorA: { value: new THREE.Color(colorA) },
            uColorB: { value: new THREE.Color(colorB) },
        }),
        []
    );

    useEffect(() => {
        uniforms.uColorA.value.set(colorA);
    }, [colorA, uniforms]);
    useEffect(() => {
        uniforms.uColorB.value.set(colorB);
    }, [colorB, uniforms]);

    useFrame((_state, delta) => {
        uniforms.uTime.value += delta * speed;
        // Lerp current hover toward target (1 when hovered, 0 otherwise)
        // so the reveal eases in/out instead of snapping.
        const target = isHovered ? 1 : 0;
        hoverCurrent.current += (target - hoverCurrent.current) * 0.08;
        uniforms.uHover.value = hoverCurrent.current;
    });

    return (
        <ScreenQuad>
            <shaderMaterial
                ref={matRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </ScreenQuad>
    );
}

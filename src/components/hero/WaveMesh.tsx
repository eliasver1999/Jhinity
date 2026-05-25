'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface WaveMeshProps {
    colorA?: string;
    colorB?: string;
    amplitude?: number;
    frequency?: number;
    speed?: number;
}

const DEFAULT_COLOR_A = '#7F77DD';
const DEFAULT_COLOR_B = '#1D9E75';
const DEFAULT_AMPLITUDE = 1.2;
const DEFAULT_FREQUENCY = 0.4;
const DEFAULT_SPEED = 1.0;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  varying float vElevation;

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
    vec3 pos = position;
    // Two layered noise fields. Time multipliers cranked so peaks travel
    // visibly across the surface even at low speed values.
    float n1 = snoise(vec2(
      pos.x * uFrequency + uTime * 3.0,
      pos.y * uFrequency + uTime * 2.4
    ));
    float n2 = snoise(vec2(
      pos.x * uFrequency * 2.1 + uTime * 4.5,
      pos.y * uFrequency * 2.1 - uTime * 3.6
    )) * 0.4;
    float elevation = (n1 + n2);
    pos.z += elevation * uAmplitude;
    vElevation = elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vElevation;

  void main() {
    float t = clamp(vElevation * 0.5 + 0.5, 0.0, 1.0);
    vec3 col = mix(uColorB, uColorA, t);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function WaveMesh({
    colorA = DEFAULT_COLOR_A,
    colorB = DEFAULT_COLOR_B,
    amplitude = DEFAULT_AMPLITUDE,
    frequency = DEFAULT_FREQUENCY,
    speed = DEFAULT_SPEED,
}: WaveMeshProps) {
    const matRef = useRef<THREE.ShaderMaterial>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color(colorA) },
            uColorB: { value: new THREE.Color(colorB) },
            uAmplitude: { value: amplitude },
            uFrequency: { value: frequency },
        }),
        []
    );

    useEffect(() => {
        uniforms.uColorA.value.set(colorA);
    }, [colorA, uniforms]);
    useEffect(() => {
        uniforms.uColorB.value.set(colorB);
    }, [colorB, uniforms]);
    useEffect(() => {
        uniforms.uAmplitude.value = amplitude;
    }, [amplitude, uniforms]);
    useEffect(() => {
        uniforms.uFrequency.value = frequency;
    }, [frequency, uniforms]);

    useFrame((state) => {
        // Absolute time instead of accumulated delta: more robust across
        // HMR reloads (no drift) and easier to reason about.
        uniforms.uTime.value = state.clock.elapsedTime * speed;
    });

    return (
        <mesh rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -0.5, 0]}>
            <planeGeometry args={[14, 14, 80, 80]} />
            <shaderMaterial
                ref={matRef}
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                wireframe
                transparent
            />
        </mesh>
    );
}

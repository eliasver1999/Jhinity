'use client';

import { ScreenQuad } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface ShaderGradientProps {
    colorA?: string;
    colorB?: string;
    colorC?: string;
    colorD?: string;
    speed?: number;
    scale?: number;
    mouseIntensity?: number;
}

const DEFAULT_COLOR_A = '#7F77DD';
const DEFAULT_COLOR_B = '#EC4899';
const DEFAULT_COLOR_C = '#06B6D4';
const DEFAULT_COLOR_D = '#F59E0B';
const DEFAULT_SPEED = 0.4;
const DEFAULT_SCALE = 1.5;
const DEFAULT_MOUSE_INTENSITY = 0.6;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    // drei's ScreenQuad geometry only exposes position (in NDC [-1, 1]),
    // no uv attribute. Derive UV from position instead.
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec3 uColorD;
  uniform float uSpeed;
  uniform float uScale;
  uniform vec2 uMouse;
  uniform float uMouseIntensity;
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
    float t = uTime * uSpeed;

    // Warp UVs with two orthogonal slow-moving noise fields.
    vec2 warped = uv;
    warped.x += snoise(uv * uScale + vec2(t * 0.7, 0.0)) * 0.35;
    warped.y += snoise(uv * uScale + vec2(0.0, t * 0.5)) * 0.35;

    // Bilinear blend across the four corner colors using the warped UVs.
    float fx = smoothstep(0.0, 1.0, warped.x);
    float fy = smoothstep(0.0, 1.0, warped.y);
    vec3 top = mix(uColorA, uColorB, fx);
    vec3 bot = mix(uColorD, uColorC, fx);
    vec3 col = mix(bot, top, fy);

    // Soft vignette so edges sit a touch darker than the center.
    float d = distance(uv, vec2(0.5));
    col *= 1.0 - d * 0.22;

    // Spotlight: brighten and tint slightly toward white near the cursor.
    float mDist = distance(uv, uMouse);
    float spot = exp(-mDist * mDist * 8.0) * uMouseIntensity;
    col = mix(col, col * 1.3 + vec3(0.05), clamp(spot, 0.0, 1.0));

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function ShaderGradient({
    colorA = DEFAULT_COLOR_A,
    colorB = DEFAULT_COLOR_B,
    colorC = DEFAULT_COLOR_C,
    colorD = DEFAULT_COLOR_D,
    speed = DEFAULT_SPEED,
    scale = DEFAULT_SCALE,
    mouseIntensity = DEFAULT_MOUSE_INTENSITY,
}: ShaderGradientProps) {
    const matRef = useRef<THREE.ShaderMaterial>(null);
    // Mouse target (where the cursor is) and current (the smoothed value
    // we actually feed the shader). Start off-screen so nothing lights up
    // until the user moves.
    const mouseTarget = useRef(new THREE.Vector2(-1, -1));
    const mouseCurrent = useRef(new THREE.Vector2(-1, -1));
    const gl = useThree((state) => state.gl);

    // Track the cursor in canvas-local UV space. Listening on window means
    // the spotlight still follows even when the cursor is over content that
    // overlays the canvas.
    useEffect(() => {
        const canvas = gl.domElement;
        function onMove(e: PointerEvent) {
            const rect = canvas.getBoundingClientRect();
            const u = (e.clientX - rect.left) / rect.width;
            const v = 1.0 - (e.clientY - rect.top) / rect.height;
            mouseTarget.current.set(u, v);
        }
        function onLeave() {
            mouseTarget.current.set(-1, -1);
        }
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerleave', onLeave);
        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerleave', onLeave);
        };
    }, [gl]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color(colorA) },
            uColorB: { value: new THREE.Color(colorB) },
            uColorC: { value: new THREE.Color(colorC) },
            uColorD: { value: new THREE.Color(colorD) },
            uSpeed: { value: speed },
            uScale: { value: scale },
            uMouse: { value: new THREE.Vector2(-1, -1) },
            uMouseIntensity: { value: mouseIntensity },
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
        uniforms.uColorC.value.set(colorC);
    }, [colorC, uniforms]);
    useEffect(() => {
        uniforms.uColorD.value.set(colorD);
    }, [colorD, uniforms]);
    useEffect(() => {
        uniforms.uSpeed.value = speed;
    }, [speed, uniforms]);
    useEffect(() => {
        uniforms.uScale.value = scale;
    }, [scale, uniforms]);
    useEffect(() => {
        uniforms.uMouseIntensity.value = mouseIntensity;
    }, [mouseIntensity, uniforms]);

    useFrame((_state, delta) => {
        uniforms.uTime.value += delta;

        // Lerp the current cursor toward the target so the spotlight glides.
        const lerp = 0.12;
        mouseCurrent.current.x +=
            (mouseTarget.current.x - mouseCurrent.current.x) * lerp;
        mouseCurrent.current.y +=
            (mouseTarget.current.y - mouseCurrent.current.y) * lerp;
        uniforms.uMouse.value.copy(mouseCurrent.current);
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

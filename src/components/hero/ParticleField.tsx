'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface ParticleFieldProps {
    count: number;
    reducedMotion: boolean;
    interactive: boolean;
}

export default function ParticleField({
    count,
    reducedMotion,
    interactive,
}: ParticleFieldProps) {
    const pointsRef = useRef<THREE.Points>(null);
    // Start the cursor off-screen so nothing warps until the user actually moves.
    const mouseWorld = useRef(new THREE.Vector3(999, 999, 0));
    const mouseLocal = useRef(new THREE.Vector3());
    const invMatrix = useRef(new THREE.Matrix4());
    const { viewport } = useThree();

    // Track the cursor on window — the Canvas is behind a higher-z overlay,
    // so pointer events never reach R3F's built-in state.mouse.
    useEffect(() => {
        if (!interactive || reducedMotion) return;

        function onMove(e: PointerEvent) {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = -((e.clientY / window.innerHeight) * 2 - 1);
            mouseWorld.current.set(
                (nx * viewport.width) / 2,
                (ny * viewport.height) / 2,
                0
            );
        }
        function onLeave() {
            mouseWorld.current.set(999, 999, 0);
        }

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerleave', onLeave);
        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerleave', onLeave);
        };
    }, [interactive, reducedMotion, viewport.width, viewport.height]);

    const { positions, colors, originalPositions } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const originalPositions = new Float32Array(count * 3);

        const colorA = new THREE.Color('#7F77DD'); // purple
        const colorB = new THREE.Color('#1D9E75'); // teal

        for (let i = 0; i < count; i++) {
            const radius = 2 + Math.random() * 1.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            originalPositions[i * 3] = x;
            originalPositions[i * 3 + 1] = y;
            originalPositions[i * 3 + 2] = z;

            const mixed = colorA.clone().lerp(colorB, (y + 3) / 6);
            colors[i * 3] = mixed.r;
            colors[i * 3 + 1] = mixed.g;
            colors[i * 3 + 2] = mixed.b;
        }

        return { positions, colors, originalPositions };
    }, [count]);

    useFrame((_state, delta) => {
        if (!pointsRef.current) return;

        if (!reducedMotion) {
            pointsRef.current.rotation.y += delta * 0.05;
            pointsRef.current.rotation.x += delta * 0.02;
            // Refresh matrixWorld immediately so the mouse transform below
            // uses the current frame's rotation, not last frame's.
            pointsRef.current.updateMatrixWorld();
        }

        if (!interactive || reducedMotion) return;

        // World mouse → local frame of the rotating Points object.
        invMatrix.current.copy(pointsRef.current.matrixWorld).invert();
        mouseLocal.current
            .copy(mouseWorld.current)
            .applyMatrix4(invMatrix.current);

        const geom = pointsRef.current.geometry;
        const posAttr = geom.attributes.position as THREE.BufferAttribute;
        const positions = posAttr.array as Float32Array;

        const mx = mouseLocal.current.x;
        const my = mouseLocal.current.y;
        const radius = 1.5;
        const radiusSq = radius * radius;
        const maxPush = 0.9;

        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const ox = originalPositions[ix];
            const oy = originalPositions[ix + 1];
            const oz = originalPositions[ix + 2];

            const dx = ox - mx;
            const dy = oy - my;
            const distSq = dx * dx + dy * dy;

            if (distSq > radiusSq) {
                // Outside influence — snap to rest position.
                positions[ix] = ox;
                positions[ix + 1] = oy;
                positions[ix + 2] = oz;
                continue;
            }

            const dist = Math.sqrt(distSq);
            const falloff = 1 - dist / radius;
            const strength = falloff * falloff * maxPush;

            positions[ix] = ox + (dx / (dist + 0.0001)) * strength;
            positions[ix + 1] = oy + (dy / (dist + 0.0001)) * strength;
            positions[ix + 2] = oz;
        }

        posAttr.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={colors}
                    itemSize={3}
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.025}
                vertexColors
                transparent
                opacity={0.9}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

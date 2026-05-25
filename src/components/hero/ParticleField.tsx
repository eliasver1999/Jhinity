'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
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
    const mouseRef = useRef(new THREE.Vector3(0, 0, 0));
    const { viewport } = useThree();

    // Generate positions + colors once
    const { positions, colors, originalPositions } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const originalPositions = new Float32Array(count * 3);

        const colorA = new THREE.Color('#7F77DD'); // purple
        const colorB = new THREE.Color('#1D9E75'); // teal

        for (let i = 0; i < count; i++) {
            // Spherical distribution with slight inner bias
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

            // Color based on y position
            const mixed = colorA.clone().lerp(colorB, (y + 3) / 6);
            colors[i * 3] = mixed.r;
            colors[i * 3 + 1] = mixed.g;
            colors[i * 3 + 2] = mixed.b;
        }

        return { positions, colors, originalPositions };
    }, [count]);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        // Slow auto-rotation (skip if reduced motion)
        if (!reducedMotion) {
            pointsRef.current.rotation.y += delta * 0.05;
            pointsRef.current.rotation.x += delta * 0.02;
        }

        if (!interactive || reducedMotion) return;

        // Map mouse to world space
        const x = (state.mouse.x * viewport.width) / 2;
        const y = (state.mouse.y * viewport.height) / 2;
        mouseRef.current.set(x, y, 0);

        // Warp particles near mouse
        const geom = pointsRef.current.geometry;
        const posAttr = geom.attributes.position as THREE.BufferAttribute;
        const positions = posAttr.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const ox = originalPositions[ix];
            const oy = originalPositions[ix + 1];
            const oz = originalPositions[ix + 2];

            // Counter-rotate mouse into local space (cheap approximation)
            const dx = ox - mouseRef.current.x;
            const dy = oy - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Soft repulsion within radius 1.2
            const radius = 1.2;
            const strength = Math.max(0, 1 - dist / radius) * 0.4;

            positions[ix] = ox + (dx / (dist + 0.001)) * strength;
            positions[ix + 1] = oy + (dy / (dist + 0.001)) * strength;
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
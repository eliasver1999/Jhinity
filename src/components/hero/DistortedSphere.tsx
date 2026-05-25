'use client';

import { MeshDistortMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface DistortedSphereProps {
    color?: string;
    distort?: number;
    speed?: number;
}

const DEFAULT_COLOR = '#7F77DD';
const DEFAULT_DISTORT = 0.4;
const DEFAULT_SPEED = 1;

export default function DistortedSphere({
    color = DEFAULT_COLOR,
    distort = DEFAULT_DISTORT,
    speed = DEFAULT_SPEED,
}: DistortedSphereProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_state, delta) => {
        if (!meshRef.current) return;
        // Slow auto-rotation so the noise distortion is visible from
        // changing angles even if the user isn't moving.
        meshRef.current.rotation.y += delta * 0.15 * speed;
        meshRef.current.rotation.x += delta * 0.08 * speed;
    });

    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <pointLight
                position={[-3, -2, 2]}
                intensity={0.6}
                color="#7F77DD"
            />
            <pointLight
                position={[3, -2, -2]}
                intensity={0.4}
                color="#EC4899"
            />
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1.5, 4]} />
                <MeshDistortMaterial
                    color={color}
                    distort={distort}
                    speed={speed * 2}
                    metalness={0.3}
                    roughness={0.25}
                />
            </mesh>
        </>
    );
}

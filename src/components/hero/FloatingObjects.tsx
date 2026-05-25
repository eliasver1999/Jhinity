'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';

type Shape =
    | 'sphere'
    | 'torusKnot'
    | 'octahedron'
    | 'dodecahedron'
    | 'icosahedron'
    | 'capsule';

type MaterialKind = 'colorA' | 'colorB' | 'glass';

interface ObjectSpec {
    shape: Shape;
    position: [number, number, number];
    scale: number;
    material: MaterialKind;
    bobOffset: number;
    bobAmp: number;
    rotSpeed: [number, number];
}

// Curated layout: objects pushed toward the edges with depth variation,
// leaving a clear center for hero text/CTA to sit on top.
const LAYOUT: ObjectSpec[] = [
    {
        shape: 'sphere',
        position: [-2.5, 1.3, -0.5],
        scale: 0.7,
        material: 'glass',
        bobOffset: 0.0,
        bobAmp: 0.25,
        rotSpeed: [0.2, 0.15],
    },
    {
        shape: 'torusKnot',
        position: [2.4, 1.1, 0.8],
        scale: 0.5,
        material: 'colorA',
        bobOffset: 1.2,
        bobAmp: 0.3,
        rotSpeed: [0.3, 0.5],
    },
    {
        shape: 'octahedron',
        position: [-2.2, -1.3, 1.2],
        scale: 0.7,
        material: 'colorB',
        bobOffset: 2.5,
        bobAmp: 0.2,
        rotSpeed: [0.3, 0.2],
    },
    {
        shape: 'dodecahedron',
        position: [2.0, -1.4, -1.5],
        scale: 0.65,
        material: 'glass',
        bobOffset: 0.7,
        bobAmp: 0.35,
        rotSpeed: [0.15, 0.25],
    },
    {
        shape: 'icosahedron',
        position: [-3.0, 0.0, 0],
        scale: 0.45,
        material: 'colorA',
        bobOffset: 3.0,
        bobAmp: 0.28,
        rotSpeed: [0.25, 0.3],
    },
    {
        shape: 'capsule',
        position: [2.8, -0.2, -1],
        scale: 0.5,
        material: 'colorB',
        bobOffset: 1.8,
        bobAmp: 0.22,
        rotSpeed: [0.2, 0.4],
    },
];

interface FloatingObjectsProps {
    colorA?: string;
    colorB?: string;
    parallaxStrength?: number;
    speed?: number;
}

const DEFAULT_COLOR_A = '#7F77DD';
const DEFAULT_COLOR_B = '#EC4899';
const DEFAULT_PARALLAX = 0.5;
const DEFAULT_SPEED = 1;

export default function FloatingObjects({
    colorA = DEFAULT_COLOR_A,
    colorB = DEFAULT_COLOR_B,
    parallaxStrength = DEFAULT_PARALLAX,
    speed = DEFAULT_SPEED,
}: FloatingObjectsProps) {
    const mouseTarget = useRef(new THREE.Vector2(0, 0));
    const mouseCurrent = useRef(new THREE.Vector2(0, 0));
    const gl = useThree((state) => state.gl);

    useEffect(() => {
        const canvas = gl.domElement;
        function onMove(e: PointerEvent) {
            const rect = canvas.getBoundingClientRect();
            const u = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const v = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
            mouseTarget.current.set(u, v);
        }
        function onLeave() {
            mouseTarget.current.set(0, 0);
        }
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerleave', onLeave);
        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerleave', onLeave);
        };
    }, [gl]);

    useFrame(() => {
        const lerp = 0.06;
        mouseCurrent.current.x +=
            (mouseTarget.current.x - mouseCurrent.current.x) * lerp;
        mouseCurrent.current.y +=
            (mouseTarget.current.y - mouseCurrent.current.y) * lerp;
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <pointLight
                position={[-5, -3, 2]}
                intensity={0.6}
                color="#7F77DD"
            />
            {LAYOUT.map((spec, i) => (
                <FloatingShape
                    key={i}
                    spec={spec}
                    mouseRef={mouseCurrent}
                    colorA={colorA}
                    colorB={colorB}
                    parallaxStrength={parallaxStrength}
                    speed={speed}
                />
            ))}
        </>
    );
}

interface FloatingShapeProps {
    spec: ObjectSpec;
    mouseRef: MutableRefObject<THREE.Vector2>;
    colorA: string;
    colorB: string;
    parallaxStrength: number;
    speed: number;
}

function FloatingShape({
    spec,
    mouseRef,
    colorA,
    colorB,
    parallaxStrength,
    speed,
}: FloatingShapeProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.elapsedTime * speed;
        const [px, py, pz] = spec.position;

        const bobY = Math.sin(t + spec.bobOffset) * spec.bobAmp;

        // Parallax: counter-shift (objects move opposite to cursor),
        // weighted by depth so near objects shift more than far ones.
        // z range [-2, 1] maps to [0.3, 1.0] so far objects still parallax a bit.
        const zNorm = 0.3 + ((pz + 2) / 3) * 0.7;
        const parallaxX =
            -mouseRef.current.x * parallaxStrength * zNorm;
        const parallaxY =
            -mouseRef.current.y * parallaxStrength * zNorm;

        meshRef.current.position.set(
            px + parallaxX,
            py + bobY + parallaxY,
            pz
        );
        meshRef.current.rotation.x = t * spec.rotSpeed[0];
        meshRef.current.rotation.y = t * spec.rotSpeed[1];
    });

    return (
        <mesh ref={meshRef} scale={spec.scale}>
            {renderGeometry(spec.shape)}
            {renderMaterial(spec.material, colorA, colorB)}
        </mesh>
    );
}

function renderGeometry(shape: Shape) {
    switch (shape) {
        case 'sphere':
            return <sphereGeometry args={[1, 32, 32]} />;
        case 'torusKnot':
            return <torusKnotGeometry args={[0.6, 0.2, 64, 8]} />;
        case 'octahedron':
            return <octahedronGeometry args={[1, 0]} />;
        case 'dodecahedron':
            return <dodecahedronGeometry args={[1, 0]} />;
        case 'icosahedron':
            return <icosahedronGeometry args={[1, 0]} />;
        case 'capsule':
            return <capsuleGeometry args={[0.4, 1, 4, 16]} />;
    }
}

function renderMaterial(
    material: MaterialKind,
    colorA: string,
    colorB: string
) {
    if (material === 'colorA') {
        return (
            <meshStandardMaterial
                color={colorA}
                metalness={0.35}
                roughness={0.35}
            />
        );
    }
    if (material === 'colorB') {
        return (
            <meshStandardMaterial
                color={colorB}
                metalness={0.35}
                roughness={0.35}
            />
        );
    }
    return (
        <meshStandardMaterial
            color="#ffffff"
            metalness={0.2}
            roughness={0.15}
            transparent
            opacity={0.6}
        />
    );
}

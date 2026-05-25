'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import DistortedSphere from './DistortedSphere';

interface DistortedSphereCanvasProps {
    color?: string;
    distort?: number;
    speed?: number;
}

export default function DistortedSphereCanvas({
    speed,
    ...rest
}: DistortedSphereCanvasProps) {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mq.matches);
        const onChange = () => setReducedMotion(mq.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    const effectiveSpeed = reducedMotion ? 0 : speed;

    return (
        <div className="absolute inset-0 -z-0">
            <Canvas
                camera={{ position: [0, 0, 4], fov: 50 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    <DistortedSphere {...rest} speed={effectiveSpeed} />
                </Suspense>
            </Canvas>
        </div>
    );
}

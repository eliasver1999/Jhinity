'use client';

import ManagedCanvas from '@/components/shared/ManagedCanvas';
import { Suspense, useEffect, useState } from 'react';
import WaveMesh from './WaveMesh';

interface WaveMeshCanvasProps {
    colorA?: string;
    colorB?: string;
    amplitude?: number;
    frequency?: number;
    speed?: number;
}

export default function WaveMeshCanvas({
    speed,
    ...rest
}: WaveMeshCanvasProps) {
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
            <ManagedCanvas
                camera={{ position: [0, 2.5, 5], fov: 55 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    <WaveMesh {...rest} speed={effectiveSpeed} />
                </Suspense>
            </ManagedCanvas>
        </div>
    );
}

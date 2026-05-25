'use client';

import ManagedCanvas from '@/components/shared/ManagedCanvas';
import { Suspense, useEffect, useState } from 'react';
import FloatingObjects from './FloatingObjects';

interface FloatingObjectsCanvasProps {
    colorA?: string;
    colorB?: string;
    parallaxStrength?: number;
    speed?: number;
}

export default function FloatingObjectsCanvas({
    speed,
    ...rest
}: FloatingObjectsCanvasProps) {
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
                camera={{ position: [0, 0, 7], fov: 50 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    <FloatingObjects {...rest} speed={effectiveSpeed} />
                </Suspense>
            </ManagedCanvas>
        </div>
    );
}

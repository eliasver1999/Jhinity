'use client';

import ManagedCanvas from '@/components/shared/ManagedCanvas';
import { Suspense, useEffect, useState } from 'react';
import ShaderGradient from './ShaderGradient';

interface ShaderGradientCanvasProps {
    colorA?: string;
    colorB?: string;
    colorC?: string;
    colorD?: string;
    speed?: number;
    scale?: number;
    mouseIntensity?: number;
}

export default function ShaderGradientCanvas({
    speed,
    mouseIntensity,
    ...rest
}: ShaderGradientCanvasProps) {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mq.matches);
        const onChange = () => setReducedMotion(mq.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    // Honor reduced-motion: freeze the animation and disable the spotlight.
    const effectiveSpeed = reducedMotion ? 0 : speed;
    const effectiveMouseIntensity = reducedMotion ? 0 : mouseIntensity;

    return (
        <div className="absolute inset-0 -z-0">
            <ManagedCanvas
                dpr={[1, 1.5]}
                gl={{ antialias: false, alpha: false }}
            >
                <Suspense fallback={null}>
                    <ShaderGradient
                        {...rest}
                        speed={effectiveSpeed}
                        mouseIntensity={effectiveMouseIntensity}
                    />
                </Suspense>
            </ManagedCanvas>
        </div>
    );
}

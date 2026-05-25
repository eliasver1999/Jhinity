'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import ParticleField from './ParticleField';

export default function ParticleFieldCanvas() {
    const [reducedMotion, setReducedMotion] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const mobileMq = window.matchMedia('(max-width: 768px)');
        setReducedMotion(mq.matches);
        setIsMobile(mobileMq.matches);

        const onChange = () => setReducedMotion(mq.matches);
        const onMobileChange = () => setIsMobile(mobileMq.matches);
        mq.addEventListener('change', onChange);
        mobileMq.addEventListener('change', onMobileChange);
        return () => {
            mq.removeEventListener('change', onChange);
            mobileMq.removeEventListener('change', onMobileChange);
        };
    }, []);

    // Particle count scales with device
    const count = isMobile ? 1200 : 3000;

    return (
        <div className="absolute inset-0 -z-0">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    <ParticleField
                        count={count}
                        reducedMotion={reducedMotion}
                        interactive={!isMobile}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
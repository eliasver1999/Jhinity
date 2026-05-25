'use client';

import { Suspense, useEffect, useState, type ReactNode } from 'react';
import ManagedCanvas from '@/components/shared/ManagedCanvas';
import HoverRevealMaterial from './HoverRevealMaterial';

interface HoverRevealCardProps {
    children: ReactNode;
    colorA?: string;
    colorB?: string;
    speed?: number;
    className?: string;
}

export default function HoverRevealCard({
    children,
    colorA = '#7F77DD',
    colorB = '#EC4899',
    speed = 0.5,
    className = '',
}: HoverRevealCardProps) {
    const [isHovered, setIsHovered] = useState(false);
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
        <div
            onMouseEnter={() => !reducedMotion && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative overflow-hidden rounded-2xl border border-white/10 ${className}`}
        >
            <ManagedCanvas
                className="absolute inset-0"
                dpr={[1, 1.5]}
                gl={{ antialias: false, alpha: false }}
            >
                <Suspense fallback={null}>
                    <HoverRevealMaterial
                        isHovered={isHovered}
                        colorA={colorA}
                        colorB={colorB}
                        speed={effectiveSpeed}
                    />
                </Suspense>
            </ManagedCanvas>
            <div className="relative z-10">{children}</div>
        </div>
    );
}

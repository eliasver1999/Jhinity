'use client';

import ManagedCanvas from '@/components/shared/ManagedCanvas';
import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
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
    // Shared mutable target: outer hover events write to it, the R3F scene
    // reads from it in useFrame and lerps the actual uniform.
    const hoverRef = useRef(0);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mq.matches);
        const onChange = () => setReducedMotion(mq.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    const effectiveSpeed = reducedMotion ? 0 : speed;

    function onEnter() {
        if (!reducedMotion) hoverRef.current = 1;
    }
    function onLeave() {
        hoverRef.current = 0;
    }

    return (
        <div
            onPointerEnter={onEnter}
            onPointerLeave={onLeave}
            className={`relative overflow-hidden rounded-2xl border border-white/10 ${className}`}
        >
            <ManagedCanvas
                className="absolute inset-0"
                dpr={[1, 1.5]}
                gl={{ antialias: false, alpha: false }}
            >
                <Suspense fallback={null}>
                    <HoverRevealMaterial
                        hoverRef={hoverRef}
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

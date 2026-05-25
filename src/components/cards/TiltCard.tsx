'use client';

import {
    useEffect,
    useRef,
    useState,
    type PointerEvent,
    type ReactNode,
} from 'react';

interface TiltCardProps {
    children: ReactNode;
    /** Maximum rotation at the card edges, in degrees. */
    maxTilt?: number;
    /** CSS perspective in pixels. Higher = subtler tilt. */
    perspective?: number;
    /** Show a radial-gradient highlight following the cursor. */
    glare?: boolean;
    /** Glare opacity at the cursor, 0–1. */
    glareIntensity?: number;
    /** Scale on hover. 1 = no scale. */
    scale?: number;
}

export default function TiltCard({
    children,
    maxTilt = 12,
    perspective = 1000,
    glare = true,
    glareIntensity = 0.4,
    scale = 1.02,
}: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mq.matches);
        const onChange = () => setReducedMotion(mq.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    function onMove(e: PointerEvent<HTMLDivElement>) {
        if (reducedMotion || !cardRef.current || !innerRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width;
        const cy = (e.clientY - rect.top) / rect.height;

        const xPct = cx - 0.5;
        const yPct = cy - 0.5;

        // Tilt: top edge tips toward viewer when cursor is near the top.
        const rotX = -yPct * maxTilt * 2;
        const rotY = xPct * maxTilt * 2;

        innerRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${scale}, ${scale}, 1)`;
        innerRef.current.style.transition = 'transform 80ms ease-out';

        if (glareRef.current) {
            glareRef.current.style.background = `radial-gradient(circle at ${cx * 100}% ${cy * 100}%, rgba(255, 255, 255, ${glareIntensity}) 0%, transparent 60%)`;
            glareRef.current.style.opacity = '1';
        }
    }

    function onLeave() {
        if (!innerRef.current) return;
        innerRef.current.style.transform =
            'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        innerRef.current.style.transition = 'transform 500ms ease';
        if (glareRef.current) {
            glareRef.current.style.opacity = '0';
            glareRef.current.style.transition = 'opacity 500ms ease';
        }
    }

    return (
        <div
            ref={cardRef}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            style={{ perspective: `${perspective}px` }}
            className="inline-block"
        >
            <div
                ref={innerRef}
                style={{
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                }}
                className="relative"
            >
                {children}
                {glare && (
                    <div
                        ref={glareRef}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            opacity: 0,
                            mixBlendMode: 'soft-light',
                        }}
                    />
                )}
            </div>
        </div>
    );
}

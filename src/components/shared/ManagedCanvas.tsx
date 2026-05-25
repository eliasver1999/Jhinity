'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, type ComponentProps } from 'react';
import * as THREE from 'three';

type ManagedCanvasProps = ComponentProps<typeof Canvas>;

/**
 * Drop-in replacement for R3F's `<Canvas>` that explicitly disposes the
 * renderer and forces context loss on unmount. R3F's auto-disposal is not
 * always reliable across Next.js client-side navigation — being explicit
 * forces the browser to release the WebGL context slot immediately, which
 * matters because browsers cap WebGL contexts per page (~16 in Chrome).
 */
export default function ManagedCanvas({
    children,
    onCreated,
    ...rest
}: ManagedCanvasProps) {
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    useEffect(() => {
        return () => {
            const r = rendererRef.current;
            if (!r) return;
            try {
                r.dispose();
                r.forceContextLoss();
            } catch {
                // Disposal can throw on already-lost contexts. Ignore.
            }
        };
    }, []);

    return (
        <Canvas
            {...rest}
            onCreated={(state) => {
                rendererRef.current = state.gl;
                onCreated?.(state);
            }}
        >
            {children}
        </Canvas>
    );
}

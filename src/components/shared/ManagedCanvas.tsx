'use client';

import { Canvas } from '@react-three/fiber';
import { type ComponentProps } from 'react';

type ManagedCanvasProps = ComponentProps<typeof Canvas>;

/**
 * Drop-in passthrough around R3F's `<Canvas>`. Originally added explicit
 * dispose + forceContextLoss on unmount to fix WebGL context accumulation,
 * but that interacted badly with React 19 StrictMode in dev (the simulated
 * unmount fired forceContextLoss on a still-alive context). Reverted to a
 * passthrough until we land a StrictMode-safe disposal strategy.
 */
export default function ManagedCanvas(props: ManagedCanvasProps) {
    return <Canvas {...props} />;
}

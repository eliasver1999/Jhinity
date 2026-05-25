'use client';

import TiltCard from './TiltCard';

interface TiltCardDemoProps {
    maxTilt?: number;
    perspective?: number;
    glare?: boolean;
    glareIntensity?: number;
    scale?: number;
}

export default function TiltCardDemo(props: TiltCardDemoProps) {
    return (
        <TiltCard {...props}>
            <div className="relative w-[300px] overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#13131a] to-[#0e0e14] p-7 shadow-2xl shadow-black/40">
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#7F77DD]/20 ring-1 ring-[#7F77DD]/30">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#CECBF6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                    >
                        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                </div>
                <h3 className="mb-2 text-base font-medium tracking-tight text-white">
                    Realtime sync
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-white/55">
                    Edits propagate to every connected client in under 50ms.
                    No conflict resolution required.
                </p>
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#CECBF6]">
                    <span>Learn more</span>
                    <span aria-hidden>→</span>
                </div>
            </div>
        </TiltCard>
    );
}

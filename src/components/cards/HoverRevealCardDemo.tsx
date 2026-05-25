'use client';

import HoverRevealCard from './HoverRevealCard';

interface HoverRevealCardDemoProps {
    colorA?: string;
    colorB?: string;
    speed?: number;
}

export default function HoverRevealCardDemo(props: HoverRevealCardDemoProps) {
    return (
        <HoverRevealCard {...props} className="h-[260px] w-[320px]">
            <div className="flex h-full flex-col justify-between p-6">
                <div>
                    <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.08] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/80 backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#97C459]" />
                        Live
                    </div>
                    <h3 className="mb-1.5 text-lg font-medium tracking-tight text-white drop-shadow-sm">
                        Edge functions
                    </h3>
                    <p className="text-sm leading-relaxed text-white/75 drop-shadow-sm">
                        Sub-50ms response from any region. Deploy with one
                        command.
                    </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-white">
                    <span>View docs</span>
                    <span aria-hidden>→</span>
                </div>
            </div>
        </HoverRevealCard>
    );
}

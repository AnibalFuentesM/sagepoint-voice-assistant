import React, { useState } from 'react';

interface GlobeDashboardProps {
    texts: {
        title: string;
        updated: string;
        stockAlert: string;
        goalAlert: string;
    };
}

export default function GlobeDashboard({ texts }: GlobeDashboardProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative animate-[floatIn_0.9s_ease-out_0.15s_both] w-full aspect-square md:aspect-auto md:h-[650px] flex items-center justify-center pointer-events-none">

            {/* Title & Status */}
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center z-20 px-4 md:px-0">
                <h3 className="font-serif text-2xl md:text-3xl text-ink font-semibold opacity-90">{texts.title}</h3>
                <span className="text-deep-sage text-lg md:text-xl font-medium flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-deep-sage animate-pulse shadow-[0_0_12px_rgba(47,176,148,0.9)]"></span>
                    {texts.updated}
                </span>
            </div>

            {/* Globe Container */}
            <div className="w-full h-full relative flex items-center justify-center mt-16">

                {/* 3D Spline iframe */}
                <div
                    className="absolute inset-0 w-full h-full overflow-visible scale-[1.3] md:scale-[1.6] opacity-95"
                    style={{
                        mixBlendMode: 'screen',
                        maskImage: 'radial-gradient(circle closest-side, black 60%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(circle closest-side, black 60%, transparent 100%)'
                    }}
                >
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="w-8 h-8 border-2 border-sage border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    <iframe
                        src="https://my.spline.design/sphererotategreen-prGoxw5sJuthyXD9lWRuxNxH/"
                        frameBorder="0"
                        title="3D Globe Animation"
                        className="w-full h-full pointer-events-none"
                        onLoad={() => setIsLoading(false)}
                        style={{ filter: 'brightness(1.1) contrast(1.2)' }}
                    ></iframe>
                </div>

                {/* Tooltip 1 (Stock Alert) */}
                <div className="absolute bottom-[28%] left-[8%] md:left-[15%] bg-[#0f1a1c]/80 border border-slate-300/40 shadow-2xl backdrop-blur-md rounded-full px-4 py-2 text-sm flex items-center gap-3 z-30 animate-fade-in-up hover:scale-105 transition-transform pointer-events-auto">
                    <span className="w-2 h-2 rounded-full bg-copper shadow-[0_0_8px_rgba(235,97,52,0.8)]"></span>
                    <span className="text-slate-100 font-medium">{texts.stockAlert}</span>
                </div>

                {/* Tooltip 2 (Goal Alert) */}
                <div className="absolute top-[35%] right-[5%] md:right-[10%] bg-[#0f1a1c]/80 border border-slate-300/40 shadow-2xl backdrop-blur-md rounded-full px-4 py-2 text-sm flex items-center gap-3 z-30 animate-fade-in-up delay-150 hover:scale-105 transition-transform pointer-events-auto">
                    <span className="w-2 h-2 rounded-full bg-deep-sage shadow-[0_0_8px_rgba(47,176,148,0.8)]"></span>
                    <span className="text-slate-100 font-medium">{texts.goalAlert}</span>
                </div>

            </div>
        </div>
    );
}

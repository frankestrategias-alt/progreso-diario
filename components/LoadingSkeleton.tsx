import React from 'react';

export const LoadingSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col h-[100dvh] bg-slate-900 w-full animate-pulse px-4 py-6 overflow-hidden max-w-md mx-auto relative pt-16">
            {/* Header Profile Area Skeleton */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800/80"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-slate-800/80 rounded"></div>
                        <div className="h-3 w-16 bg-slate-800/80 rounded"></div>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800/80"></div>
            </div>

            {/* Main Card Skeleton (Level/Progress) */}
            <div className="w-full h-40 bg-slate-800/60 rounded-3xl mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
            </div>

            {/* Grid Menu Skeleton */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="h-28 bg-slate-800/50 rounded-3xl"></div>
                <div className="h-28 bg-slate-800/50 rounded-3xl"></div>
                <div className="h-28 bg-slate-800/50 rounded-3xl"></div>
                <div className="h-28 bg-slate-800/50 rounded-3xl"></div>
            </div>

            {/* Bottom Floating Area Skeleton */}
            <div className="mt-auto flex justify-center pb-4">
                <div className="h-16 w-full max-w-[200px] bg-slate-800/70 rounded-full"></div>
            </div>
        </div>
    );
};

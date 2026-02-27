import React from 'react';
import { Trophy, Star, Crown, Zap, Share2 } from 'lucide-react';

interface AchievementCardProps {
    level: number;
    title: string;
    userName?: string;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ level, title, userName = "Líder PRO" }) => {
    return (
        <div className="w-full max-w-[320px] aspect-[4/5] bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl border border-white/10">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] -ml-32 -mb-32"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

            <div className="relative z-10 h-full flex flex-col items-center justify-between text-center">
                <div className="w-full">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-30 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-amber-400 to-orange-600 p-5 rounded-3xl shadow-xl transform -rotate-3 group-hover:rotate-3 transition-transform">
                                <Trophy size={48} className="text-white fill-white/20" />
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-2">Nuevo Rango Alcanzado</p>
                    <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase leading-none">
                        Nivel {level}
                    </h2>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl mb-6 inline-block">
                        <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-orange-300 uppercase tracking-widest">
                            {title}
                        </span>
                    </div>
                </div>

                <div className="w-full">
                    <p className="text-sm font-medium text-slate-400 mb-8 italic">
                        "La ejecución diaria es el único camino al éxito real."
                    </p>

                    <div className="flex flex-col items-center gap-2">
                        <div className="h-1 w-20 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mb-4"></div>
                        <h3 className="text-lg font-black tracking-tight text-white/90">Networker Pro</h3>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Tier-1 Achievement</p>
                    </div>
                </div>
            </div>

            {/* Corner Decorative Stars */}
            <Star className="absolute top-8 left-8 text-amber-500/30 animate-pulse" size={16} fill="currentColor" />
            <Crown className="absolute bottom-8 right-8 text-indigo-500/30 animate-pulse" size={20} fill="currentColor" />
        </div>
    );
};

import React, { useEffect } from 'react';
import { Trophy, Star, X, Share2, Crown } from 'lucide-react';
// @ts-ignore
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
    level: number;
    title: string;
    onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, title, onClose }) => {

    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#fbbf24', '#8b5cf6', '#10b981']
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#fbbf24', '#8b5cf6', '#10b981']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative overflow-hidden animate-in zoom-in-95 duration-500 border-4 border-amber-300">

                {/* Background rays */}
                <div className="absolute inset-0 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-amber-100 via-white to-amber-100 animate-[spin_10s_linear_infinite] opacity-50 pointer-events-none"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-colors z-20"
                >
                    <X size={24} />
                </button>

                <div className="relative z-10 flex flex-col items-center p-8 text-center">

                    <div className="mb-6 relative">
                        <div className="absolute inset-0 bg-amber-400 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                        <div className="relative">
                            <Trophy size={80} className="text-amber-500 drop-shadow-xl fill-amber-100 animate-[bounce_2s_infinite]" strokeWidth={1.5} />
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <Crown size={40} className="text-purple-500 fill-purple-200 animate-pulse" strokeWidth={2} />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-1 animate-in slide-in-from-bottom-5 delay-100">
                        ¡NIVEL {level}!
                    </h2>
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg shadow-orange-200 mb-6 animate-in slide-in-from-bottom-5 delay-200">
                        {title}
                    </div>

                    <p className="text-slate-600 font-medium mb-8 leading-relaxed animate-in slide-in-from-bottom-5 delay-300">
                        ¡Tu disciplina está dando frutos! Has desbloqueado un nuevo estatus en tu carrera.
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-xl hover:bg-slate-800 active:scale-95 transition-all animate-in slide-in-from-bottom-5 delay-500"
                    >
                        ¡A SEGUIR DANDO CAÑA! 🔥
                    </button>
                </div>
            </div>
        </div>
    );
};

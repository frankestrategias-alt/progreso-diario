import React, { useEffect } from 'react';
import { X, Sparkles, Zap, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerHaptic } from '../utils/magic';

interface ProactiveSalesModalProps {
    triggerReason: string;
    onClose: () => void;
}

export const ProactiveSalesModal: React.FC<ProactiveSalesModalProps> = ({ triggerReason, onClose }) => {

    useEffect(() => {
        triggerHaptic('medium');
        const end = Date.now() + (1.5 * 1000);
        const colors = ['#d97706', '#f59e0b', '#fbbf24']; // Gold colors

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }, []);

    const handleCTA = () => {
        triggerHaptic('success');

        // Disparar Evento Analytics Hack 4 (Si gtag está disponible)
        if (typeof (window as any).gtag !== 'undefined') {
            (window as any).gtag('event', 'click_premium_trigger', {
                'event_category': 'Engagement',
                'event_label': triggerReason
            });
        }

        window.open('https://sistemapremium.netlify.app/?origen=app', '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-800 rounded-[32px] overflow-hidden shadow-2xl shadow-orange-500/20 border border-orange-500/30 animate-[slideUp_0.3s_ease-out]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-full transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-amber-500 rounded-b-[40%] opacity-20 blur-xl"></div>

                <div className="p-8 pb-10 flex flex-col items-center text-center relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-orange-500/30 flex items-center justify-center mb-5 rotate-3">
                        <Sparkles size={32} className="text-white fill-amber-300" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black tracking-widest uppercase mb-4">
                        <Zap size={12} className="fill-amber-500" />
                        Pista Desbloqueada
                    </div>

                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                        ¡Tu crecimiento no tiene límites!
                    </h3>
                    <p className="text-slate-300 text-[15px] p-2 leading-relaxed mb-6 bg-slate-800/50 rounded-xl border border-white/5">
                        Lograste <span className="text-amber-400 font-bold">{triggerReason}</span>. Tu consistencia es genial. ¿Qué pasaría si tuvieras una IA prospectando por ti 24/7 mientras duermes?
                    </p>

                    <div className="w-full flex flex-col gap-3 mb-6">
                        <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-white/5 border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                <ShieldCheck size={16} className="text-amber-500" />
                            </div>
                            <span className="text-slate-200 text-sm font-medium">Embudo Cero Rechazos</span>
                        </div>
                        <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-white/5 border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                <Clock size={16} className="text-amber-500" />
                            </div>
                            <span className="text-slate-200 text-sm font-medium">Funcionando en &lt; 24h</span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={handleCTA}
                        className="group w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-2xl font-black text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Ver Códex de Elite Ahora
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={onClose} className="mt-4 text-slate-500 text-xs font-semibold uppercase tracking-wider hover:text-slate-400 underline decoration-slate-600 decoration-dotted underline-offset-4">
                        Quizás más tarde
                    </button>
                </div>
            </div>
        </div>
    );
};

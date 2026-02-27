import React from 'react';
import { Share2, Download, X, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerMagic } from '../utils/magic';

interface SuccessCardProps {
    objection: string;
    response: string;
    onClose: () => void;
}

export const SuccessCard: React.FC<SuccessCardProps> = ({ objection, response, onClose }) => {
    const cardRef = React.useRef<HTMLDivElement>(null);

    const handleShare = async () => {
        // Trigger celebraton!
        triggerMagic();
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#34d399', '#10b981', '#6366f1', '#fbbf24']
        });

        if (navigator.share) {
            try {
                await navigator.share({
                    title: '¡Objeción Superada!',
                    text: `Prospecto: "${objection}"\n\nRespuesta Pro: ${response}\n\nGenerado con Networker Pro 🛡️`,
                    url: window.location.origin,
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            // Fallback: Copy to clipboard if sharing is not available
            navigator.clipboard.writeText(`Prospecto: "${objection}"\n\nRespuesta Pro: ${response}`);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* THE PREMIUM CARD */}
                <div
                    ref={cardRef}
                    className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl border border-white/10"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-[80px] -ml-20 -mb-20"></div>

                    {/* Header */}
                    <div className="relative z-10 flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/40">
                            <ShieldCheck size={20} className="text-white" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[3px] text-emerald-400">Status: Superado</h4>
                            <p className="text-white font-bold text-sm tracking-tight">Networker Pro Intelligence</p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                Lo que el prospecto dijo
                            </p>
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                                <p className="text-slate-200 text-sm font-medium italic">"{objection}"</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                <Zap size={10} fill="currentColor" />
                                Respuesta Ganadora
                            </p>
                            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-4">
                                <p className="text-white text-sm font-bold leading-relaxed">
                                    {response.length > 150 ? response.substring(0, 150) + '...' : response}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Branding */}
                    <div className="relative z-10 mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm rotate-45"></div>
                            </div>
                            <span className="text-xs font-black text-white/50 tracking-tighter">NETWORKER PRO</span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            V 2.0
                        </div>
                    </div>
                </div>

                {/* Interaction Buttons */}
                <div className="flex gap-4 mt-6">
                    <button
                        onClick={handleShare}
                        className="flex-1 bg-white text-slate-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                    >
                        <Share2 size={18} />
                        Compartir Éxito
                    </button>
                    {/* Placeholder for "Save as Image" in the future if needed */}
                </div>

                <p className="text-center text-white/40 text-[10px] mt-4 font-medium uppercase tracking-widest">
                    Saca un pantallazo y súbelo a tus estados
                </p>
            </div>
        </div>
    );
};

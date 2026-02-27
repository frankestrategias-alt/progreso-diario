import React from 'react';
import { Crown, Check, Zap, X, ShieldCheck, Sparkles } from 'lucide-react';
import { paywallService } from '../services/paywallService';

interface PaywallModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ onClose, onSuccess }) => {
    const handleSimulateUpgrade = () => {
        paywallService.simulateUpgrade();
        onSuccess();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative border border-white">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors z-20"
                >
                    <X size={20} />
                </button>

                {/* Header Section */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-800 p-8 text-center text-white relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30 backdrop-blur-sm shadow-xl">
                            <Crown size={40} className="text-amber-400 fill-amber-400" />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-widest mb-1">IA Mentor Pro</h3>
                        <p className="text-indigo-100 text-sm font-medium">Lleva tu negocio al siguiente nivel</p>
                    </div>
                </div>

                {/* Benefits List */}
                <div className="p-8 space-y-6">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-center mb-2">Beneficios Exclusivos</p>

                    <div className="space-y-4">
                        {[
                            { icon: Sparkles, text: "Sugerencias de IA Ilimitadas" },
                            { icon: Brain, text: "Mentoría Proactiva 24/7" },
                            { icon: Zap, text: "Guiones de Cierre de Alto Impacto" },
                            { icon: ShieldCheck, text: "Análisis de Objeciones Premium" }
                        ].map((b, i) => {
                            const Icon = b.icon || Sparkles;
                            return (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
                                        <Check size={14} className="text-indigo-600" strokeWidth={4} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">{b.text}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={handleSimulateUpgrade}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                        >
                            <Crown size={16} fill="currentColor" />
                            Activar Acceso Pro
                        </button>
                        <p className="text-center mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pago único mensual • Cancela cuando quieras</p>
                    </div>
                </div>

                {/* Reset button for demo purposes */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                        onClick={() => { paywallService.resetCredits(); onClose(); }}
                        className="text-[9px] font-black text-slate-300 hover:text-indigo-400 uppercase tracking-widest"
                    >
                        Reiniciar Demo de Créditos
                    </button>
                </div>
            </div>
        </div>
    );
};

// Mock Brain icon if it's not in standard lucide-react (it usually is though)
import { Brain } from 'lucide-react';

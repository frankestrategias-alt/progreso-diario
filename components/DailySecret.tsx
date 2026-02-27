import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Sparkles, ChevronRight, Lightbulb } from 'lucide-react';
import { triggerMagic } from '../utils/magic';

const DAILY_TIPS = [
    { title: "La Regla de los 2 Minutos", content: "Si una tarea toma menos de 2 minutos (como enviar un mensaje de seguimiento), hazla de inmediato. No la agendes." },
    { title: "Poder del Seguimiento", content: "El 80% de las ventas ocurren después del 5to contacto. La fortuna está en el seguimiento, no en la prospección." },
    { title: "Mentalidad de Cierre", content: "No pidas permiso para ayudar. Sugiere una solución clara y asume que el sí ya está ahí." },
    { title: "El Silencio Estratégico", content: "Después de hacer una pregunta de cierre, cállate. El primero que habla, pierde la posición de liderazgo." },
    { title: "Apalancamiento de Red", content: "Tus contactos son tu capital. Nutre la relación antes de presentar el negocio; la confianza es la moneda real." }
];

export const DailySecret: React.FC = () => {
    const [isRevealed, setIsRevealed] = useState(false);
    const [tip, setTip] = useState(DAILY_TIPS[0]);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const savedDate = localStorage.getItem('lastSecretRevealDate');
        const savedTipIndex = localStorage.getItem('currentSecretIndex');

        if (savedDate === today) {
            setIsRevealed(true);
            const index = parseInt(savedTipIndex || '0');
            setTip(DAILY_TIPS[index]);
        } else {
            // New day, pick a new tip
            const newIndex = Math.floor(Math.random() * DAILY_TIPS.length);
            setTip(DAILY_TIPS[newIndex]);
            localStorage.setItem('currentSecretIndex', newIndex.toString());
        }
    }, [today]);

    const handleReveal = () => {
        if (isRevealed) return;

        setIsRevealed(true);
        localStorage.setItem('lastSecretRevealDate', today);
        triggerMagic();

        // Play success sound if available globally or just visual feedback
    };

    return (
        <div className="relative group">
            {!isRevealed ? (
                <div
                    onClick={handleReveal}
                    className="cursor-pointer bg-slate-900 rounded-[32px] p-8 text-center border-2 border-indigo-500/30 hover:border-indigo-400 transition-all duration-500 group-hover:scale-[1.02] shadow-2xl relative overflow-hidden active:scale-95"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 animate-pulse"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/40 border-4 border-white/40 group-hover:rotate-12 transition-transform">
                            <Lock size={28} className="text-white" />
                        </div>
                        <h3 className="text-purple-200/60 font-black uppercase tracking-[0.3em] text-xs mb-2">Alpha Secret</h3>
                        <p className="text-white text-[10px] font-bold uppercase tracking-widest opacity-60">Haz clic para revelar el secreto de hoy</p>
                    </div>
                    {/* Floating Sparkles */}
                    <Sparkles className="absolute top-4 right-4 text-purple-400 animate-bounce" size={16} />
                </div>
            ) : (
                <div className="bg-white rounded-[40px] p-1 border border-slate-100 shadow-xl animate-in zoom-in spin-in-2 duration-700">
                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-[38px] p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                                <Lightbulb size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Estrategia Revelada</p>
                                <h4 className="text-lg font-black text-slate-800 uppercase leading-none mt-1">{tip.title}</h4>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed italic border-l-4 border-emerald-500/30 pl-4 py-1">
                            "{tip.content}"
                        </p>
                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-[12px] font-black text-slate-400 uppercase tracking-widest transition-all">
                            <span className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Siguiente secreto en 24h
                            </span>
                            <div className="flex gap-2 items-center">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                <div className="w-2 h-2 bg-emerald-400/60 rounded-full animate-pulse [animation-delay:200ms]"></div>
                                <div className="w-2 h-2 bg-slate-200 rounded-full animate-pulse [animation-delay:400ms]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

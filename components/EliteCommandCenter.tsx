import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, X } from 'lucide-react';
import { trackEvent } from '../services/firebase';

export const EliteCommandCenter = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const lastClosed = localStorage.getItem('elite-card-closed');
        if (lastClosed) {
            const now = Date.now();
            const oneHour = 60 * 60 * 1000;
            if (now - parseInt(lastClosed) > oneHour) {
                setIsVisible(true);
            }
        } else {
            setIsVisible(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem('elite-card-closed', Date.now().toString());
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="relative overflow-hidden p-6 rounded-[40px] bg-slate-950 border border-white/5 shadow-2xl group transition-all duration-500 hover:border-orange-500/20">
            {/* Close Button - Máxima Visibilidad */}
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white/90 hover:text-white transition-all z-20 border border-white/20 shadow-lg"
            >
                <X size={18} />
            </button>

            {/* Subtile Hexagonal Pattern / Background Effect */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-start text-left">
                {/* Badge - Servicios Exclusivos (Naranja degradado) */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-500/10 p-2.5 rounded-2xl border border-orange-500/20 text-orange-500">
                        <ShieldCheck size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-gradient-to-r from-amber-200 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                        Servicios Exclusivos
                    </span>
                </div>

                {/* Title & Copy */}
                <div className="mb-8 w-full max-w-[340px]">
                    <h2 className="text-2xl font-black leading-snug tracking-tight text-white mb-2 uppercase">
                        Centro de Mando <br />
                        <span className="text-4xl font-black bg-gradient-to-r from-amber-200 via-orange-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(251,146,60,0.3)]">
                            Elite
                        </span>
                    </h2>

                    <p className="text-base font-bold text-white/90 mb-0 whitespace-nowrap">
                        ¿Listo para automatizar tu negocio?
                    </p>
                </div>

                {/* CTA Link (Nativo para evitar bloqueos de pop-up) */}
                <a
                    onClick={() => trackEvent('click_premium_checkout', { origin: 'command_center' })}
                    href="https://sistemapremium.netlify.app/?origen=app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group/btn w-full bg-gradient-to-r from-orange-500 to-amber-600 py-4 rounded-3xl flex items-center justify-center gap-3 overflow-hidden shadow-[0_10px_40px_-10px_rgba(249,115,22,0.5)] transition-all hover:scale-[1.02] active:scale-95 border border-white/10"
                >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer-sweep"></div>

                    <Zap size={20} className="text-white relative z-10 fill-white" />
                    <span className="text-white font-black text-sm uppercase tracking-widest relative z-10">
                        Sistema Automático
                    </span>
                </a>

                {/* Note / Availability (50% opacity) */}
                <div className="mt-8 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">
                        Cupos limitados para este mes
                    </p>
                </div>
            </div>
        </div>
    );
};

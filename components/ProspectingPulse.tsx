import React, { useState, useEffect } from 'react';
import { Zap, Users, TrendingUp, Trophy, Activity, Sparkles, ShieldCheck, Globe } from 'lucide-react';

const PULSE_MESSAGES = [
    { id: 1, text: "✅ **Nuevas acciones** se están ejecutando en este momento", icon: Activity, color: "text-emerald-500" },
    { id: 2, text: "📲 Se acaba de enviar una **invitación masiva** desde la App", icon: Users, color: "text-indigo-500" },
    { id: 3, text: "💎 **Duplicación automática** activada en un nuevo equipo", icon: ShieldCheck, color: "text-blue-400" },
    { id: 4, text: "🚀 Un líder acaba de **desbloquear su rango**", icon: Trophy, color: "text-amber-500" },
    { id: 5, text: "🔥 **82 networkers** están prospectando **EN VIVO** ahora mismo", icon: Users, color: "text-orange-500" },
    { id: 6, text: "💰 **Nuevo cierre** registrado en la comunidad global", icon: Zap, color: "text-emerald-500" },
    { id: 7, text: "🚀 Un líder desbloqueó su **rango máximo** hace **2 MINUTOS**", icon: Trophy, color: "text-amber-500" },
    { id: 8, text: "🛡️ **156 objeciones** respondidas automáticamente hoy", icon: Activity, color: "text-indigo-500" },
    { id: 9, text: "💪 **7 líderes** ya cumplieron su **meta diaria** (antes del mediodía)", icon: Zap, color: "text-purple-500" },
    { id: 10, text: "✨ **89 guiones** de atracción creados por la **IA** en la última hora", icon: Sparkles, color: "text-amber-400" },
    { id: 11, text: "🏆 Racha activa de **45 días** sin fallar — **disciplina nivel PRO**", icon: Trophy, color: "text-emerald-400" },
    { id: 12, text: "🔥 **34 networkers** están prospectando **EN VIVO** ahora mismo", icon: Users, color: "text-orange-400" },
    { id: 13, text: "🌍 Networkers de **12 países nuevos** se unieron hoy", icon: Globe, color: "text-indigo-400" },
    { id: 14, text: "🎯 Un usuario consiguió **3 prospectos calificados** en 24h", icon: TrendingUp, color: "text-emerald-500" },
    { id: 15, text: "🔥 **47 networkers** están prospectando **EN VIVO** ahora mismo", icon: Users, color: "text-orange-500" },
    { id: 16, text: "🧠 La IA detectó **5 prospectos cerrados** en los últimos 15 minutos", icon: Sparkles, color: "text-purple-500" }
];

export const ProspectingPulse: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % PULSE_MESSAGES.length);
                setIsVisible(true);
            }, 500); // Wait for fade-out before changing message
        }, 6000); // Change message every 6 seconds

        return () => clearInterval(interval);
    }, []);

    const current = PULSE_MESSAGES[currentIndex];
    const Icon = current.icon;

    // Function to render text with bold parts
    const renderFormattedText = (text: string) => {
        return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <span key={i} className="text-slate-900 font-black">
                        {part.slice(2, -2)}
                    </span>
                );
            }
            return <span key={i} className="text-slate-500 font-bold">{part}</span>;
        });
    };

    return (
        <div className="w-full px-2">
            <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-full py-2.5 px-4 flex items-center justify-center gap-3 shadow-sm transition-all duration-500 select-none overflow-hidden h-[42px]">
                <div className={`transition-all duration-500 flex items-center gap-3 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className={`${current.color} bg-white/50 p-1.5 rounded-full shadow-inner`}>
                        <Icon size={14} fill="currentColor" className={currentIndex % 2 === 0 ? 'animate-pulse' : ''} />
                    </div>
                    <p className="text-[10px] uppercase tracking-tight flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>{renderFormattedText(current.text)}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

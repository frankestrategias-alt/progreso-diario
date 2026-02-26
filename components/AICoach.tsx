import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Zap, Target, MessageSquare, Brain, Crown } from 'lucide-react';
import { DailyProgress, UserGoals } from '../types';
import { paywallService, PaywallStatus } from '../services/paywallService';

interface AICoachProps {
    progress: DailyProgress;
    goals: UserGoals;
    tasks: any[];
    onAction: (view: 'CONTACT' | 'FOLLOWUP' | 'DAILY_POST') => void;
    onShowPaywall: () => void;
}

export const AICoach: React.FC<AICoachProps> = ({ progress, goals, tasks, onAction, onShowPaywall }) => {
    const [insight, setInsight] = useState<{ text: string, actionLabel: string, type: 'CONTACT' | 'FOLLOWUP' | 'DAILY_POST', icon: any } | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [paywall, setPaywall] = useState<PaywallStatus>(paywallService.getStatus());

    useEffect(() => {
        const handleUpdate = () => setPaywall(paywallService.getStatus());
        window.addEventListener('paywall_update', handleUpdate);
        return () => window.removeEventListener('paywall_update', handleUpdate);
    }, []);

    useEffect(() => {
        if (!Array.isArray(tasks)) return;

        const pendingTasks = tasks.filter(t => !t.completed);
        const hotProspects = tasks.filter(t => {
            const ageHours = (Date.now() - (t.createdAt || 0)) / (1000 * 60 * 60);
            return !t.completed && ageHours >= 24 && ageHours <= 48;
        });

        const hour = new Date().getHours();
        let newInsight = null;

        if (hotProspects.length > 0) {
            newInsight = {
                text: `*${hotProspects[0].name}* está listo. ¡Cierra hoy antes de que se enfríe!`,
                actionLabel: "Contactar",
                type: 'CONTACT' as const,
                icon: Zap
            };
        } else if ((progress.postsMade || 0) < (goals.dailyPosts || 1) && hour > 14) {
            newInsight = {
                text: "Tu audiencia espera. Crea una *historia de impacto* ahora.",
                actionLabel: "Crear Post",
                type: 'DAILY_POST' as const,
                icon: Sparkles
            };
        } else if (pendingTasks.length > 0) {
            newInsight = {
                text: `Tienes *${pendingTasks.length} pendientes*. ¡Dales velocidad hoy!`,
                actionLabel: "Ver Tareas",
                type: 'CONTACT' as const,
                icon: Target
            };
        } else if (progress.contactsMade < goals.dailyContacts) {
            newInsight = {
                text: "Agenda con espacios. Busca *2 nuevos contactos* hoy.",
                actionLabel: "Prospectar",
                type: 'CONTACT' as const,
                icon: MessageSquare
            };
        } else {
            newInsight = {
                text: "¿Listo para ganar? Empieza por *definir tus metas* hoy.",
                actionLabel: "Mis Metas",
                type: 'GOALS' as any,
                icon: Target
            };
        }

        if (newInsight) {
            setInsight(newInsight);
            setTimeout(() => setIsVisible(true), 300);
        } else {
            setIsVisible(false);
        }
    }, [progress, goals, tasks, paywall.isPro, paywall.creditsUsed, paywall.maxFreeCredits]);

    if (!insight || !isVisible) return null;

    const hasCredits = paywall.isPro || paywall.creditsUsed < paywall.maxFreeCredits;

    const handleAction = () => {
        if (hasCredits) {
            paywallService.useCredit();
            onAction(insight.type);
        } else {
            onShowPaywall();
        }
    };

    return (
        <div className="animate-fade-in animate-slide-up duration-500">
            <div className="relative group">
                <div className={`absolute inset-0 blur-xl rounded-[24px] transition-all ${hasCredits ? 'bg-indigo-500/10 group-hover:bg-indigo-500/20' : 'bg-amber-500/5'}`}></div>

                <div className={`relative bg-white/95 backdrop-blur-md border rounded-[24px] p-4 shadow-lg flex items-center gap-4 transition-all ${hasCredits ? 'border-indigo-100 shadow-indigo-100/30' : 'border-amber-100 shadow-amber-100/20'}`}>
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md animate-pulse ${hasCredits ? 'bg-indigo-600' : 'bg-amber-500'}`}>
                        {hasCredits ? <Brain size={20} /> : <Crown size={20} />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${hasCredits ? 'text-indigo-500' : 'text-amber-600'}`}>
                                {hasCredits ? 'CONSEJO IA' : 'PREMIUM'}
                            </span>
                            {!paywall.isPro && !hasCredits && (
                                <span className="text-[8px] font-black text-amber-500 uppercase">Bloqueado</span>
                            )}
                        </div>

                        <p className={`text-[12px] font-bold leading-tight mb-2 pr-1 ${hasCredits ? 'text-slate-800' : 'text-slate-400 blur-[2px]'}`}>
                            {hasCredits
                                ? insight.text.split('*').map((part, i) => i % 2 === 1 ? <span key={i} className="text-indigo-600 font-black">{part}</span> : part)
                                : "Sugerencia estratégica bloqueada. Desbloquea para ver."
                            }
                        </p>

                        <button
                            onClick={handleAction}
                            className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider group/btn transition-colors ${hasCredits ? 'text-indigo-600 hover:text-indigo-700' : 'text-amber-600 hover:text-amber-700'}`}
                        >
                            {hasCredits ? insight.actionLabel : "Pásate a Pro"}
                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

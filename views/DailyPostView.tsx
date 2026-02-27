import React, { useState, useEffect } from 'react';
import {
    Zap, Copy, CheckCircle2, Sparkles, Palette,
    Megaphone, Check, Flame, ArrowRight, Lightbulb, Share2, ArrowLeft
} from 'lucide-react';
import { generateSocialPost, SocialStrategy } from '../services/geminiService';
import { triggerMagic } from '../utils/magic';
import { UserGoals } from '../types';
import { VoiceInput } from '../components/VoiceInput';
import { ActionCard } from '../components/ActionCard';

interface DailyPostViewProps {
    onPostComplete?: (isRescue: boolean) => void;
    goals: UserGoals;
}

// --- STRATEGY ROTATION SYSTEM ---
const DAILY_STRATEGIES = [
    { day: 0, theme: "Planificación & Visión", hook: "La semana se gana antes de que empiece...", prompt: "Comparte TU META principal para esta semana.", icon: "🎯" },
    { day: 1, theme: "Mentalidad de Líder", hook: "Lo que veo venir es gigante...", prompt: "Comparte tu VISIÓN sobre el futuro de tu equipo.", icon: "🧠" },
    { day: 2, theme: "Producto & Resultado", hook: "No creerás lo que acaba de pasar...", prompt: "Cuenta un BENEFICIO clave o un testimonio.", icon: "✨" },
    { day: 3, theme: "Estilo de Vida", hook: "Mi oficina de hoy se ve así...", prompt: "Muestra tu LIBERTAD: ¿Dónde estás hoy?", icon: "🌴" },
    { day: 4, theme: "TBT (Historia)", hook: "Hace un año estaba...", prompt: "Muestra tu PROGRESO: ¿Cómo eras antes?", icon: "⏳" },
    { day: 5, theme: "Valor Educativo", hook: "3 cosas que aprendí sobre...", prompt: "Enseña un TIP RÁPIDO de tu industria.", icon: "📚" },
    { day: 6, theme: "Personal & Relax", hook: "Desconectando para reconectar...", prompt: "¿Qué haces para RECARGAR energía?", icon: "🔋" },
];

export const DailyPostView: React.FC<DailyPostViewProps> = ({ onPostComplete, goals }) => {
    const [step, setStep] = useState(1); // Start directly at Step 1 (Input)
    const [customContext, setCustomContext] = useState('');
    const [loading, setLoading] = useState(false);
    const [strategy, setStrategy] = useState<SocialStrategy | null>(null);
    const [copiedAll, setCopiedAll] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Get Today's Strategy
    const todayIndex = new Date().getDay();
    const currentStrategy = DAILY_STRATEGIES.find(s => s.day === todayIndex) || DAILY_STRATEGIES[0];

    const handleActivate = () => {
        setStep(1);
    };

    const handleGenerate = async () => {
        setLoading(true);
        setStrategy(null);
        try {
            // We pass the "Theme" as part of the context to enforce the strategy
            const contextWithTheme = `ESTRATEGIA DEL DÍA: ${currentStrategy.theme}. HOOK OBLIGATORIO: "${currentStrategy.hook}". CONTEXTO USUARIO: ${customContext}`;

            const result = await generateSocialPost('WhatsApp', 'Atraer', 'Profesional', goals.companyName, contextWithTheme, goals.productNiche);
            setStrategy(result);
            setStep(2);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = () => {
        if (!onPostComplete) return;
        triggerMagic();
        onPostComplete(false);
        setIsCompleted(true);
        setTimeout(() => { setIsCompleted(false); setStep(0); setCustomContext(''); }, 3000);
    };

    const handleShareResult = async () => {
        if (!strategy) return;

        const shareUrl = window.location.origin;
        const promoText = `\n\n🚀 Creado con MLM Progreso Diario: ${shareUrl}`;
        const shareText = `🔥 ¡Acabo de terminar mi estrategia de hoy!\n\nTema: ${currentStrategy.theme}\n🚀 ${strategy.mainPost.substring(0, 50)}...${promoText}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Mi Estrategia del Día',
                    text: shareText,
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            navigator.clipboard.writeText(shareText);
            alert('¡Enlace copiado! Compártelo con tu equipo.');
        }
    };

    const handleCopyAll = () => {
        if (!strategy) return;
        let fullText = "";

        // Prefer Video Script format if available for high engagement, otherwise main post
        if (strategy.videoScript) {
            fullText += `${strategy.videoScript.hook}\n\n${strategy.videoScript.body}\n\n${strategy.videoScript.cta}`;
        } else {
            fullText += `${strategy.mainPost}\n\n${strategy.cta}`;
        }

        if (strategy.imageHint) fullText += `\n\n📸 MISIÓN VISUAL:\n${strategy.imageHint}`;
        navigator.clipboard.writeText(fullText);
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    // --- VIEW 0: ZEN MODE (POWER BUTTON) ---
    if (step === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
                <div className="relative group cursor-pointer" onClick={handleActivate}>
                    <div className="absolute inset-0 bg-indigo-500 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
                    <button
                        className="relative w-48 h-48 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-2xl shadow-indigo-300 flex flex-col items-center justify-center gap-2 transform transition-all duration-300 group-hover:scale-105 active:scale-95 border-4 border-indigo-400/30"
                    >
                        <Zap size={48} className="fill-white animate-pulse" />
                        <span className="text-sm font-black tracking-widest uppercase">Activar Día</span>
                    </button>

                    {/* Ring Animation */}
                    <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full animate-[ping_3s_ease-in-out_infinite]"></div>
                </div>

                <div className="mt-12 text-center space-y-2">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">
                        {currentStrategy.icon} Hoy toca: <span className="text-indigo-600">{currentStrategy.theme}</span>
                    </h2>
                    <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto">
                        Tu estrategia ya está lista. Solo pulsa el botón.
                    </p>
                </div>
            </div>
        );
    }

    // --- VIEW 1: INPUT CONTEXT ---
    if (step === 1) {
        return (
            <div className="max-w-xl mx-auto pt-4 pb-20 animate-in slide-in-from-bottom duration-500 px-4">
                <button onClick={() => setStep(0)} className="mb-6 text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <ArrowLeft size={16} /> Cancelar
                </button>

                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl shadow-indigo-200/50 border border-white/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <Flame size={120} />
                    </div>

                    <div className="relative z-10">
                        {/* Header Badge */}
                        <div className="flex items-center gap-3 mb-6 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                            <span className="text-3xl">{currentStrategy.icon}</span>
                            <div>
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Misión de Hoy</p>
                                <h3 className="text-lg font-black text-indigo-900 leading-tight">
                                    {currentStrategy.theme}
                                </h3>
                            </div>
                        </div>

                        {/* Step 1: Hook */}
                        <div className="relative">
                            <div className="absolute -left-3 top-6 bottom-0 w-0.5 bg-indigo-100 hidden sm:block"></div>
                            <div className="bg-white border-2 border-indigo-100 rounded-3xl p-5 mb-2 relative">
                                <span className="absolute -top-3 left-4 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                    Paso 1
                                </span>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 mb-2">
                                    Empieza con esta frase:
                                </p>
                                <div className="flex items-center gap-3 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
                                    <p className="text-lg font-bold text-indigo-900 italic flex-1">
                                        "{currentStrategy.hook}"
                                    </p>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(currentStrategy.hook)}
                                        className="p-2 bg-white rounded-full text-indigo-500 shadow-sm hover:scale-110 active:scale-95 transition-all"
                                        title="Copiar frase"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Arrow Connector */}
                        <div className="flex justify-center -my-3 relative z-20">
                            <div className="bg-white p-1 rounded-full border border-indigo-50 text-indigo-300">
                                <ArrowRight size={20} className="rotate-90" />
                            </div>
                        </div>

                        {/* Step 2: Input */}
                        <div className="relative mb-6">
                            <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 pt-8 mt-2 relative shadow-sm">
                                <span className="absolute -top-3 left-4 bg-slate-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                    Paso 2
                                </span>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                                    Completa la idea ({currentStrategy.prompt}):
                                </label>

                                <div className="relative group">
                                    <textarea
                                        value={customContext}
                                        onChange={(e) => setCustomContext(e.target.value)}
                                        placeholder="Escribe aquí tu parte de la historia..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 h-24 text-slate-700 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all resize-none text-base font-medium placeholder:text-slate-300"
                                        autoFocus
                                    />
                                    <div className="absolute bottom-3 right-3">
                                        <VoiceInput onTranscript={(t) => setCustomContext(prev => prev ? `${prev} ${t}` : t)} />
                                    </div>
                                </div>

                                {/* Context Chips */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {[
                                        { label: '☕ Café con prospecto', text: 'Tomando un café con un futuro líder.' },
                                        { label: '💻 Zoom de equipo', text: 'Conectado con el equipo en un entrenamiento épico.' },
                                        { label: '📖 Aprendizaje', text: 'Aprendiendo nuevas estrategias de crecimiento.' },
                                        { label: '🚀 Lanzamiento', text: 'Preparando algo gigante para esta semana.' },
                                        { label: '🔥 Momento On', text: 'Enfocado y listo para el siguiente nivel.' }
                                    ].map(chip => (
                                        <button
                                            key={chip.label}
                                            onClick={() => setCustomContext(prev => prev ? `${prev} ${chip.text}` : chip.text)}
                                            className="text-[10px] font-bold bg-white border border-slate-200 text-slate-500 px-3 py-1.5 rounded-full hover:border-indigo-300 hover:text-indigo-600 transition-all active:scale-90"
                                        >
                                            {chip.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Action */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !customContext.trim()}
                            className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all flex flex-col items-center justify-center gap-1 uppercase tracking-widest text-sm relative overflow-hidden group ${loading || !customContext.trim()
                                ? 'bg-slate-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-[1.02] active:scale-95 shadow-indigo-200'
                                }`}
                        >
                            {loading && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                            {loading ? (
                                <span>Mezclando Ingredientes...</span>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2">
                                        ¡Mezclar y Crear Magia! <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                                    </div>
                                    <span className="text-xs opacity-90 normal-case font-bold">La IA unirá todo en un Post perfecto</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW 2: RESULTS (HIGH IMPACT) ---
    if (step === 2 && strategy) {
        return (
            <div className="max-w-xl mx-auto pt-20 pb-20 animate-in slide-in-from-right duration-500 px-4">
                {/* Visual Mission Card */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[24px] p-5 text-white shadow-2xl shadow-indigo-200 mb-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                                <Palette size={16} className="text-amber-400" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-200">
                                Misión Visual
                            </span>
                        </div>
                        <p className="text-base font-bold leading-relaxed">
                            {strategy.imageHint}
                        </p>
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-xl p-6 mb-6 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Tu Copy
                        </span>
                        <button
                            onClick={handleCopyAll}
                            className={`text-[10px] font-black uppercase px-4 py-2 rounded-full transition-all flex items-center gap-2 ${copiedAll ? 'bg-emerald-500 text-white' : 'bg-white/50 border border-white/40 text-slate-500 hover:bg-white'
                                }`}
                        >
                            {copiedAll ? <Check size={14} /> : <Copy size={14} />}
                            {copiedAll ? '¡Copiado!' : 'Copiar Texto'}
                        </button>
                    </div>

                    <div className="prose prose-sm max-w-none relative z-10">
                        <ActionCard text={`${strategy.mainPost}\n\n${strategy.cta}`} />
                    </div>
                </div>

                {/* Finish Button */}
                <button
                    onClick={handleComplete}
                    disabled={isCompleted}
                    className={`w-full py-5 rounded-[24px] font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm ${isCompleted
                        ? 'bg-emerald-500 scale-95 ring-4 ring-emerald-200'
                        : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-200'
                        }`}
                >
                    {isCompleted ? (
                        <>
                            <CheckCircle2 size={20} /> ¡Día Completado!
                        </>
                    ) : (
                        <>
                            <Megaphone size={20} /> Publicar y Ganar Puntos
                        </>
                    )}
                </button>

                {isCompleted && (
                    <button
                        onClick={handleShareResult}
                        className="w-full mt-4 py-3 rounded-[20px] bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors animate-in fade-in slide-in-from-bottom duration-500"
                    >
                        <Share2 size={16} /> Compartir Logro
                    </button>
                )}

                <button onClick={() => setStep(0)} className="w-full text-center mt-6 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">
                    Volver al Inicio
                </button>
            </div>
        );
    }

    return null;
};
import React, { useState, useEffect } from 'react';
import {
    Zap, Copy, CheckCircle2, Sparkles, Palette,
    Megaphone, Check, Flame, ArrowRight, Lightbulb, Share2, ArrowLeft, X, Trophy, Rocket
} from 'lucide-react';
import { generateSocialPost, SocialStrategy } from '../services/geminiService';
import { triggerMagic } from '../utils/magic';
import { useAppContext } from '../contexts/AppContext';
import { VoiceInput } from '../components/VoiceInput';
import { ActionCard } from '../components/ActionCard';
import { DailyPostInput } from '../components/DailyPostInput';
import { DailyPostShareModal } from '../components/DailyPostShareModal';

interface DailyPostViewProps {
    onPostComplete?: (isRescue: boolean) => void;
    onRecordAction?: () => void;
    onNavigate?: (view: any) => void;
}

// --- STRATEGY ROTATION SYSTEM ---
const DAILY_STRATEGIES = [
    { day: 0, theme: "Visión & Equipo", hook: "Lo que viene esta semana es nivel leyenda...", prompt: "¿Cuál es tu sueño más grande para estos días?", icon: "🎯" },
    { day: 1, theme: "Mentalidad Ganadora", hook: "Aprendí algo que me cambió la jugada hoy...", prompt: "¿Qué lección te dejó el día de hoy?", icon: "🧠" },
    { day: 2, theme: "Resultados & Magia", hook: "¡Mira esto! Los resultados hablan por sí solos...", prompt: "¿Qué éxito (grande o pequeño) quieres celebrar?", icon: "✨" },
    { day: 3, theme: "Libertad de Movimiento", hook: "Mi oficina no tiene paredes, hoy ando por aquí...", prompt: "¿Desde dónde estás trabajando hoy?", icon: "🌍" },
    { day: 4, theme: "Tu Historia de Poder", hook: "Si me hubieran dicho hace un año dónde estaría hoy...", prompt: "¿Dinos una cosa que ha mejorado en tu vida?", icon: "⏳" },
    { day: 5, theme: "Consejo de Experto", hook: "Mucha gente me pregunta el secreto del éxito...", prompt: "¿Qué consejo le darías a alguien que está empezando?", icon: "💡" },
    { day: 6, theme: "Gratitud & Estilo", hook: "Recargando baterías para una semana épica...", prompt: "¿Por qué estás agradecido hoy?", icon: "🔋" },
];

export const DailyPostView: React.FC<DailyPostViewProps> = ({ onPostComplete, onRecordAction, onNavigate }) => {
    const { goals } = useAppContext();
    const [step, setStep] = useState(1); // Start directly at Step 1 (Input)
    const [customContext, setCustomContext] = useState('');
    const [loading, setLoading] = useState(false);
    const [strategy, setStrategy] = useState<SocialStrategy | null>(null);
    const [copiedAll, setCopiedAll] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    const handleResult = (result: 'success' | 'later') => {
        if (result === 'success') {
            triggerMagic();
            alert("¡Esa es la actitud! 🔥 Logro registrado.");

            // Finalize action (give extra reward or just finish)
            if (onPostComplete) {
                onPostComplete(false);
            }
        }

        setIsCompleted(true);
        setShowFeedback(false);
    };

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
        // We don't force feedback here if they didn't copy, 
        // they chose to finish manually.
    };

    const getShareText = () => {
        if (!strategy) return "";
        const shareUrl = window.location.origin;
        const promoText = `\n\n🚀 Creado con Networker Pro: ${shareUrl}`;
        return `🔥 ¡Acabo de terminar mi estrategia de hoy!\n\nTema: ${currentStrategy.theme}\n🚀 ${strategy.mainPost.substring(0, 50)}...${promoText}`;
    };

    const handleShareResult = async () => {
        if (!strategy) return;
        setShowShareModal(true);
    };

    const handleWhatsAppShare = () => {
        const text = getShareText();
        const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.location.href = waUrl;
        setShowShareModal(false);
    };

    const handleNativeShare = async () => {
        const text = getShareText();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Mi Estrategia del Día',
                    text: text,
                });
                setShowShareModal(false);
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            handleCopyShareText();
        }
    };

    const handleCopyShareText = () => {
        const text = getShareText();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try { document.execCommand('copy'); } catch (err) { }
            document.body.removeChild(textArea);
        }
        alert('¡Enlace copiado! Compártelo con tu equipo.');
        setShowShareModal(false);
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

        // Inyección Viral B2B: Marca de agua
        fullText += `\n\n(Generado en 3s con la IA de Networker Pro. Úsalo gratis: ${window.location.origin})`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(fullText);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = fullText;
            document.body.appendChild(textArea);
            textArea.select();
            try { document.execCommand('copy'); } catch (err) { }
            document.body.removeChild(textArea);
        }

        if (onRecordAction) onRecordAction(); // Give points on copy
        setCopiedAll(true);
        setShowFeedback(true);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    // --- VIEW 0: ZEN MODE (POWER BUTTON) ---
    if (step === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[65vh] animate-in fade-in zoom-in duration-1000">
                {/* Glow Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative group cursor-pointer" onClick={handleActivate}>
                    {/* Ring Animations */}
                    <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full animate-[ping_4s_ease-in-out_infinite]" />
                    <div className="absolute -inset-4 border border-indigo-400/10 rounded-full animate-[ping_6s_ease-in-out_infinite] delay-1000" />

                    <button
                        className="relative w-52 h-52 rounded-full bg-slate-900 border-8 border-slate-800 shadow-[0_32px_64px_-16px_rgba(79,70,229,0.3)] flex flex-col items-center justify-center gap-3 transform transition-all duration-500 group-hover:scale-105 active:scale-95 overflow-hidden"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <Zap size={48} className="text-amber-400 fill-amber-400 animate-zap-pulse drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
                        <div className="text-center relative z-10">
                            <span className="block text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400 mb-1">
                                {new Date().toLocaleDateString('es-ES', { weekday: 'long' })}
                            </span>
                            <span className="block text-sm font-black tracking-widest uppercase text-white">
                                Activar Día
                            </span>
                        </div>
                    </button>
                </div>

                <div className="mt-16 text-center space-y-4 relative z-10">
                    <div className="inline-flex items-center gap-3 bg-white px-8 py-3.5 rounded-full border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] group-hover:border-indigo-200 transition-all">
                        <span className="text-2xl transform group-hover:scale-125 transition-transform duration-500">
                            {currentStrategy.icon}
                        </span>
                        <h2 className="text-[15px] font-black text-slate-800 tracking-tight">
                            Hoy toca: <span className="text-indigo-600 font-extrabold">{currentStrategy.theme}</span>
                        </h2>
                    </div>

                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed">
                        Tu estrategia de liderazgo está lista
                    </p>
                </div>
            </div>
        );
    }

    // --- VIEW 1: INPUT CONTEXT ---
    if (step === 1) {
        return (
            <DailyPostInput
                currentStrategy={currentStrategy}
                customContext={customContext}
                setCustomContext={setCustomContext}
                handleGenerate={handleGenerate}
                loading={loading}
                onCancel={() => setStep(0)}
            />
        );
    }

    // --- VIEW 2: RESULTS (HIGH IMPACT) ---
    if (step === 2 && strategy) {
        return (
            <div className="max-w-2xl mx-auto pt-6 pb-24 animate-in slide-in-from-right duration-700 px-2">

                {/* Header Page */}
                <div onClick={() => setStep(1)} className="mb-8 flex items-center gap-3 cursor-pointer group">
                    <div className="p-2 bg-slate-100 rounded-xl text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        <ArrowLeft size={16} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 leading-tight">Tu Estrategia Elite</h2>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Generada con Inteligencia Artificial</p>
                    </div>
                </div>

                {/* Visual Mission Card (The "What to Show") */}
                <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-200/50 mb-6 relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] -mr-10 -mt-10" />
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/20 transform rotate-3 group-hover:rotate-0 transition-transform">
                            <Palette size={28} className="text-amber-300" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-2">
                            Misión Visual
                        </span>
                        <h3 className="text-xl font-bold leading-tight text-white mb-2 italic">
                            "{strategy.imageHint}"
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-[200px]">
                            Haz que tu imagen sea real, humana y atractiva
                        </p>
                    </div>
                </div>

                {/* Content Card (The "What to Copy") */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8 mb-8 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Tu Copy Profesional
                            </span>
                        </div>
                        <button
                            onClick={handleCopyAll}
                            className={`text-[10px] font-black uppercase px-6 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm ${copiedAll
                                ? 'bg-emerald-500 text-white animate-in zoom-in'
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-100'
                                }`}
                        >
                            {copiedAll ? <Check size={14} /> : <Copy size={14} />}
                            {copiedAll ? '¡Texto Copiado!' : 'Copiar Texto'}
                        </button>
                    </div>

                    <div className="relative bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                        <ActionCard text={`${strategy.mainPost}\n\n${strategy.cta}`} hideCopy={true} />
                    </div>
                </div>

                {/* Dynamic Action Area */}
                <div className="space-y-4">
                    {!isCompleted && !showFeedback && (
                        <button
                            onClick={handleComplete}
                            disabled={isCompleted}
                            className="w-full py-6 rounded-[32px] font-black text-white shadow-2xl transition-all flex flex-col items-center justify-center gap-1 uppercase tracking-[0.2em] text-sm bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-200 relative overflow-hidden group"
                        >
                            {/* Shimmer */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-sweep duration-1000" />
                            <div className="flex items-center gap-3 relative z-10 text-lg">
                                <Rocket size={24} className="text-amber-400" /> ¡Publicar y Ganar Puntos!
                            </div>
                            <span className="text-[9px] opacity-70 normal-case font-bold tracking-widest relative z-10 uppercase transition-all group-hover:opacity-100">
                                Súbelo a tus estados y reclama tu nivel
                            </span>
                        </button>
                    )}

                    {showFeedback && !isCompleted && (
                        <div className="bg-slate-900 p-8 rounded-[40px] text-white text-center animate-in zoom-in slide-in-from-bottom-2 shadow-2xl ring-4 ring-indigo-400/10">
                            <Trophy size={48} className="mx-auto text-amber-400 mb-4 animate-bounce" />
                            <p className="font-black mb-2 text-2xl tracking-tight">🚀 ¡Acción Detectada!</p>
                            <p className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">¿Alguien ha reaccionado ya?</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleResult('later')}
                                    className="flex-1 py-5 bg-slate-800 rounded-3xl hover:bg-slate-700 transition-colors font-black uppercase text-[10px] tracking-widest text-slate-400 border border-white/5"
                                >
                                    👀 Aún no hay aviso
                                </button>
                                <button
                                    onClick={() => handleResult('success')}
                                    className="flex-1 py-5 bg-emerald-500 rounded-3xl font-black uppercase text-[11px] tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:scale-105 transition-all text-white flex items-center justify-center gap-2"
                                >
                                    🔥 ¡Hay Interés!
                                </button>
                            </div>
                        </div>
                    )}

                    {isCompleted && (
                        <div className="space-y-4 animate-in fade-in zoom-in duration-700">
                            <div className="w-full py-8 rounded-[40px] bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black uppercase tracking-[0.3em] text-md flex flex-col items-center justify-center gap-2 shadow-2xl shadow-emerald-200">
                                <CheckCircle2 size={40} className="mb-2" />
                                <span>¡Misión Cumplida!</span>
                            </div>

                            <button
                                onClick={handleShareResult}
                                className="w-full py-5 rounded-[24px] bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 shadow-xl border border-white/10"
                            >
                                <Share2 size={18} className="text-indigo-400" /> Inspirar a mi Equipo con el Logro
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-12 text-center">
                    <button onClick={() => { if (onNavigate) onNavigate('HOME', true); }} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-indigo-600 transition-all border-b border-transparent hover:border-indigo-600 pb-1">
                        Finalizar Sesión
                    </button>
                </div>

                {/* Share Achievement Modal */}
                {showShareModal && (
                    <DailyPostShareModal
                        onClose={() => setShowShareModal(false)}
                        onWhatsAppShare={handleWhatsAppShare}
                        onNativeShare={handleNativeShare}
                        onCopyShareText={handleCopyShareText}
                    />
                )}
            </div>
        );
    }

    return null;
};
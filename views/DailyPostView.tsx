import React, { useState, useEffect } from 'react';
import {
    Zap, Copy, CheckCircle2, Sparkles, Palette,
    Megaphone, Check, Flame, ArrowRight, Lightbulb, Share2, ArrowLeft, X, Trophy
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
    { day: 0, theme: "Planificación & Visión", hook: "La semana se gana antes de que empiece...", prompt: "Comparte TU META principal para esta semana.", icon: "🎯" },
    { day: 1, theme: "Mentalidad de Líder", hook: "Lo que veo venir es gigante...", prompt: "Comparte tu VISIÓN sobre el futuro de tu equipo.", icon: "🧠" },
    { day: 2, theme: "Producto & Resultado", hook: "No creerás lo que acaba de pasar...", prompt: "Cuenta un BENEFICIO clave o un testimonio.", icon: "✨" },
    { day: 3, theme: "Estilo de Vida", hook: "Mi oficina de hoy se ve así...", prompt: "Muestra tu LIBERTAD: ¿Dónde estás hoy?", icon: "🌴" },
    { day: 4, theme: "TBT (Historia)", hook: "Hace un año estaba...", prompt: "Muestra tu PROGRESO: ¿Cómo eras antes?", icon: "⏳" },
    { day: 5, theme: "Valor Educativo", hook: "3 cosas que aprendí sobre...", prompt: "Enseña un TIP RÁPIDO de tu industria.", icon: "📚" },
    { day: 6, theme: "Personal & Relax", hook: "Desconectando para reconectar...", prompt: "¿Qué haces para RECARGAR energía?", icon: "🔋" },
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
                            className={`text-[10px] font-black uppercase px-4 py-2 rounded-full transition-all flex items-center gap-2 ${copiedAll ? 'bg-emerald-500 text-white' : 'bg-white/50 border border-white/40 text-slate-500 hover:bg-white animate-icon-pulse'
                                }`}
                        >
                            {copiedAll ? <Check size={14} /> : <Copy size={14} />}
                            {copiedAll ? '¡Copiado!' : 'Copiar Texto'}
                        </button>
                    </div>

                    <div className="prose prose-sm max-w-none relative z-10">
                        <ActionCard text={`${strategy.mainPost}\n\n${strategy.cta}`} hideCopy={true} />
                    </div>
                </div>

                {/* Dynamic Action Area */}
                <div className="mt-8">
                    {!isCompleted && !showFeedback && (
                        <button
                            onClick={handleComplete}
                            disabled={isCompleted}
                            className="w-full py-5 rounded-[24px] font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-200"
                        >
                            <Megaphone size={20} /> Publicar y Ganar Puntos
                        </button>
                    )}

                    {showFeedback && !isCompleted && (
                        <div className="bg-slate-900 p-6 rounded-[32px] text-white text-center animate-in zoom-in slide-in-from-bottom-2 shadow-xl ring-2 ring-indigo-400/20">
                            <p className="font-bold mb-3 text-xl">🚀 ¡Acción Detectada!</p>
                            <p className="text-sm text-slate-300 mb-6">¿Cuál fue el resultado de tu publicación?</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleResult('later')}
                                    className="flex-1 py-4 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors font-black uppercase text-[10px] tracking-widest text-slate-400"
                                >
                                    👀 Visto / Nada
                                </button>
                                <button
                                    onClick={() => handleResult('success')}
                                    className="flex-1 py-4 bg-emerald-500 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:scale-105 transition-all text-white flex items-center justify-center gap-2"
                                >
                                    🔥 ¡Interesado!
                                </button>
                            </div>
                        </div>
                    )}

                    {isCompleted && (
                        <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                            <div className="w-full py-6 rounded-[32px] bg-emerald-500 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl shadow-emerald-200">
                                <CheckCircle2 size={24} /> ¡Día Completado!
                            </div>

                            <button
                                onClick={handleShareResult}
                                className="w-full py-4 rounded-[20px] bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                            >
                                <Share2 size={16} /> Compartir Logro con el Equipo
                            </button>
                        </div>
                    )}
                </div>

                <button onClick={() => { if (onNavigate) onNavigate('HOME', true); }} className="w-full text-center mt-6 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">
                    Volver al Inicio
                </button>

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
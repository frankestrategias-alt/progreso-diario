import React, { useState } from 'react';
import { ShieldCheck, MessageSquareWarning, Loader2, ChevronRight, User, Check, CheckCircle2, Copy, Zap } from 'lucide-react';
import { generateObjectionResponse, ObjectionStrategy } from '../services/geminiService';
import { triggerMagic } from '../utils/magic';
import { ActionCard } from '../components/ActionCard';
import { useAppContext } from '../contexts/AppContext';
import { VoiceInput } from '../components/VoiceInput';
import { SuccessCard } from '../components/SuccessCard';

interface ObjectionViewProps { }

export const ObjectionView: React.FC<ObjectionViewProps> = () => {
    const { goals } = useAppContext();
    const [selectedObjection, setSelectedObjection] = useState<string | null>(null);
    const [customObjection, setCustomObjection] = useState('');
    const [selectedTone, setSelectedTone] = useState('Empático');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<ObjectionStrategy | null>(null);
    const [copied, setCopied] = useState(false);
    const [showSuccessCard, setShowSuccessCard] = useState(false);

    const commonObjections = [
        "No tengo dinero",
        "No tengo tiempo",
        "Es una pirámide",
        "Tengo que consultarlo con mi pareja",
        "No soy bueno vendiendo",
        "Déjame pensarlo"
    ];

    const tones = [
        { name: 'Empático', icon: '🤲', color: 'text-blue-500' },
        { name: 'Firme', icon: '🛡️', color: 'text-slate-700' },
        { name: 'Directo', icon: '🎯', color: 'text-rose-500' }
    ];

    const contextChips = [
        "Duda del producto",
        "Miedo al fracaso",
        "Mala experiencia",
        "Falta de confianza",
        "Escepticismo total"
    ];

    const handleObjectionSubmit = async (obj: string) => {
        setSelectedObjection(obj);
        setLoading(true);
        setResponse(null);

        const result = await generateObjectionResponse(obj, goals.companyName, selectedTone);
        setResponse(result);
        triggerMagic();
        setLoading(false);

        // AUTO-SPEAK: El agente habla la respuesta
        if (result.script) {
            import('../services/geminiService').then(m => m.speak(result.script));
        }
    };

    const handleCopy = () => {
        if (!response) return;
        navigator.clipboard.writeText(response.script);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300 max-w-xl mx-auto pb-10">

            {!response && !loading && (
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[32px] shadow-2xl shadow-amber-100/50 border border-white/40 relative overflow-hidden">
                    {/* Header Badge */}
                    <div className="flex items-center gap-3 mb-6 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                        <span className="text-3xl">🛡️</span>
                        <div>
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Escudo Anti-Excusas</p>
                            <h2 className="text-lg font-black text-amber-900 leading-tight">
                                Manejo de Objeciones
                            </h2>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Step 1: Tone Selection */}
                        <div className="relative">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">
                                1. Selecciona el tono:
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {tones.map((t) => (
                                    <button
                                        key={t.name}
                                        onClick={() => setSelectedTone(t.name)}
                                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${selectedTone === t.name
                                            ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-lg shadow-amber-200/50 scale-105'
                                            : 'bg-white border-slate-100 text-slate-400 opacity-60'}`}
                                    >
                                        <span className="text-xl">{t.icon}</span>
                                        <span className="text-[10px] font-black uppercase tracking-tighter">{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Step 2: Common Objections */}
                        <div className="relative pt-4">
                            <div className="bg-white border-2 border-amber-50 rounded-3xl p-5 relative shadow-sm">
                                <span className="absolute -top-3 left-4 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                    Paso 2
                                </span>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 mb-3">
                                    ¿Qué te dijeron?
                                </p>
                                <div className="grid grid-cols-1 gap-3">
                                    {commonObjections.map((obj) => (
                                        <button
                                            key={obj}
                                            onClick={() => handleObjectionSubmit(obj)}
                                            className="bg-white p-4 rounded-xl border-2 border-slate-100 flex items-center justify-between hover:bg-amber-50 hover:border-amber-200 transition-all text-left group active:scale-98 shadow-sm hover:shadow-md"
                                        >
                                            <span className="font-bold text-slate-700 text-sm group-hover:text-amber-900">{obj}</span>
                                            <ChevronRight size={16} className="text-slate-300 group-hover:text-amber-500" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Custom Input */}
                        <div className="relative">
                            <div className="bg-white border-2 border-amber-50 rounded-3xl p-5 pt-8 relative shadow-sm">
                                <span className="absolute -top-3 left-4 bg-slate-800 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                    O escribe el detalle
                                </span>
                                <div className="flex flex-col gap-5">
                                    {/* Context Chips (Moved Above) */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-slate-400 underline decoration-amber-500/30 underline-offset-4 uppercase tracking-[0.15em] px-1">
                                            Añadir contexto rápido:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {contextChips.map(chip => (
                                                <button
                                                    key={chip}
                                                    onClick={() => setCustomObjection(prev => prev ? `${prev}. ${chip}` : chip)}
                                                    className="text-[10px] font-bold bg-white border border-slate-100 text-slate-600 px-3 py-2 rounded-xl hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all shadow-sm active:scale-95"
                                                >
                                                    + {chip}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <textarea
                                            value={customObjection}
                                            onChange={(e) => setCustomObjection(e.target.value)}
                                            placeholder="Escribe aquí exactamente lo que te dijeron..."
                                            className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[24px] focus:ring-8 focus:ring-amber-500/5 focus:border-amber-400 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-300 h-32 resize-none shadow-inner"
                                        />

                                        {/* Voice Input Floating */}
                                        <div className="absolute right-3 bottom-3 flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter hidden group-focus-within:block animate-in fade-in slide-in-from-right-2">Dictar</span>
                                            <VoiceInput onTranscript={(text) => setCustomObjection(prev => prev ? `${prev} ${text}` : text)} />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleObjectionSubmit(customObjection)}
                                        disabled={!customObjection}
                                        className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black uppercase tracking-tighter disabled:opacity-30 hover:bg-black transition-all shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center gap-1 mt-4 hover:scale-[1.02] active:scale-95 border-t border-white/10 relative overflow-hidden group"
                                    >
                                        {/* Magical Background Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                                        <div className="flex items-center gap-2 relative z-10">
                                            <span className="text-lg">✨</span>
                                            <span className="text-sm font-black tracking-[0.2em]">GENERAR RESPUESTA</span>
                                        </div>

                                        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/5 relative z-10">
                                            <span className="text-[10px] font-bold text-amber-400">MODO:</span>
                                            <span className="text-[10px] font-black text-white tracking-widest uppercase">
                                                {selectedTone} {tones.find(t => t.name === selectedTone)?.icon}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white/40 backdrop-blur-md rounded-[40px] border border-white/50 animate-in fade-in duration-500">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-amber-400 blur-xl opacity-20 animate-pulse"></div>
                        <div className="bg-amber-100 p-6 rounded-full relative">
                            <ShieldCheck className="text-amber-600 animate-bounce" size={40} />
                        </div>
                    </div>
                    <Loader2 className="animate-spin text-amber-500 mb-3" size={28} />
                    <p className="text-amber-900 font-black uppercase tracking-widest text-sm">Preparando Escudo...</p>
                    <p className="text-amber-700/60 text-[10px] mt-2 font-bold px-4 py-1 bg-amber-50 rounded-full animate-pulse uppercase tracking-tighter">
                        Cocinando respuesta "{selectedTone}"
                    </p>
                </div>
            )}

            {response && (
                <div className="animate-in fade-in zoom-in duration-300 px-2">
                    {/* Context Box */}
                    <div className="bg-white border-2 border-slate-100 p-5 rounded-3xl mb-6 relative shadow-sm">
                        <div className="absolute -top-3 left-6 bg-white px-3 py-1 rounded-full border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <User size={12} strokeWidth={3} /> Lo que el prospecto dijo:
                        </div>
                        <p className="text-slate-700 italic font-bold p-1 text-base leading-relaxed">
                            "{selectedObjection || customObjection}"
                        </p>
                    </div>

                    {/* Master Response Bubble (WhatsApp Style) */}
                    <div className="flex flex-col gap-1 items-end mb-6">
                        <div className="bg-emerald-500 text-white p-6 rounded-[28px] rounded-tr-none shadow-xl shadow-emerald-900/10 relative max-w-[95%]">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-white/20 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest">
                                    Respuesta {selectedTone}
                                </span>
                            </div>
                            <div className="text-lg leading-relaxed font-medium">
                                <ActionCard text={response.script} />
                            </div>

                            {/* Tick Marks Mock */}
                            <div className="flex justify-end mt-2 opacity-50">
                                <Check size={14} className="mr-[-8px]" />
                                <Check size={14} />
                            </div>
                        </div>
                    </div>

                    {/* Audio Directive (Voice Coach) - Master Edition */}
                    {response.audioDirective && (
                        <div className="bg-slate-900 rounded-[32px] p-7 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden mb-8 border border-white/10">
                            {/* Sophisticated Glows */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] -ml-8 -mb-8"></div>

                            <div className="flex justify-between items-center mb-6">
                                <div className="flex gap-4 items-center">
                                    <div className="flex gap-1.5 items-center h-8 shrink-0">
                                        {[1, 2, 4, 3, 5, 2, 4].map((h, i) => (
                                            <div
                                                key={i}
                                                className="w-1.5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                                                style={{
                                                    height: `${h * 5}px`,
                                                    animationDuration: `${0.5 + (i * 0.15)}s`
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                    <h4 className="text-emerald-400 text-[11px] font-black uppercase tracking-[0.25em] flex items-center gap-2">
                                        Coach de Postura & Voz
                                    </h4>
                                </div>
                                <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                                    Tip Maestro
                                </span>
                            </div>

                            <div className="relative">
                                <p className="text-white text-lg font-bold italic leading-snug pl-5 border-l-4 border-emerald-500/50 py-2">
                                    "{response.audioDirective}"
                                </p>
                                <p className="text-slate-500 text-[10px] mt-4 font-bold uppercase tracking-widest italic ml-5">
                                    – La psicología detrás del cierre
                                </p>
                            </div>
                        </div>
                    )}

                    {/* PRIMARY ACTION: Generate Victory Card (Viral Hook) */}
                    <div className="mt-4">
                        <button
                            onClick={() => setShowSuccessCard(true)}
                            className="w-full py-5 bg-gradient-to-r from-slate-900 to-indigo-900 text-white rounded-[28px] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] hover:shadow-indigo-500/40 transition-all hover:scale-[1.02] active:scale-95 border-2 border-indigo-500/20"
                        >
                            <Zap size={22} className="text-amber-400 fill-amber-400" />
                            Generar Tarjeta de Victoria 🏆
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            setResponse(null);
                            setSelectedObjection(null);
                            setCustomObjection('');
                        }}
                        className="w-full py-4 text-slate-400 hover:text-amber-600 font-bold text-xs uppercase tracking-[0.2em] transition-all mt-6"
                    >
                        Probar otra respuesta
                    </button>
                </div>
            )}

            {showSuccessCard && response && (
                <SuccessCard
                    objection={selectedObjection || customObjection}
                    response={response.script}
                    onClose={() => setShowSuccessCard(false)}
                />
            )}

        </div>
    );
};
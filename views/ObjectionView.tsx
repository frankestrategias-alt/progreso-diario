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
        "Falta de confianza",
        "Mala experiencia"
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
                    <div className="flex items-center gap-4 mb-8 bg-amber-50 p-6 rounded-[32px] border-2 border-amber-200">
                        <span className="text-4xl">🛡️</span>
                        <div>
                            <h2 className="text-2xl font-black text-amber-900 leading-tight">
                                Biblioteca de Respuestas
                            </h2>
                            <p className="text-sm font-bold text-amber-600 uppercase tracking-widest mt-1">Gana todas las discusiones</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Step 1: Tone Selection */}
                        <div className="relative">
                            <p className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4 px-2">
                                1. ¿Cómo quieres sonar? (Tono)
                            </p>
                            <div className="grid grid-cols-3 gap-4">
                                {tones.map((t) => (
                                    <button
                                        key={t.name}
                                        onClick={() => setSelectedTone(t.name)}
                                        className={`p-5 rounded-[24px] border-4 transition-all flex flex-col items-center gap-2 ${selectedTone === t.name
                                            ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-xl scale-105'
                                            : 'bg-white border-slate-100 text-slate-400 opacity-80'}`}
                                    >
                                        <span className="text-3xl">{t.icon}</span>
                                        <span className="text-xs font-black uppercase tracking-widest">{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Step 2: Common Objections */}
                        <div className="relative pt-6">
                            <div className="bg-slate-50 border-2 border-slate-200 rounded-[40px] p-8 relative shadow-sm">
                                <p className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">
                                    2. ¿Qué te dijo el prospecto?
                                </p>
                                <div className="grid grid-cols-1 gap-4">
                                    {commonObjections.map((obj) => (
                                        <button
                                            key={obj}
                                            onClick={() => handleObjectionSubmit(obj)}
                                            className="bg-white p-6 rounded-[24px] border-2 border-slate-200 flex items-center justify-between hover:bg-amber-50 hover:border-amber-400 transition-all text-left shadow-sm active:scale-98"
                                        >
                                            <span className="font-black text-slate-800 text-lg">{obj}</span>
                                            <div className="bg-slate-100 p-2 rounded-full">
                                                <ChevronRight size={24} className="text-amber-600" strokeWidth={3} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="relative pt-4">
                            <div className="bg-white border-4 border-slate-900/5 rounded-[40px] p-8 relative shadow-inner">
                                <p className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                                    O escribe el detalle aquí:
                                </p>
                                <div className="flex flex-col gap-6">
                                    <div className="relative group">
                                        <textarea
                                            value={customObjection}
                                            onChange={(e) => setCustomObjection(e.target.value)}
                                            placeholder="Ej: 'Me da miedo empezar solo'..."
                                            className="w-full p-6 bg-slate-50 border-2 border-slate-200 rounded-[32px] focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 focus:bg-white transition-all font-bold text-slate-800 text-xl placeholder:text-slate-300 h-40 resize-none"
                                        />
                                        <div className="absolute right-4 bottom-4">
                                            <VoiceInput onTranscript={(text) => setCustomObjection(prev => prev ? `${prev} ${text}` : text)} />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleObjectionSubmit(customObjection)}
                                        disabled={!customObjection}
                                        className="w-full py-8 bg-slate-900 text-white rounded-[32px] font-black uppercase tracking-widest text-lg disabled:opacity-30 hover:bg-black transition-all shadow-xl flex items-center justify-center gap-4 active:scale-95"
                                    >
                                        <Zap size={28} className="text-amber-400 fill-amber-400" />
                                        CREAR RESPUESTA MÁGICA
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
                        <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden mb-8 border-4 border-emerald-500/20">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-emerald-500 p-2 rounded-xl">
                                    <Zap size={24} className="text-white" fill="currentColor" />
                                </div>
                                <h4 className="text-emerald-400 text-sm font-black uppercase tracking-widest">
                                    Consejo de Voz (Tu Coach)
                                </h4>
                            </div>

                            <div className="relative">
                                <p className="text-white text-2xl font-black italic leading-tight">
                                    "{response.audioDirective}"
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
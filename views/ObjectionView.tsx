import React, { useState } from 'react';
import { ShieldCheck, MessageSquareWarning, Loader2, ChevronRight, User } from 'lucide-react';
import { generateObjectionResponse, ObjectionStrategy } from '../services/geminiService';
import { triggerMagic } from '../utils/magic';
import { ActionCard } from '../components/ActionCard';
import { UserGoals } from '../types';
import { VoiceInput } from '../components/VoiceInput';

interface ObjectionViewProps {
    goals: UserGoals;
}

export const ObjectionView: React.FC<ObjectionViewProps> = ({ goals }) => {
    const [selectedObjection, setSelectedObjection] = useState<string | null>(null);
    const [customObjection, setCustomObjection] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<ObjectionStrategy | null>(null);

    const commonObjections = [
        "No tengo dinero",
        "No tengo tiempo",
        "Es una pirámide",
        "Tengo que consultarlo con mi pareja",
        "No soy bueno vendiendo",
        "Déjame pensarlo"
    ];

    const handleObjectionSubmit = async (obj: string) => {
        setSelectedObjection(obj);
        setLoading(true);
        setResponse(null);

        setLoading(true);
        setResponse(null);

        const result = await generateObjectionResponse(obj, goals.companyName);
        setResponse(result);
        triggerMagic();
        setLoading(false);
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">

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
                        {/* Step 1: Common Objections */}
                        <div className="relative">
                            <div className="absolute -left-3 top-6 bottom-0 w-0.5 bg-amber-100 hidden sm:block"></div>
                            <div className="bg-white border-2 border-amber-50 rounded-3xl p-5 relative shadow-sm">
                                <span className="absolute -top-3 left-4 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                    Paso 1
                                </span>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 mb-3">
                                    ¿Qué te dijeron? (Selecciona una)
                                </p>
                                <div className="grid grid-cols-1 gap-3">
                                    {commonObjections.map((obj) => (
                                        <button
                                            key={obj}
                                            onClick={() => handleObjectionSubmit(obj)}
                                            className="bg-white p-4 rounded-xl border border-amber-200/60 flex items-center justify-between hover:bg-amber-50 hover:scale-[1.02] transition-all text-left group shadow-lg shadow-amber-900/10 active:scale-95"
                                        >
                                            <span className="font-bold text-amber-900/80 text-sm group-hover:text-amber-900">{obj}</span>
                                            <ChevronRight size={16} className="text-amber-300 group-hover:text-amber-500 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Custom Input */}
                        <div className="relative">
                            <div className="bg-white border-2 border-amber-50 rounded-3xl p-5 pt-8 relative shadow-sm">
                                <span className="absolute -top-3 left-4 bg-slate-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                    O Escribe la tuya
                                </span>
                                <div className="flex flex-col gap-3">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={customObjection}
                                            onChange={(e) => setCustomObjection(e.target.value)}
                                            placeholder="Ej: Dicen que el producto es muy caro..."
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-300 transition-all font-medium placeholder:text-slate-400"
                                        />
                                        <div className="absolute right-2 top-2">
                                            <VoiceInput onTranscript={(text) => setCustomObjection(prev => prev ? `${prev} ${text}` : text)} />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleObjectionSubmit(customObjection)}
                                        disabled={!customObjection}
                                        className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-slate-900 hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <ShieldCheck size={18} /> Analizar y Responder
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-white/60 backdrop-blur-md rounded-[32px] border border-white/50">
                    <div className="bg-amber-100 p-4 rounded-full mb-4 animate-pulse">
                        <ShieldCheck className="text-amber-600" size={32} />
                    </div>
                    <Loader2 className="animate-spin text-amber-400 mb-2" size={24} />
                    <p className="text-amber-900 font-bold">Analizando la objeción...</p>
                    <p className="text-amber-700/60 text-xs mt-1 font-medium bg-amber-50 px-3 py-1 rounded-full">Buscando el mejor ángulo psicológico</p>
                </div>
            )}

            {response && (
                <div className="animate-in fade-in zoom-in duration-300">
                    {/* Context Box */}
                    <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl mb-6 relative">
                        <div className="absolute -top-3 left-4 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <User size={12} /> Prospecto dijo:
                        </div>
                        <p className="text-slate-700 italic font-medium">
                            "{selectedObjection || customObjection}"
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border-l-4 border-amber-500 overflow-hidden mb-6">
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-2 py-1 rounded-full tracking-widest">
                                    Respuesta Maestra
                                </span>
                                <span className="text-slate-400 text-xs italic">
                                    Tono: {response.tone}
                                </span>
                            </div>

                            <div className="prose prose-sm max-w-none text-slate-800 text-lg leading-relaxed">
                                <ActionCard text={response.script} />
                            </div>
                        </div>

                        {/* Audio Directive (Voice Coach) */}
                        {response.audioDirective && (
                            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white flex gap-4 items-center border-b border-white/10 relative overflow-hidden">
                                {/* Simulated Waveform Animation */}
                                <div className="flex gap-1 items-center h-8 shrink-0 opacity-80">
                                    {[1, 2, 3, 4, 3, 5, 2, 6, 3, 2].map((h, i) => (
                                        <div
                                            key={i}
                                            className="w-1 bg-emerald-400 rounded-full animate-pulse"
                                            style={{
                                                height: `${h * 4}px`,
                                                animationDuration: `${0.5 + (i * 0.1)}s`
                                            }}
                                        ></div>
                                    ))}
                                </div>

                                <div className="relative z-10">
                                    <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                                        Dirección de Voz
                                    </h4>
                                    <p className="text-slate-200 text-sm font-medium italic leading-snug">
                                        "{response.audioDirective}"
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Psychology Section (The "Secret") */}
                        <div className="bg-slate-900 p-5 text-white">
                            <div className="flex items-start gap-3">
                                <div className="bg-amber-500/20 p-2 rounded-lg">
                                    <MessageSquareWarning className="text-amber-400" size={20} />
                                </div>
                                <div>
                                    <h4 className="text-amber-400 text-xs font-black uppercase tracking-widest mb-1">
                                        Psicología Oculta (El ¿Por qué funciona?)
                                    </h4>
                                    <p className="text-slate-300 text-sm italic">
                                        "{response.psychology}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100 mb-6">
                        <p className="text-xs text-blue-700 text-center">
                            💡 <strong>Tip de Entrenamiento:</strong> Lee la respuesta en voz alta 3 veces antes de enviarla. Tu confianza se transmite en el audio.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setResponse(null);
                            setSelectedObjection(null);
                            setCustomObjection('');
                        }}
                        className="w-full py-4 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-bold transition-all shadow-sm"
                    >
                        Responder otra objeción
                    </button>
                </div>
            )}

        </div>
    );
};
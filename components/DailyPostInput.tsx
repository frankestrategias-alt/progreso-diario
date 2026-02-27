import React from 'react';
import { ArrowLeft, Flame, ArrowRight, Sparkles, Copy } from 'lucide-react';
import { VoiceInput } from './VoiceInput';

interface DailyPostInputProps {
    currentStrategy: any;
    customContext: string;
    setCustomContext: React.Dispatch<React.SetStateAction<string>>;
    handleGenerate: () => void;
    loading: boolean;
    onCancel: () => void;
}

export const DailyPostInput: React.FC<DailyPostInputProps> = ({
    currentStrategy,
    customContext,
    setCustomContext,
    handleGenerate,
    loading,
    onCancel
}) => {
    return (
        <div className="max-w-xl mx-auto pt-4 pb-20 animate-in slide-in-from-bottom duration-500 px-4">
            <button onClick={onCancel} className="mb-6 text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
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
};

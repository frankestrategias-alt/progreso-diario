import React from 'react';
import { ArrowLeft, Sparkles, Wand2, Mic, Palette, PenTool, Lightbulb } from 'lucide-react';
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
        <div className="max-w-2xl mx-auto pt-6 pb-24 animate-in fade-in slide-in-from-bottom duration-700 px-2">
            {/* Header / Back */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={onCancel} className="px-4 py-2 bg-slate-100 rounded-full text-slate-500 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-sm">
                    <ArrowLeft size={14} /> Volver
                </button>
                <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
                    <Sparkles size={14} className="text-indigo-500" />
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">IA Generativa Activada</span>
                </div>
            </div>

            {/* MAIN MAGIC CARD */}
            <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(79,70,229,0.15)] border border-slate-100 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500/5 rounded-full blur-[80px]" />

                <div className="p-6 sm:p-10 relative z-10">
                    {/* Strategy Badge */}
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-indigo-200 mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                            {currentStrategy.icon}
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                            {currentStrategy.theme}
                        </h2>
                        <p className="text-sm font-bold text-slate-400 max-w-[280px]">
                            Tu asistente de IA tomará tus ideas y las convertirá en un post de alto impacto.
                        </p>
                    </div>

                    {/* GUIDED INPUT AREA */}
                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100 relative group transition-all duration-300 focus-within:ring-4 focus-within:ring-indigo-100 focus-within:bg-white focus-within:border-indigo-200">

                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg">
                                    <PenTool size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Cuéntanos un poco...</h4>
                                    <p className="text-[10px] font-bold text-slate-400">"{currentStrategy.prompt}"</p>
                                </div>
                            </div>

                            <div className="relative">
                                <textarea
                                    value={customContext}
                                    onChange={(e) => setCustomContext(e.target.value)}
                                    placeholder="Ej: Hoy estuve en un café con Carmen y planeamos cómo cerrar el mes con todo..."
                                    className="w-full bg-transparent border-none p-0 h-32 text-slate-700 focus:ring-0 resize-none text-lg font-bold placeholder:text-slate-300 placeholder:italic placeholder:font-medium"
                                    autoFocus
                                />

                                {/* Voice Shortcut */}
                                <div className="absolute bottom-0 right-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Pulsa para hablar</span>
                                        <VoiceInput onTranscript={(t) => setCustomContext(prev => prev ? `${prev} ${t}` : t)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Inspiration Chips */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-[1px] flex-1 bg-slate-200" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">¿Sin ideas? Prueba una</span>
                                <div className="h-[1px] flex-1 bg-slate-200" />
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {[
                                    { label: 'En un Café ☕', text: 'Tomando un café mientras planeo mi semana de éxito.' },
                                    { label: 'Reunión de Equipo 💻', text: 'En un Zoom épico aprendiendo con los mejores del equipo.' },
                                    { label: 'Mis Metas 🎯', text: 'Anotando mis metas en mi agenda. ¡Voy por todo!' },
                                    { label: 'Nuevo Aliado 🤝', text: 'Dándole la bienvenida a un nuevo líder que se une hoy.' },
                                    { label: 'Momento Relax 🔋', text: 'Pausa necesaria para volver con más fuerza.' }
                                ].map(chip => (
                                    <button
                                        key={chip.label}
                                        onClick={() => setCustomContext(prev => prev ? `${prev} ${chip.text}` : chip.text)}
                                        className="text-[10px] font-black bg-white border-2 border-slate-100 text-slate-500 px-4 py-2 rounded-2xl hover:border-indigo-500/30 hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
                                    >
                                        {chip.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MAGIC ACTION BUTTON */}
                    <div className="mt-10">
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !customContext.trim()}
                            className={`w-full py-5 rounded-[28px] font-black text-white shadow-2xl transition-all flex flex-col items-center justify-center gap-1 uppercase tracking-[0.2em] text-sm relative overflow-hidden group ${loading || !customContext.trim()
                                ? 'bg-slate-200 text-slate-400 scale-[0.98]'
                                : 'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:scale-[1.03] hover:-translate-y-1 active:scale-95 shadow-indigo-300'
                                }`}
                        >
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-sweep duration-1000" />

                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Mezclando Magia...</span>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 relative z-10">
                                        Generar Mi Post Pro <Sparkles size={20} className="text-amber-300 animate-pulse" />
                                    </div>
                                    <span className="text-[9px] opacity-80 normal-case font-bold tracking-widest relative z-10 transition-all group-hover:opacity-100 group-hover:translate-y-0.5">
                                        ¡La Inteligencia Artificial hará el resto!
                                    </span>
                                </>
                            )}
                        </button>

                        <p className="text-center mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {customContext.trim() ? "¡Listo para crear tu obra maestra! ✨" : "Escribe algo arriba para activar la magia ✨"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Hint / Tip */}
            <div className="mt-8 flex items-center gap-4 bg-indigo-50/30 p-5 rounded-[24px] border border-indigo-100/50">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Lightbulb size={18} className="text-amber-500" />
                </div>
                <p className="text-[11px] font-bold text-indigo-900/70 leading-relaxed italic">
                    <span className="font-black text-indigo-900">Consejo Elite:</span> Habla con honestidad. No necesitas ser perfecto, la IA se encargará de darle el toque profesional final.
                </p>
            </div>
        </div>
    );
};

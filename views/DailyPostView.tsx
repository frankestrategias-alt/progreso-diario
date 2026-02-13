import React, { useEffect, useState } from 'react';
import { 
  Camera, Instagram, Megaphone, CheckCircle2, Zap, Loader2, Sparkles, 
  LifeBuoy, Copy, Check, RefreshCw, Palette, Target, Shield, Trophy, 
  Magnet, Lightbulb, MousePointerClick, ArrowRight 
} from 'lucide-react';
import { generateDailyPostIdea, generateHabitMessage, generateRescuePost } from '../services/geminiService';

// --- HELPER: CONFETTI & STYLES ---
const Confetti = () => {
    // Generate static random particles
    const [particles] = useState(() => Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 2 + 's',
        animationDuration: Math.random() * 2 + 2 + 's',
        bg: ['bg-yellow-400', 'bg-purple-500', 'bg-blue-400', 'bg-red-400', 'bg-emerald-400'][Math.floor(Math.random() * 5)]
    })));

    return (
        <>
            <style>
                {`
                @keyframes fall {
                    0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
                .animate-fall {
                    animation: fall linear forwards;
                }
                `}
            </style>
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {particles.map((p) => (
                    <div 
                        key={p.id}
                        className={`absolute w-2 h-2 md:w-3 md:h-3 rounded-sm ${p.bg} animate-fall`}
                        style={{
                            left: p.left,
                            top: '-20px',
                            animationDelay: p.animationDelay,
                            animationDuration: p.animationDuration
                        }}
                    />
                ))}
            </div>
        </>
    );
};

export const DailyPostView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<{hook: string, idea: string, format: string, cta: string} | null>(null);
  const [publishedStatus, setPublishedStatus] = useState<'IDLE' | 'YES' | 'RESCUE'>('IDLE');
  const [wasRescue, setWasRescue] = useState(false);
  const [habitMessage, setHabitMessage] = useState<string>('');
  
  // Rescue State
  const [rescueData, setRescueData] = useState<{type: string, text: string, visual: string, objective: string} | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [copiedRescue, setCopiedRescue] = useState(false);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    setLoading(true);
    const text = await generateDailyPostIdea();
    if (text && text.includes('---')) {
      const parts = text.split('---').map(p => p.trim());
      const clean = (s: string) => s.replace(/^(1\.|2\.|3\.|4\.)\s*.*?:/i, '').trim();
      
      setPlan({
        hook: clean(parts[0] || "Algo interesante..."),
        idea: clean(parts[1] || "Muestra tu estilo de vida."),
        format: clean(parts[2] || "Historia"),
        cta: clean(parts[3] || "Escríbeme.")
      });
    } else {
        setPlan({
            hook: "Error de formato",
            idea: text,
            format: "Historia",
            cta: "Reintenta"
        });
    }
    setLoading(false);
  };

  const handleSuccess = async (fromRescue = false) => {
    setLoadingAction(true);
    // Add artificial delay for anticipation
    await new Promise(r => setTimeout(r, 600));
    
    setWasRescue(fromRescue);
    
    // Scenario changes if it was a Rescue mission
    const scenario = fromRescue ? 'RESCUE_WIN' : 'SUCCESS';
    const message = await generateHabitMessage(scenario);
    
    setHabitMessage(message);
    setPublishedStatus('YES');
    setLoadingAction(false);
  };

  const handleRescueMode = async () => {
    setLoadingAction(true);
    const data = await generateRescuePost();
    setRescueData(data);
    setPublishedStatus('RESCUE');
    setLoadingAction(false);
  };

  const handleCopyRescue = () => {
    if(rescueData) {
        navigator.clipboard.writeText(rescueData.text);
        setCopiedRescue(true);
        setTimeout(() => setCopiedRescue(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-6">
        <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
            <div className="bg-white p-5 rounded-3xl shadow-lg relative z-10 border border-indigo-50">
                <Sparkles className="text-indigo-600 animate-spin-slow" size={40} />
            </div>
        </div>
        <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-slate-700">Diseñando Estrategia...</h3>
            <p className="text-slate-400 text-sm">Analizando tendencias de atracción</p>
        </div>
      </div>
    );
  }

  // --- SUCCESS STATE (ANIMATED) ---
  if (publishedStatus === 'YES') {
    const isRescue = wasRescue;
    const mainColor = isRescue ? 'blue' : 'emerald';
    
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[500px] animate-in zoom-in-95 duration-500 text-center p-6 bg-white rounded-3xl border border-slate-100 shadow-2xl relative overflow-hidden">
            
            <Confetti />

            {/* Rotating Sunburst Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                 <div className={`w-[600px] h-[600px] bg-[conic-gradient(var(--tw-gradient-stops))] ${isRescue ? 'from-blue-500 via-transparent to-blue-500' : 'from-yellow-400 via-transparent to-yellow-400'} animate-[spin_10s_linear_infinite] rounded-full`}></div>
            </div>
            
            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center w-full">
                
                <div className="mb-6 relative">
                    {/* Glowing Backlight */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${isRescue ? 'bg-blue-400' : 'bg-emerald-400'} rounded-full blur-3xl opacity-40 animate-pulse`}></div>
                    
                    {/* Icon */}
                    <div className="animate-[bounce_2s_infinite]">
                        {isRescue ? (
                             <Shield className="text-blue-500 w-32 h-32 drop-shadow-2xl fill-white" strokeWidth={1.5} />
                        ) : (
                             <Trophy className="text-yellow-500 w-32 h-32 drop-shadow-2xl fill-yellow-100" strokeWidth={1.5} />
                        )}
                    </div>

                    {/* Badge */}
                    <div className={`absolute -bottom-2 -right-2 bg-white text-${mainColor}-600 p-2 rounded-full shadow-lg animate-in zoom-in delay-300 duration-500`}>
                        <CheckCircle2 size={32} className={`fill-${mainColor}-100`} />
                    </div>
                </div>

                <h2 className={`text-4xl font-black mb-3 tracking-tight ${isRescue ? 'text-blue-900' : 'text-slate-800'} animate-in slide-in-from-bottom-5 duration-700`}>
                    {isRescue ? "¡RESILIENCIA!" : "¡MISIÓN CUMPLIDA!"}
                </h2>
                
                <div className="mt-2 mb-8 max-w-xs mx-auto animate-in slide-in-from-bottom-5 delay-150 duration-700">
                    <p className="text-slate-600 font-serif italic text-lg leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                        "{habitMessage}"
                    </p>
                </div>

                {isRescue && (
                     <div className="bg-blue-50 border border-blue-100 text-blue-800 px-5 py-3 rounded-full text-sm font-bold mb-8 flex items-center gap-2 animate-in fade-in delay-300">
                        <Zap size={16} className="text-blue-500 fill-blue-500" />
                        <span>Racha Salvada (+XP Doble)</span>
                     </div>
                )}

                <button 
                    onClick={() => setPublishedStatus('IDLE')} 
                    className="mt-4 py-3 px-8 rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 hover:text-slate-800 transition-all flex items-center gap-2 group active:scale-95"
                >
                    Volver al plan
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                </button>
            </div>
        </div>
    );
  }

  // --- RESCUE (VIP MODE) STATE ---
  if (publishedStatus === 'RESCUE' && rescueData) {
    return (
        <div className="flex flex-col h-full animate-in slide-in-from-bottom duration-500 pb-4">
            
            {/* VIP Card Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <div className="bg-slate-900 p-2 rounded-lg text-white">
                        <Zap size={18} fill="currentColor" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 leading-none">Flash Mode</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ejecución Inmediata</p>
                    </div>
                </div>
            </div>

            {/* Dark Mode Card */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl shadow-slate-300 relative overflow-hidden flex-1 flex flex-col justify-between group">
                
                {/* Texture/Noise Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                
                {/* Glows */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl"></div>

                {/* Badge */}
                <div className="relative z-10 flex justify-end">
                    <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-200 border border-white/10 shadow-sm">
                        {rescueData.type}
                    </span>
                </div>

                {/* THE CONTENT */}
                <div className="relative z-10 my-4">
                    <p className="text-2xl font-serif font-medium leading-relaxed text-white/95">
                        {rescueData.text}
                    </p>
                </div>

                {/* Analysis Section */}
                <div className="space-y-3 relative z-10">
                    {/* Objective */}
                    <div className="bg-indigo-900/40 border border-indigo-500/30 p-3 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <Target size={14} className="text-indigo-300" />
                            <span className="text-[10px] uppercase font-bold text-indigo-300">Objetivo Psicológico</span>
                        </div>
                        <p className="text-xs text-indigo-100 font-light italic">
                            "{rescueData.objective}"
                        </p>
                    </div>

                    {/* Visual Instruction */}
                    <div className="flex items-start gap-3 pl-1">
                        <Palette size={16} className="text-fuchsia-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Instrucción Visual</p>
                            <p className="text-xs text-slate-300 font-medium">{rescueData.visual}</p>
                        </div>
                    </div>
                </div>

                {/* Floating Action Buttons inside Card */}
                <div className="flex gap-3 mt-6 relative z-10">
                     <button 
                        onClick={handleCopyRescue}
                        className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 hover:bg-slate-200 shadow-lg"
                    >
                        {copiedRescue ? <Check size={18} className="text-green-600"/> : <Copy size={18} />}
                        {copiedRescue ? 'Copiado' : 'Copiar Texto'}
                    </button>
                    <button 
                        onClick={() => handleRescueMode()}
                        className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border border-white/10 active:rotate-180 duration-500"
                        title="Generar otra opción"
                        disabled={loadingAction}
                    >
                        <RefreshCw size={20} className={loadingAction ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Bottom Complete Button */}
            <div className="mt-4 px-2">
                <button 
                    onClick={() => handleSuccess(true)} 
                    className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    {loadingAction ? <Loader2 className="animate-spin" /> : <Trophy size={20} className="text-emerald-100" />}
                    {loadingAction ? 'Guardando...' : 'Completar Misión Flash'}
                </button>
                 <button 
                    onClick={() => setPublishedStatus('IDLE')}
                    className="w-full text-center text-slate-400 text-xs mt-3 underline hover:text-slate-600"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
  }

  // --- DEFAULT PLAN STATE (BLUEPRINT) ---
  return (
    <div className="space-y-5 animate-in slide-in-from-right duration-500 pb-10">
      
      {/* Header with Date */}
      <div className="flex items-center justify-between px-1">
        <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Estrategia Viral</h2>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
            </p>
        </div>
        <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-200">
            <Megaphone size={20} fill="currentColor" className="text-white/20" stroke="white" />
        </div>
      </div>

      {/* The Blueprint Card */}
      {plan && (
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 relative group">
            
            {/* Format Tag */}
            <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-wider z-10 flex items-center gap-1.5">
                <Camera size={12} />
                {plan.format}
            </div>

            <div className="p-1">
                {/* 1. THE HOOK (Hero Section) */}
                <div className="bg-gradient-to-br from-indigo-50 to-white p-6 pb-8 rounded-t-[1.8rem]">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
                            <Magnet size={16} />
                        </div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Gancho de Atención</span>
                    </div>
                    <p className="text-2xl font-serif font-bold text-slate-800 leading-tight">
                        "{plan.hook}"
                    </p>
                </div>

                {/* 2. THE CORE IDEA (Middle) */}
                <div className="px-6 -mt-4 relative z-10">
                    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="bg-amber-100 p-1.5 rounded-lg text-amber-600">
                                <Lightbulb size={16} />
                            </div>
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Contenido de Valor</span>
                        </div>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">
                            {plan.idea}
                        </p>
                    </div>
                </div>

                {/* 3. THE CTA (Bottom) */}
                <div className="p-6 pt-4">
                     <div className="flex items-center gap-2 mb-2 ml-1">
                        <MousePointerClick size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Llamada a la Acción</span>
                    </div>
                    <div className="bg-emerald-50/50 border-l-4 border-emerald-400 pl-4 py-2 rounded-r-xl">
                        <p className="text-lg font-bold text-slate-700">
                            {plan.cta}
                        </p>
                    </div>
                </div>
            </div>
          </div>
      )}

      {/* Action Dock */}
      <div className="pt-2">
        {loadingAction ? (
             <div className="flex justify-center py-6"><Loader2 className="animate-spin text-indigo-500" /></div>
        ) : (
            <div className="flex gap-3">
                {/* Rescue Button (Left) */}
                <button 
                    onClick={() => handleRescueMode()}
                    className="group relative overflow-hidden bg-slate-800 text-white p-4 rounded-2xl font-bold transition-all active:scale-95 flex-none w-1/3 flex flex-col items-center justify-center gap-1 shadow-lg shadow-slate-300"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/50 to-purple-600/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <LifeBuoy size={22} className="relative z-10 text-indigo-200 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-[10px] uppercase font-bold tracking-wider relative z-10 text-indigo-100">Flash</span>
                </button>

                {/* Success Button (Right - Main) */}
                <button 
                    onClick={() => handleSuccess(false)}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200 active:scale-95 flex items-center justify-between group border-b-4 border-emerald-700 hover:border-emerald-600 active:border-b-0 active:translate-y-1"
                >
                    <div className="text-left">
                        <span className="block text-xs font-medium text-emerald-100 mb-0.5">Misión Cumplida</span>
                        <span className="block text-lg">Ya Publiqué</span>
                    </div>
                    <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors">
                        <Check size={24} />
                    </div>
                </button>
            </div>
        )}
        
        <p className="text-[10px] text-center text-slate-400 mt-4 font-medium tracking-wide">
            "La consistencia vence al talento."
        </p>
      </div>

    </div>
  );
};
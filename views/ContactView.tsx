import React, { useState } from 'react';
import { Sparkles, Flame, CheckCircle2 } from 'lucide-react';
import { triggerMagic } from '../utils/magic';
import { generateContactScript } from '../services/geminiService';
import { ActionCard } from '../components/ActionCard';
import { UserGoals } from '../types';
import { VoiceInput } from '../components/VoiceInput';

interface ContactViewProps {
  onRecordAction: () => void;
  goals: UserGoals;
}

export const ContactView: React.FC<ContactViewProps> = ({ onRecordAction, goals }) => {
  const [context, setContext] = useState('');
  const [platform, setPlatform] = useState('WhatsApp');
  const [tone, setTone] = useState('Amable');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!context.trim()) return;
    setLoading(true);
    setResults([]);

    // We use a professional yet friendly default tone
    const response = await generateContactScript(context, platform, tone, goals.companyName);
    const scripts = response.split('---').map(s => s.trim()).filter(s => s.length > 0);

    setResults(scripts);
    triggerMagic();
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      {/* Inline Styles for Custom Animations */}
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 1.5s infinite linear;
          }
          @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 2s ease infinite;
          }
        `}
      </style>

      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[32px] shadow-2xl shadow-emerald-100/50 border border-white/40 relative overflow-hidden">
        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-6 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
          <span className="text-3xl">✨</span>
          <div>
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Generador de Invitaciones</p>
            <h2 className="text-lg font-black text-emerald-900 leading-tight">
              Crear Invitación Irresistible
            </h2>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Context */}
          <div className="relative">
            <div className="absolute -left-3 top-6 bottom-0 w-0.5 bg-emerald-100 hidden sm:block"></div>
            <div className="bg-white border-2 border-emerald-50 rounded-3xl p-5 relative shadow-sm">
              <span className="absolute -top-3 left-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                Paso 1
              </span>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                ¿A quién vas a invitar? (Nombre y Perfil)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Ej: Amigo del gimnasio, Ex-compañero, Primo lejano..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all font-medium placeholder:text-slate-400"
                />
                <div className="absolute right-2 top-2">
                  <VoiceInput onTranscript={(text) => setContext(prev => prev ? `${prev} ${text}` : text)} />
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Platform */}
          <div className="relative">
            <div className="bg-white border-2 border-emerald-50 rounded-3xl p-5 relative shadow-sm">
              <span className="absolute -top-3 left-4 bg-slate-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                Paso 2
              </span>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Plataforma
              </label>
              <div className="flex gap-2 flex-wrap">
                {['WhatsApp', 'Instagram', 'Messenger', 'En Persona'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all border-2 ${platform === p
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-inner'
                      : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-100 hover:text-emerald-600'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Spicy Mode Toggle */}
          <div className="bg-gradient-to-r from-slate-50 to-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center justify-between group cursor-pointer transition-all hover:shadow-orange-100 hover:shadow-lg" onClick={() => setTone(prev => prev === 'Picante' ? 'Amable' : 'Picante')}>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full transition-colors ${tone === 'Picante' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                <Flame size={20} className={tone === 'Picante' ? 'animate-pulse' : ''} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">¿Nivel de Osadía?</p>
                <p className={`text-sm font-bold ${tone === 'Picante' ? 'text-orange-600' : 'text-slate-600'}`}>
                  {tone === 'Picante' ? '🔥 MODO PICANTE (Directo)' : '😌 MODO ZEN (Amable)'}
                </p>
              </div>
            </div>

            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${tone === 'Picante' ? 'bg-orange-500' : 'bg-slate-300'}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${tone === 'Picante' ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!context || loading}
            className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl transition-all relative overflow-hidden group uppercase tracking-widest text-sm ${loading
              ? 'bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 animate-gradient-x text-white cursor-wait'
              : !context
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 shadow-emerald-200'
              }`}
          >
            {loading ? <Sparkles className="animate-spin" size={20} /> : <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />}
            {loading ? 'Cocinando Invitación...' : '¡Crear Invitación!'}
          </button>
        </div>
      </div>

      {/* SKELETON LOADER (Shown during loading) */}
      {loading && (
        <div className="space-y-4 mt-6">
          <h3 className="text-xs font-black text-emerald-500/50 uppercase tracking-widest mb-3 ml-1 animate-pulse flex items-center gap-2">
            <Sparkles size={14} /> Analizando perfil...
          </h3>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm relative overflow-hidden h-24">
              {/* Background Structure */}
              <div className="space-y-3 opacity-50">
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                <div className="h-2 bg-slate-100 rounded w-full"></div>
                <div className="h-2 bg-slate-100 rounded w-5/6"></div>
              </div>
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full animate-shimmer" style={{ animationDelay: `${i * 0.1}s` }}></div>
            </div>
          ))}
        </div>
      )}

      {/* RESULTS */}
      {!loading && results.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500" /> Opciones Listas
          </h3>
          <div className="space-y-4">
            {results.map((script, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden group hover:border-emerald-200 transition-colors">
                <div className="p-1">
                  <ActionCard
                    text={script}
                    onCopy={onRecordAction}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-6 font-medium uppercase tracking-widest opacity-60">
            El objetivo es abrir la puerta, no tirar la pared.
          </p>
        </div>
      )}
    </div>
  );
};
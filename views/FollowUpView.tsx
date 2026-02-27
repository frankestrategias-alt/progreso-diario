import React, { useState } from 'react';
import { Send, Clock, Loader2, ThumbsUp, Bell, Calendar, CheckCircle, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerMagic } from '../utils/magic';
import { generateFollowUpScript } from '../services/geminiService';
import { ActionCard } from '../components/ActionCard';
import { useAppContext } from '../contexts/AppContext';
import { VoiceInput } from '../components/VoiceInput';

interface FollowUpViewProps {
  onRecordAction: () => void;
  onNavigate?: (view: any) => void;
}

export const FollowUpView: React.FC<FollowUpViewProps> = ({ onRecordAction, onNavigate }) => {
  const { goals } = useAppContext();
  const [lastInteraction, setLastInteraction] = useState('');
  const [timeAgo, setTimeAgo] = useState('3 días');
  const [interest, setInterest] = useState('Medio');
  const [tone, setTone] = useState('Profesional');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Analizando contexto...');
  const [results, setResults] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  // Reminder State
  const [showReminder, setShowReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderSet, setReminderSet] = useState(false);

  const handleResult = (result: 'success' | 'later') => {
    if (result === 'success') {
      triggerMagic();
      alert("¡Esa es la actitud! 🔥 Sigue sembrando.");
      if (onNavigate) onNavigate('HOME', true);
    }
    setShowFeedback(false);
  };

  const handleGenerate = async () => {
    if (!lastInteraction.trim()) return;
    setLoading(true);
    setResults([]);
    setShowFeedback(false);

    const steps = ['Analizando contexto...', 'Diseñando estrategia...', 'Redactando mensajes...', 'Aplicando persuasión...'];
    let stepIndex = 0;
    const interval = setInterval(() => {
      setLoadingText(steps[stepIndex % steps.length]);
      stepIndex++;
    }, 800);

    try {
      const response = await generateFollowUpScript(lastInteraction, timeAgo, interest, tone, goals.companyName);
      const scripts = response.split('---').map(s => s.trim()).filter(s => s.length > 0);
      setResults(scripts);

      // Magic Feedback
      triggerMagic();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ffffff'] // Indigo/Purple theme
      });
    } catch (e) {
      console.error(e);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleSetReminder = async () => {
    if (!reminderDate || !reminderTime) {
      alert("📅 Por favor, elige cuándo quieres hacer la magia.");
      return;
    }

    // 1. ADD TO TASK TRACKER (LocalStorage Sync)
    const taskName = lastInteraction
      ? `Seguimiento: ${lastInteraction.substring(0, 25)}${lastInteraction.length > 25 ? '...' : ''} (${reminderTime})`
      : `Seguimiento Agendado (${reminderTime})`;

    const newTask = {
      id: Date.now().toString(),
      name: taskName,
      completed: false
    };

    try {
      const existing = JSON.parse(localStorage.getItem('dailyTasks') || '[]');
      localStorage.setItem('dailyTasks', JSON.stringify([...existing, newTask]));
    } catch (e) { console.error(e); }

    // 2. MAGIC FEEDBACK
    // 2. MAGIC FEEDBACK
    triggerMagic();

    setReminderSet(true);

    // Notification API (Best Effort)
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setTimeout(() => new Notification("🔔 Recordatorio Guardado", { body: taskName }), 200);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  };

  const HelperChip = ({ label, active, onClick, colorClass = "blue" }: any) => (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border shadow-sm flex-1 text-center whitespace-nowrap
        ${active
          ? `bg-${colorClass}-50 text-${colorClass}-700 border-${colorClass}-200 ring-2 ring-${colorClass}-100`
          : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-slate-700'
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">

      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 1.5s infinite linear;
          }
          @keyframes gradient-blue {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-blue {
            background-size: 200% 200%;
            animation: gradient-blue 2s ease infinite;
          }
        `}
      </style>

      {/* INPUT SECTION */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[32px] shadow-2xl shadow-indigo-100/50 border border-white/40 relative overflow-hidden">

        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-6 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
          <span className="text-3xl">🤝</span>
          <div>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Estrategia de Seguimiento</p>
            <h2 className="text-lg font-black text-indigo-900 leading-tight">
              Retoma la Conversación
            </h2>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Context */}
          <div className="relative">
            <div className="absolute -left-3 top-6 bottom-0 w-0.5 bg-indigo-100 hidden sm:block"></div>
            <div className="bg-white border-2 border-indigo-50 rounded-3xl p-5 relative shadow-sm">
              <span className="absolute -top-3 left-4 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                Paso 1
              </span>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex justify-between items-center">
                <span>¿Qué hablaron antes?</span>
                <VoiceInput onTranscript={(text: string) => setLastInteraction(prev => prev ? `${prev} ${text}` : text)} />
              </label>
              <textarea
                value={lastInteraction}
                onChange={(e) => setLastInteraction(e.target.value)}
                placeholder="Ej: Le envié el video hace 2 días, tenía dudas sobre el precio..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all placeholder:text-slate-400 text-slate-700 min-h-[100px] resize-none text-base font-medium"
              />

              {/* Context Chips - Follow Up Speed */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: '📺 Vio el Video', text: 'Vio el video de presentación pero no hemos agendado el cierre.' },
                  { label: '❓ Dudas Precio', text: 'Me preguntó sobre los costos y la inversión inicial.' },
                  { label: '💤 No Responde', text: 'Le envié info hace días y me dejó en "visto".' },
                  { label: '🤝 Interesado', text: 'Dijo que le gusta pero tiene miedo de no tener tiempo.' },
                  { label: '🏁 Cierre Pendiente', text: 'Quedamos en hablar hoy para tomar una decisión final.' }
                ].map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => setLastInteraction(prev => prev ? `${prev}. ${chip.text}` : chip.text)}
                    className="text-[10px] font-black bg-white border border-indigo-100 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-sm"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Details Grid */}
          <div className="relative">
            <div className="bg-white border-2 border-indigo-50 rounded-3xl p-5 relative shadow-sm">
              <span className="absolute -top-3 left-4 bg-slate-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                Paso 2
              </span>

              <div className="space-y-4">
                {/* Time Input */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hace cuánto fue</label>
                  <div className="flex flex-wrap gap-2">
                    {['1 día', '3 días', '1 semana', '+2 semanas'].map(t => (
                      <HelperChip
                        key={t}
                        label={t}
                        active={timeAgo === t}
                        onClick={() => setTimeAgo(t)}
                        colorClass="indigo"
                      />
                    ))}
                  </div>
                </div>

                {/* Interest Grid (Full Width) */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nivel de Interés</label>
                  <div className="flex gap-2">
                    {['Alto', 'Medio', 'Bajo'].map(i => (
                      <HelperChip
                        key={i}
                        label={i}
                        active={interest === i}
                        onClick={() => setInterest(i)}
                        colorClass={i === 'Alto' ? 'emerald' : i === 'Bajo' ? 'rose' : 'amber'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!lastInteraction || loading}
            className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl transition-all duration-300 relative overflow-hidden group uppercase tracking-widest text-sm ${loading
              ? 'bg-slate-100 text-slate-400 cursor-wait'
              : !lastInteraction
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-[length:200%_auto] hover:bg-[position:100%_0] text-white shadow-indigo-200/50 hover:shadow-indigo-300/60 hover:-translate-y-0.5 active:scale-95'
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin text-indigo-500" size={18} />
                <span className="animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">{loadingText}</span>
              </>
            ) : (
              <>
                <Sparkles size={18} className={lastInteraction ? "text-yellow-200 animate-pulse" : ""} />
                <span className="relative z-10">Revelar Estrategia Mágica</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none skew-y-12"></div>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SKELETON LOADER */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden h-28">
              <div className="space-y-3">
                <div className="flex gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                  <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                  <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                </div>
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                <div className="h-10 w-full mt-4 bg-slate-50 rounded-lg"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" style={{ animationDelay: `${i * 0.15}s` }}></div>
            </div>
          ))}
        </div>
      )}

      {/* RESULTS DISPLAY (NOW ABOVE REMINDER) */}
      {!loading && results.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              3 Opciones de Seguimiento
            </h3>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
              3 Variaciones
            </span>
          </div>

          <div className="grid gap-4">
            {results.map((script, idx) => (
              <div key={idx} className="animate-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
                <ActionCard
                  text={script}
                  onCopy={() => {
                    onRecordAction();
                    setShowFeedback(true);
                  }}
                />
              </div>
            ))}
          </div>

          {!showFeedback ? (
            <div className="text-center p-2">
              <p className="text-xs text-slate-400 animate-pulse">Copia un mensaje para registrar la acción</p>
            </div>
          ) : (
            <div className="bg-slate-900 p-4 rounded-2xl text-white text-center animate-in zoom-in slide-in-from-bottom-2 shadow-xl ring-2 ring-emerald-400/20">
              <p className="font-bold mb-3 text-lg">🚀 ¡Acción Detectada!</p>
              <p className="text-sm text-slate-300 mb-4">¿Cuál fue el resultado?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleResult('later')}
                  className="flex-1 py-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors font-medium text-slate-300"
                >
                  👀 Visto / Nada
                </button>
                <button
                  onClick={() => handleResult('success')}
                  className="flex-1 py-3 bg-emerald-500 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:scale-105 transition-all text-white flex items-center justify-center gap-2"
                >
                  🔥 ¡Interesado!
                </button>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
            <AlertCircle className="shrink-0 text-blue-500" size={20} />
            <p>
              <strong className="font-bold">Pro Tip:</strong> La fortuna está en el seguimiento. No tengas miedo de ser "pesado" si tu intención es ayudar genuinamente.
            </p>
          </div>
        </div>
      )}

      {/* MAGICAL REMINDER CARD (NOW BELOW RESULTS) */}
      <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-[24px] border border-indigo-100 p-1 relative overflow-hidden shadow-lg shadow-indigo-100/50 group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 opacity-30"></div>

        <div className="bg-white/60 backdrop-blur-md rounded-[20px] p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600 group-hover:scale-110 transition-transform duration-300">
              <Bell size={20} className="fill-indigo-200" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-sm">No lo dejes a la suerte 🍀</h3>
              <p className="text-xs text-slate-500">Programa el éxito de este seguimiento</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Calendar size={14} className="text-indigo-400" />
              </div>
              <input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full pl-9 p-3 bg-white border border-indigo-50 rounded-xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all"
              />
            </div>
            <div className="relative w-32">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Clock size={14} className="text-indigo-400" />
              </div>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full pl-9 p-3 bg-white border border-indigo-50 rounded-xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleSetReminder}
            disabled={reminderSet}
            className={`w-full mt-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${reminderSet
              ? 'bg-green-100 text-green-700 border border-green-200 shadow-none'
              : 'bg-slate-900 text-white shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-95'
              }`}
          >
            {reminderSet ? (
              <>
                <CheckCircle size={16} className="text-green-600" />
                ¡Agendado & Guardado!
              </>
            ) : (
              <>
                <Bell size={16} />
                Programar Recordatorio
              </>
            )}
          </button>
        </div>
      </div>

    </div >
  );
};
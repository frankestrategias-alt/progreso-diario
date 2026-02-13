import React, { useState } from 'react';
import { Send, Clock, Loader2, ThumbsUp, Bell, Calendar, CheckCircle } from 'lucide-react';
import { generateFollowUpScript } from '../services/geminiService';
import { ActionCard } from '../components/ActionCard';

interface FollowUpViewProps {
  onRecordAction: () => void;
}

export const FollowUpView: React.FC<FollowUpViewProps> = ({ onRecordAction }) => {
  const [lastInteraction, setLastInteraction] = useState('');
  const [timeAgo, setTimeAgo] = useState('3 días');
  const [interest, setInterest] = useState('Medio');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  // Reminder State
  const [showReminder, setShowReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderSet, setReminderSet] = useState(false);

  const handleGenerate = async () => {
    if (!lastInteraction.trim()) return;
    setLoading(true);
    setResults([]);
    
    const response = await generateFollowUpScript(lastInteraction, timeAgo, interest);
    const scripts = response.split('---').map(s => s.trim()).filter(s => s.length > 0);
    
    setResults(scripts);
    setLoading(false);
  };

  const handleSetReminder = () => {
    if (!reminderDate || !reminderTime) {
      alert("Por favor selecciona fecha y hora.");
      return;
    }

    const scheduledTime = new Date(`${reminderDate}T${reminderTime}`);
    const now = new Date();
    const timeUntil = scheduledTime.getTime() - now.getTime();

    if (timeUntil < 0) {
      alert("La fecha debe ser en el futuro.");
      return;
    }

    // Visual feedback
    setReminderSet(true);
    setTimeout(() => setReminderSet(false), 3000);

    // Simulation of notification
    alert(`✅ Recordatorio establecido para el ${scheduledTime.toLocaleString()}\n\n(Nota: Mantén esta pestaña abierta para recibir la alerta simulada)`);

    setTimeout(() => {
      alert(`🔔 ¡RECORDATORIO DE SEGUIMIENTO!\n\nContexto: ${lastInteraction}\n\n¡Es hora de contactar a tu prospecto!`);
    }, timeUntil);
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

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="text-blue-500" size={20} />
          Datos del Seguimiento
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">¿Qué hablaron la última vez?</label>
            <input 
              type="text" 
              value={lastInteraction}
              onChange={(e) => setLastInteraction(e.target.value)}
              placeholder="Ej: Vio el video de presentación, probó el producto..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Tiempo pasado</label>
                <select 
                    value={timeAgo}
                    onChange={(e) => setTimeAgo(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                    <option>1 día</option>
                    <option>3 días</option>
                    <option>1 semana</option>
                    <option>+2 semanas</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Interés previo</label>
                <select 
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                    <option>Alto</option>
                    <option>Medio</option>
                    <option>Bajo</option>
                    <option>Indeciso</option>
                </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!lastInteraction || loading}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all relative overflow-hidden ${
              loading 
              ? 'bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-400 animate-gradient-blue text-white' 
              : !lastInteraction 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            }`}
          >
            {loading ? <Clock className="animate-spin" size={20}/> : <Send size={20} />}
            {loading ? 'Redactando...' : 'Crear Seguimiento'}
          </button>
        </div>

        {/* Reminder Section */}
        <div className="mt-6 pt-5 border-t border-slate-100">
            <button 
                onClick={() => setShowReminder(!showReminder)}
                className="flex items-center gap-2 text-slate-500 font-medium hover:text-blue-600 transition-colors text-sm w-full"
            >
                <Bell size={16} className={showReminder ? "fill-blue-100 text-blue-500" : ""} />
                {showReminder ? 'Ocultar Recordatorio' : 'Establecer Recordatorio'}
            </button>

            {showReminder && (
                <div className="mt-4 bg-slate-50 p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-3 mb-3">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Fecha</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                                <input 
                                    type="date" 
                                    value={reminderDate}
                                    onChange={(e) => setReminderDate(e.target.value)}
                                    className="w-full pl-10 p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                                />
                            </div>
                        </div>
                        <div className="w-1/3">
                            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Hora</label>
                            <input 
                                type="time" 
                                value={reminderTime}
                                onChange={(e) => setReminderTime(e.target.value)}
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={handleSetReminder}
                        disabled={reminderSet}
                        className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                            reminderSet 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-white border border-slate-300 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                        }`}
                    >
                        {reminderSet ? (
                            <>
                                <CheckCircle size={16} /> Recordatorio Activo
                            </>
                        ) : (
                            <>
                                Programar Alerta
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* SKELETON LOADER */}
      {loading && (
        <div className="space-y-4 mt-6">
             <h3 className="text-sm font-bold text-blue-500/50 uppercase tracking-wider mb-3 ml-1 animate-pulse">
                Diseñando estrategia...
            </h3>
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden h-24">
                    <div className="space-y-3">
                        <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                        <div className="h-3 bg-slate-50 rounded w-full"></div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-shimmer" style={{ animationDelay: `${i * 0.15}s` }}></div>
                </div>
            ))}
        </div>
      )}

      {/* RESULTS */}
      {!loading && results.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Mensajes Sugeridos</h3>
          {results.map((script, idx) => (
            <ActionCard 
                key={idx} 
                text={script} 
                onCopy={onRecordAction}
            />
          ))}
           <p className="text-xs text-center text-slate-400 mt-4">
            La fortuna está en el seguimiento. Mantén la postura profesional.
          </p>
        </div>
      )}

    </div>
  );
};
import React, { useEffect, useState } from 'react';
import {
  Target, Save, Trophy, Share2, Copy,
  CheckCircle2, Rocket, ArrowRight, X, ShieldCheck, Briefcase
} from 'lucide-react';
import { triggerMagic } from '../utils/magic';
import { UserGoals } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { generateDailyMotivation } from '../services/geminiService';
import { generateDuplicationLink } from '../services/duplicationService';
import { DuplicationModal } from '../components/DuplicationModal';

interface GoalsViewProps { }

export const GoalsView: React.FC<GoalsViewProps> = () => {
  const { goals, setGoals, progress } = useAppContext();
  const [localGoals, setLocalGoals] = useState<UserGoals>(goals);
  const [motivation, setMotivation] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    generateDailyMotivation(goals, progress).then(setMotivation);
  }, [goals, progress]);

  // Sync local goals when global goals change (e.g. via duplication modal)
  useEffect(() => {
    setLocalGoals(goals);
  }, [goals]);

  const handleSave = () => {
    setGoals(localGoals);
    setIsEditing(false);
    triggerMagic();
  };

  const handleFinalShare = () => {
    const link = generateDuplicationLink(goals);

    const branding = goals.companyName?.trim()
      ? `📈 *Protocolo de Duplicación: ${goals.companyName.toUpperCase()}* 🚀`
      : `🚀 *Protocolo de Duplicación Networker Pro* 🚀`;

    const leaderName = goals.sponsorName?.trim() ? ` de ${goals.sponsorName}` : ' del Líder';

    const shortText = `${branding}\n\n🎯 *Estrategia${leaderName}:*\n✅ Contactos: ${goals.dailyContacts}\n✅ Seguimientos: ${goals.dailyFollowUps}\n\n🏆 *Reto del Mes:*\n"${goals.teamChallenge || '¡Vamos por todo!'}"\n\n📲 *Instala mi sistema en 1 clic aquí:*\n${link}`;

    setCopied(true);
    setShowPreview(false);

    const waUrl = `https://wa.me/?text=${encodeURIComponent(shortText)}`;

    setTimeout(() => {
      window.location.href = waUrl;
      setCopied(false);
    }, 800);

    try {
      navigator.clipboard.writeText(`${shortText}`);
    } catch (e) { }
  };

  const isConfigured = !!goals.companyName &&
    goals.companyName.trim().length > 0 &&
    goals.companyName.trim() !== 'Independiente';

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">

      {/* Motivation Card (Always visible) */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-800 p-6 rounded-[32px] text-white shadow-xl relative overflow-hidden">
        <Trophy className="absolute -bottom-2 -right-2 text-white/10 rotate-12" size={100} />
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-indigo-100">Visión de Líder</p>
          <p className="text-xl italic font-medium leading-tight">"{motivation || 'Diseñando tu próximo salto...'}"</p>
        </div>
      </div>

      {/* STRATEGY DASHBOARD (The "Black Window") */}
      <div className="bg-slate-900 rounded-[var(--radius-premium)] p-8 text-white premium-card-shadow relative overflow-hidden border border-white/5 transition-all duration-500 hover:border-indigo-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] -mr-32 -mt-32"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Marca / Compañía</p>
              <h3 className={`font-black tracking-wider uppercase ${goals.companyName ? 'text-sm text-white' : 'text-[13px] text-slate-500'}`}>
                {goals.companyName || 'Ej: Compañía / Equipo'}
              </h3>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 animate-soft-pulse"
            >
              ✎ Editar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="flex flex-col">
              <div className="min-h-[20px] flex items-end">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight">Meta de Contactos</p>
              </div>
              <p className="text-2xl font-black text-white mt-1">{goals.dailyContacts}</p>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (progress.contactsMade / goals.dailyContacts) * 100)}%` }}></div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="min-h-[20px] flex items-end">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight">Meta de Seguimientos</p>
              </div>
              <p className="text-2xl font-black text-white mt-1">{goals.dailyFollowUps}</p>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (progress.followUpsMade / goals.dailyFollowUps) * 100)}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-[24px] p-5">
            <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-2 flex items-center gap-2">
              <ShieldCheck size={12} /> Reto del Equipo
            </p>
            <p className="text-sm font-bold text-slate-200 leading-relaxed italic">
              "{goals.teamChallenge || '¡Vamos por tu siguiente nivel!'}"
            </p>
          </div>
        </div>
      </div>

      {/* DUPLICATION SECTION (Elite Emerald state) */}
      <div className={`rounded-[var(--radius-premium)] p-8 text-white shadow-2xl relative overflow-hidden transition-all duration-700 border border-white/10 ${isConfigured ? 'bg-emerald-600 premium-glow-emerald' : 'bg-slate-800'}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -mr-24 -mt-24"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-2xl shadow-lg transition-all duration-500 ${isConfigured ? 'bg-white text-emerald-600 rotate-12 scale-110' : 'bg-indigo-500 text-white shadow-indigo-500/40'}`}>
              <Share2 size={22} />
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isConfigured ? 'text-emerald-100' : 'text-indigo-400'}`}>Protocolo de Duplicación</p>
              <h4 className="text-xl font-black tracking-tight uppercase">Duplica tu Éxito</h4>
            </div>
          </div>

          <button
            onClick={() => {
              if (!isConfigured) {
                alert('¡Firma tu éxito! 💥 Define tu marca real para que se duplique tu grandeza.');
                setIsEditing(true);
                return;
              }
              setShowPreview(true);
            }}
            className={`w-full py-5 rounded-[24px] font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl ring-2 ring-white/10 ${copied
              ? 'bg-white text-emerald-600'
              : isConfigured
                ? 'bg-emerald-400 text-white shadow-emerald-500/40 animate-ready'
                : 'bg-white text-slate-900 hover:bg-slate-50'
              }`}
          >
            {copied ? (
              <><CheckCircle2 size={20} className="animate-bounce" /> ¡LANZANDO...!</>
            ) : (
              <>{isConfigured ? <Rocket size={20} /> : <ShieldCheck size={20} />} {isConfigured ? '¡COMPARTIR MI VISIÓN AHORA!' : 'FIRMA TU ÉXITO PRIMERO'}</>
            )}
          </button>

          <p className={`text-center text-[10px] mt-6 font-black uppercase tracking-[0.25em] transition-opacity duration-700 ${isConfigured ? 'text-emerald-200 opacity-100' : 'text-white/20'}`}>
            {isConfigured ? `🚀 SISTEMA ACTIVADO: ${goals.companyName?.toUpperCase()}` : '⚠️ PERSONALIZA TU MARCA PARA ACTIVAR'}
          </p>
        </div>
      </div>

      {/* EDIT MODAL (The "Emerging Window") */}
      {isEditing && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 pb-4 flex justify-between items-center bg-slate-50 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-800">Mi Estrategia Pro</h3>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">Configuración de Élite</p>
              </div>
              <button onClick={() => setIsEditing(false)} className="p-2 bg-slate-200 text-slate-500 rounded-full hover:bg-slate-300">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Contactos Hoy</label>
                  <input
                    type="number"
                    value={localGoals.dailyContacts}
                    onChange={(e) => setLocalGoals({ ...localGoals, dailyContacts: parseInt(e.target.value) || 0 })}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 transition-all font-black text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Seguimientos</label>
                  <input
                    type="number"
                    value={localGoals.dailyFollowUps}
                    onChange={(e) => setLocalGoals({ ...localGoals, dailyFollowUps: parseInt(e.target.value) || 0 })}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 transition-all font-black text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tu Nombre (Líder)</label>
                <input
                  type="text"
                  value={localGoals.sponsorName || ''}
                  onChange={(e) => setLocalGoals({ ...localGoals, sponsorName: e.target.value })}
                  placeholder="Ej: Frank"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 transition-all font-black text-slate-800 shadow-inner mb-4"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tu Compañía / Marca</label>
                <input
                  type="text"
                  value={localGoals.companyName || ''}
                  onChange={(e) => setLocalGoals({ ...localGoals, companyName: e.target.value })}
                  placeholder="Ej: Compañía / Equipo"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 transition-all font-black text-slate-800 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Reto del Equipo</label>
                <textarea
                  value={localGoals.teamChallenge || ''}
                  onChange={(e) => setLocalGoals({ ...localGoals, teamChallenge: e.target.value })}
                  placeholder="Ej: ¡10 nuevos líderes antes de fin de mes! 🔥"
                  rows={2}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 transition-all font-bold text-slate-800 resize-none shadow-inner"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 px-8 rounded-[22px] flex items-center justify-center gap-2.5 shadow-xl hover:bg-indigo-600 transition-all active:scale-95 border border-white/5"
              >
                <Save size={16} className="text-emerald-400 fill-current" />
                Guardar Estrategia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature Ritual Preview */}
      {showPreview && (
        <DuplicationModal
          incomingGoals={goals}
          previewMode={true}
          onAccept={handleFinalShare}
          onCancel={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};
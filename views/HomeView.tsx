import React, { useEffect, useState } from 'react';
import { MessageCircle, ShieldCheck, Target, Zap, UserPlus, Trophy, ChevronRight, Share2, X, Check, Copy, Megaphone, HelpCircle, BarChart3, Palette } from 'lucide-react';
import { ViewState, DailyProgress, UserGoals, GamificationState, LEVELS } from '../types';
import { TaskTracker } from '../components/TaskTracker';
import { DailyPostView } from './DailyPostView'; // Import directly for Modal

interface HomeViewProps {
  setViewState: (view: ViewState) => void;
  progress: DailyProgress;
  goals: UserGoals;
  gamification: GamificationState;
  onShowHelp: () => void;
  onRecordPost: (isRescue: boolean) => void;
  onCompleteMission: () => void;
}

// Helper component for Circular Progress (Smaller for 3 items)
const CircularProgress = ({
  current,
  max,
  colorClass,
  icon: Icon,
  size = 70
}: {
  current: number;
  max: number;
  colorClass: string;
  icon: React.ElementType,
  size?: number
}) => {
  const [offset, setOffset] = useState(0);
  const radius = size / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));

  useEffect(() => {
    const progressOffset = circumference - (percentage / 100) * circumference;
    const timer = setTimeout(() => setOffset(progressOffset), 100);
    return () => clearTimeout(timer);
  }, [percentage, circumference]);

  return (
    <div className="flex flex-col items-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="5" fill="transparent" className="text-slate-700/50" />
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="5" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={`${colorClass} transition-all duration-1000 ease-out`} style={{ strokeDashoffset: offset }} />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center ${colorClass}`}>
          <Icon size={size * 0.35} />
        </div>
      </div>
      <div className="absolute -bottom-5 text-center">
        <span className="text-sm font-bold text-white">{current}</span>
        <span className="text-[10px] text-slate-400">/{max}</span>
      </div>
    </div>
  );
};

export const HomeView: React.FC<HomeViewProps> = ({ setViewState, progress, goals, gamification, onShowHelp, onRecordPost, onCompleteMission }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalActions = progress.contactsMade + progress.followUpsMade + (progress.postsMade || 0);
  const totalGoals = goals.dailyContacts + goals.dailyFollowUps + (goals.dailyPosts || 1);
  const overallPercentage = Math.min(100, Math.round((totalActions / totalGoals) * 100));

  const currentLevelData = LEVELS.find(l => l.level === gamification.level) || LEVELS[0];
  const nextLevelData = LEVELS.find(l => l.level === gamification.level + 1);
  const xpForNextLevel = nextLevelData ? nextLevelData.minXp : gamification.xp * 1.5;
  const xpProgress = Math.min(100, Math.max(0, ((gamification.xp - currentLevelData.minXp) / (xpForNextLevel - currentLevelData.minXp)) * 100));

  const shareText = `🚀 *Mi Progreso de Hoy*\n\n✅ Contactos: ${progress.contactsMade}/${goals.dailyContacts}\n🔄 Seguimientos: ${progress.followUpsMade}/${goals.dailyFollowUps}\n📢 Posts: ${progress.postsMade || 0}/${goals.dailyPosts || 1}\n🔥 Racha: ${gamification.streak} días\n🏆 Nivel: ${currentLevelData.title}\n\n¡La consistencia es clave!\n\nPrueba la app aquí: https://mlm-action-partner.vercel.app`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mi Progreso Diario', text: shareText });
      } catch (err) { console.log('Error sharing', err); }
    } else {
      handleCopy(shareText);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTool = async () => {
    const toolUrl = 'https://mlm-action-partner.vercel.app';
    const baseText = `🚀 *¡Lleva tu negocio MLM al siguiente nivel!* \n\nUsa esta *herramienta gratuita* para profesionalizar tu prospección.\n\n💡 _"La ejecución diaria es la clave del éxito"_`;
    const fullText = `${baseText}\n\nPrueba la app aquí: ${toolUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MLM Progreso Diario',
          text: baseText,
          url: toolUrl
        });
      } catch (err) { }
    } else {
      handleCopy(fullText);
      alert('¡Enlace y frase copiados!');
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in zoom-in duration-300 relative pb-10">

      {/* SUPER STATS CARD (FUSIONED) */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[32px] p-5 text-white shadow-xl shadow-slate-200 border border-slate-700 relative overflow-hidden">

        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

        {/* Header: Level & Actions */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div onClick={() => setViewState('GOALS')} className="cursor-pointer">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-wider">
                Nivel {gamification.level}
              </span>
              {gamification.streak > 0 && (
                <span className="relative flex items-center gap-1 bg-orange-500/20 text-orange-400 text-[10px] font-bold px-3 py-1 rounded-full border border-orange-500/20 uppercase tracking-wider overflow-hidden group">
                  {/* Pulsing Glow Background */}
                  <div className="absolute inset-0 bg-orange-500/20 animate-pulse"></div>
                  <Zap size={10} fill="currentColor" className="relative z-10 animate-bounce" />
                  <span className="relative z-10">{gamification.streak} Días 🔥</span>
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold tracking-tight">{currentLevelData.title}</h2>

            {/* XP Bar */}
            <div className="w-48 h-2 bg-slate-700 rounded-full mt-2.5 overflow-hidden relative border border-white/5">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 transition-all duration-1000 shadow-[0_0_15px_rgba(129,140,248,0.5)]"
                style={{ width: `${xpProgress}%` }}
              >
                {/* Shimmer effect on bar */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <div className="flex justify-between w-48 mt-1.5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                {xpProgress}% para Nivel {gamification.level + 1}
              </p>
              <p className="text-[10px] text-indigo-400 font-black">{gamification.xp} XP</p>
            </div>
          </div>

          <div className="flex gap-2 items-start text-right">
            <div className="flex gap-2">
              <button onClick={() => setViewState('STATS')} className="p-2 rounded-xl bg-slate-700/50 text-slate-300 hover:text-white border border-white/10" title="Estadísticas">
                <BarChart3 size={20} />
              </button>
              <button onClick={() => setShowShareModal(true)} className="p-2 rounded-xl bg-slate-700/50 text-slate-300 hover:text-white border border-white/10" title="Compartir">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* PROGRESS CIRCLES (3 COLUMNS) */}
        <div className="grid grid-cols-3 gap-2 relative z-10 mb-2">
          {/* Contacts */}
          <div className="flex flex-col items-center gap-2">
            <CircularProgress current={progress.contactsMade} max={goals.dailyContacts} colorClass="text-emerald-400" icon={UserPlus} size={64} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-4">Contactos</span>
          </div>

          {/* FollowUps */}
          <div className="flex flex-col items-center gap-2">
            <CircularProgress current={progress.followUpsMade} max={goals.dailyFollowUps} colorClass="text-blue-400" icon={MessageCircle} size={64} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-4">Seguim.</span>
          </div>

          {/* Posts (Actionable) */}
          <div className="flex flex-col items-center gap-2 relative group">
            <div onClick={() => setShowPostModal(true)} className="cursor-pointer transition-transform active:scale-95">
              <CircularProgress current={progress.postsMade || 0} max={goals.dailyPosts || 1} colorClass="text-pink-400" icon={Megaphone} size={64} />
              {/* Flash Action Badge */}
              <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce shadow-lg shadow-pink-500/50">
                Ir
              </div>
            </div>
            <button
              onClick={() => setShowPostModal(true)}
              className="mt-2 bg-pink-500/20 hover:bg-pink-500 text-pink-300 hover:text-white border border-pink-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all"
            >
              ⚡ Crear
            </button>
          </div>
        </div>
      </div>

      {/* DAILY MISSION CARD */}
      {gamification.currentMission && (
        <div className={`relative overflow-hidden p-5 rounded-[28px] border-2 transition-all duration-500 ${gamification.currentMission.completed ? 'bg-emerald-500/5 border-emerald-500/20 scale-[0.98]' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-white shadow-lg shadow-indigo-100'}`}>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>

          <div className="flex items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${gamification.currentMission.completed ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 animate-bounce'}`}>
                {gamification.currentMission.completed ? <Check size={24} strokeWidth={3} /> : <Trophy size={24} />}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Misión Especial</span>
                  {gamification.currentMission.completed && <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">¡Completada!</span>}
                </div>
                <h3 className={`font-bold leading-tight ${gamification.currentMission.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {gamification.currentMission.description}
                </h3>
              </div>
            </div>

            {!gamification.currentMission.completed && (
              <button
                onClick={onCompleteMission}
                className="bg-slate-900 text-white text-[10px] font-black px-4 py-3 rounded-2xl hover:bg-indigo-600 transition-all active:scale-90 uppercase tracking-widest"
              >
                Logrado
              </button>
            )}
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${gamification.currentMission.completed ? 'w-full bg-emerald-500' : 'w-0'}`}></div>
            </div>
            <span className="text-[10px] font-bold text-slate-400">+{gamification.currentMission.xpReward} XP</span>
          </div>
        </div>
      )}

      <TaskTracker />

      {/* SIMPLIFIED GRID (3 BUTTONS) */}
      <div className="grid grid-cols-1 gap-4">
        {/* CONTACTAR */}
        <button onClick={() => setViewState('CONTACT')} className="group bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <UserPlus size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-800 group-hover:text-emerald-900">Contactar</h3>
              <p className="text-xs text-slate-500">Nuevos prospectos</p>
            </div>
          </div>
          <ChevronRight className="text-slate-300 group-hover:text-emerald-600" />
        </button>

        {/* SEGUIMIENTO */}
        <button onClick={() => setViewState('FOLLOWUP')} className="group bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <MessageCircle size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-800 group-hover:text-blue-900">Dar Seguimiento</h3>
              <p className="text-xs text-slate-500">Retoma conversaciones</p>
            </div>
          </div>
          <ChevronRight className="text-slate-300 group-hover:text-blue-600" />
        </button>

        {/* OBJECIONES */}
        <button onClick={() => setViewState('OBJECTIONS')} className="group bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-xl text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <ShieldCheck size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-800 group-hover:text-amber-900">Objeciones</h3>
              <p className="text-xs text-slate-500">Respuestas inteligentes</p>
            </div>
          </div>
          <ChevronRight className="text-slate-300 group-hover:text-amber-600" />
        </button>
      </div>

      {/* Goals & Settings Link */}
      <div className="text-center mt-2">
        <button onClick={() => setViewState('GOALS')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest flex items-center justify-center gap-2 py-2">
          <Target size={14} /> Ajustar mis Metas
        </button>
      </div>

      {/* COMPARTIR HERRAMIENTA (RESTORED) */}
      <div className="pt-6 border-t border-slate-100 mt-6">
        <button
          onClick={shareTool}
          className="w-full flex items-center justify-center gap-3 py-6 bg-slate-900 text-white rounded-[28px] font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] group"
        >
          <Share2 size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="text-sm tracking-tight uppercase">Compartir esta herramienta</span>
        </button>
        <p className="text-center text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-widest">
          Ayuda a tu equipo a ejecutar todos los días
        </p>
      </div>


      {/* POST CREATION MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg h-[90vh] sm:h-auto sm:rounded-[32px] rounded-t-[32px] shadow-2xl overflow-y-auto animate-in slide-in-from-bottom duration-300 relative">
            <button
              onClick={() => setShowPostModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 z-50 hover:bg-slate-200"
            >
              <X size={20} />
            </button>
            <div className="p-1">
              <DailyPostView
                goals={goals}
                onPostComplete={(isRescue) => {
                  onRecordPost(isRescue);
                  setTimeout(() => setShowPostModal(false), 2500); // Close after success anim
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => setShowShareModal(false)} className="absolute top-3 right-3 p-2 bg-slate-100 rounded-full text-slate-500 z-20"><X size={20} /></button>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-center text-white relative">
              <h3 className="text-lg font-medium text-white/80 uppercase tracking-widest mb-4 relative z-10">Resumen Diario</h3>
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-white/20 bg-white/10 mb-6 relative z-10">
                <span className="text-3xl font-bold">{overallPercentage}%</span>
              </div>
              <div className="grid grid-cols-3 gap-2 relative z-10 text-center">
                <div className="bg-white/10 rounded-lg p-2"><p className="text-xl font-bold">{progress.contactsMade}</p><p className="text-[9px] uppercase">Contactos</p></div>
                <div className="bg-white/10 rounded-lg p-2"><p className="text-xl font-bold">{progress.followUpsMade}</p><p className="text-[9px] uppercase">Seguim.</p></div>
                <div className="bg-white/10 rounded-lg p-2"><p className="text-xl font-bold">{progress.postsMade || 0}</p><p className="text-[9px] uppercase">Posts</p></div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 flex gap-3">
              <button onClick={handleNativeShare} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg">Compartir</button>
              <button onClick={() => handleCopy(shareText)} className="flex-none bg-white border border-slate-200 p-3 rounded-xl">{copied ? <Check size={20} /> : <Copy size={20} />}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
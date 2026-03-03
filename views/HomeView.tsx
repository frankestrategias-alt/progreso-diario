import React, { useEffect, useState } from 'react';
import {
  Users,
  Target,
  Flame,
  MessageSquare,
  Share2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  X,
  Copy,
  LayoutGrid,
  Rocket,
  PlusCircle,
  Zap,
  UserPlus,
  MessageCircle,
  Megaphone,
  ChevronRight,
  Check,
  Settings
} from 'lucide-react';
import { ViewState, DailyProgress, UserGoals, GamificationState, LEVELS } from '../types';
import { useAppContext } from '../contexts/AppContext';

import { TaskTracker } from '../components/TaskTracker';
import { ProspectingPulse } from '../components/ProspectingPulse';
import { RescueMode } from '../components/RescueMode';
import { DailyPostView } from './DailyPostView';
import { ShareToolModal } from '../components/ShareToolModal';
import { DailySecret } from '../components/DailySecret';
import { EliteCommandCenter } from '../components/EliteCommandCenter';
import { PaywallModal } from '../components/PaywallModal';

interface HomeViewProps {
  setViewState: (view: ViewState) => void;
  onShowHelp: () => void;
  onRecordPost: (isRescue: boolean) => void;
  onCompleteMission: () => void;
  addPoints: (amount: number) => void;
}

const SimpleCounter = ({
  current,
  max,
  colorClass,
  icon: Icon,
  label
}: {
  current: number;
  max: number;
  colorClass: string;
  icon: React.ElementType,
  label: string
}) => {
  return (
    <div className="flex flex-col items-center p-4 bg-slate-700/40 rounded-3xl border border-white/20 flex-1 transition-all duration-300 hover:bg-slate-600/40">
      <div className={`${colorClass} mb-2`}>
        <Icon size={24} />
      </div>
      <div className="text-2xl font-black text-white">{current}</div>
      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</div>
    </div>
  );
};

export const HomeView: React.FC<HomeViewProps> = ({
  setViewState,
  onShowHelp,
  onRecordPost,
  onCompleteMission,
  addPoints
}) => {
  const { progress, goals, gamification } = useAppContext();

  const [showShareModal, setShowShareModal] = useState(false);
  const [showShareToolModal, setShowShareToolModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExclusiveVisible, setIsExclusiveVisible] = useState(true);

  // Check visibility of Exclusive Services card
  useEffect(() => {
    try {
      const hiddenUntil = localStorage.getItem('exclusiveCardHiddenUntil');
      if (hiddenUntil) {
        const now = Date.now();
        if (now < Number(hiddenUntil)) {
          setIsExclusiveVisible(false);
        } else {
          localStorage.removeItem('exclusiveCardHiddenUntil');
        }
      }
    } catch (e) {
      console.error("Error checking exclusive card visibility:", e);
    }
  }, []);

  const handleCloseExclusive = () => {
    const oneHour = 3600000;
    const hideUntil = Date.now() + oneHour;
    localStorage.setItem('exclusiveCardHiddenUntil', hideUntil.toString());
    setIsExclusiveVisible(false);
  };

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('dailyTasks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading tasks:", e);
      return [];
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('dailyTasks');
        if (saved) setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Storage error:", e);
      }
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 2000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const totalActions = progress.contactsMade + progress.followUpsMade + (progress.postsMade || 0);
  const totalGoals = goals.dailyContacts + goals.dailyFollowUps + (goals.dailyPosts || 1);
  const overallPercentage = Math.min(100, Math.round((totalActions / totalGoals) * 100));

  const isContactsDone = progress.contactsMade >= goals.dailyContacts;
  const isFollowUpsDone = progress.followUpsMade >= goals.dailyFollowUps;

  const getCardStyle = (type: 'contact' | 'followup' | 'post' | 'objections') => {
    const base = "w-full group rounded-[32px] p-4 transition-all duration-300 flex items-center justify-between bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 ";

    if (type === 'contact') {
      const isDone = isContactsDone;
      if (isDone) return base + "opacity-60";
      return base;
    }
    if (type === 'followup') {
      const isDone = isFollowUpsDone;
      if (isDone) return base + "opacity-60";
      return base;
    }
    if (type === 'post') {
      const isDone = (progress.postsMade || 0) >= (goals.dailyPosts || 1);
      if (isDone) return base + "opacity-60";
      return base;
    }
    if (type === 'objections') {
      return base;
    }
    return base;
  };

  const currentLevelData = LEVELS.find(l => l.level === gamification.level) || LEVELS[0];
  const nextLevelData = LEVELS.find(l => l.level === gamification.level + 1);
  const nextMinPoints = nextLevelData ? Number(nextLevelData.minPoints) : (Number(gamification.points) * 1.5 || 100);

  const currentMinPoints = Number(currentLevelData.minPoints) || 0;
  const progressToNextLevel = Math.max(0, Number(gamification.points) - currentMinPoints);
  const totalPointsNeeded = Math.max(1, nextMinPoints - currentMinPoints);

  const rawProgress = (progressToNextLevel / totalPointsNeeded) * 100;
  const pointsProgress = Math.round(Math.min(100, Math.max(0, isNaN(rawProgress) ? 0 : rawProgress)));

  const shareText = `🚀 *Mi Progreso de Hoy*\n\n✅ Contactos: ${progress.contactsMade}/${goals.dailyContacts}\n🔄 Seguimientos: ${progress.followUpsMade}/${goals.dailyFollowUps}\n📢 Posts: ${progress.postsMade || 0}/${goals.dailyPosts || 1}\n🔥 Racha: ${gamification.streak} días\n🏆 Nivel: ${currentLevelData.title}\n\n¡La consistencia es clave!\n\nPrueba la app aquí: ${window.location.origin}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mi Progreso Diario', text: shareText });
      } catch (err) { console.log('Error sharing', err); }
    } else {
      handleCopy(shareText);
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      const link = document.createElement('a');
      link.href = whatsappUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopy = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTool = async () => {
    const toolUrl = "https://networker-pro.netlify.app/";
    const baseText = `⚠️ *URGENTE EQUIPO* ⚠️\n\nAcabo de configurar mi embudo completo con Inteligencia Artificial. Me tomó 2 minutos y ya está trabajando por mí automáticamente.\n\nLes dejo mi clon exacto para que lo instalen en 1 clic antes de nuestra próxima reunión:`;
    const fullText = `${baseText}\n\n👉 ${toolUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sistema Premium 360 - Clonar Embudo',
          text: baseText,
          url: toolUrl
        });
      } catch (err) { }
    } else {
      handleCopy(fullText);
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
      const link = document.createElement('a');
      link.href = whatsappUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in zoom-in duration-300 relative pb-10">

      {/* SUPER STATS CARD (FUSIONED) */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[var(--radius-card)] p-6 text-white premium-card-shadow border border-slate-700/50 relative overflow-hidden transition-all duration-500 hover:shadow-indigo-500/10">

        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/15 rounded-full blur-[100px] -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[100px] -ml-16 -mb-16 pointer-events-none"></div>

        <div className="flex justify-between items-start mb-8 relative z-10">
          <div onClick={() => setViewState('GOALS')} className="cursor-pointer group/level flex-1">
            <div className="flex items-center gap-2 mb-2">
              {gamification.streak > 0 && (
                <span className="relative flex items-center gap-1.5 bg-orange-500/10 text-orange-400 text-[10px] font-black px-3 py-1.5 rounded-full border border-orange-500/20 uppercase tracking-widest overflow-hidden">
                  <div className="absolute inset-0 bg-orange-500/5 animate-pulse"></div>
                  <Zap size={10} fill="currentColor" className="relative z-10 animate-zap-pulse" />
                  <span className="relative z-10">{gamification.streak} Días 🔥</span>
                </span>
              )}
            </div>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1 opacity-80">
              Nivel {gamification.level}
            </p>
            <h2 className="text-xl font-black tracking-tight text-white group-hover/level:text-indigo-300 transition-colors uppercase">{currentLevelData.title}</h2>

            <div className="w-56 h-2.5 bg-slate-950/50 rounded-full mt-4 overflow-hidden relative border border-white/5 shadow-inner">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(129,140,248,0.4)]"
                style={{ width: `${pointsProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <div className="flex justify-between w-56 mt-2 px-1 whitespace-nowrap">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                {pointsProgress}% completado
              </p>
              <p className="text-[11px] text-indigo-400 font-black tracking-widest uppercase">{gamification.points} Puntos</p>
            </div>
          </div>

          <div className="flex gap-1.5 -mt-1 -mr-1">
            <button
              onClick={() => setShowShareModal(true)}
              className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-300 hover:text-white border border-indigo-500/20 transition-all hover:bg-indigo-500/20"
              title="Progreso Diario"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={() => setShowShareToolModal(true)}
              className="relative group p-2.5 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition-all overflow-hidden border border-white/20"
              title="Sello de Liderazgo (Duplicar)"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-sweep"></div>
              <Rocket size={18} className="relative z-10" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 relative z-10 mb-2">
          <SimpleCounter current={progress.contactsMade} max={goals.dailyContacts} colorClass="text-emerald-400" icon={UserPlus} label="Contactos" />
          <SimpleCounter current={progress.followUpsMade} max={goals.dailyFollowUps} colorClass="text-blue-400" icon={MessageCircle} label="Seguim." />
          <SimpleCounter current={progress.postsMade || 0} max={goals.dailyPosts || 1} colorClass="text-pink-400" icon={Megaphone} label="Publicar" />
        </div>
      </div>

      <ProspectingPulse />

      {/* SECCIÓN: ¿QUÉ HAGO AHORA? (GUÍA MAESTRA) */}
      <div className="relative overflow-hidden p-8 rounded-[40px] border-2 border-emerald-500/50 bg-emerald-50 dark:bg-slate-900/80 premium-card-shadow group">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Rocket size={100} className="text-emerald-500" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/20">
            <Rocket size={32} />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-bold mb-8 text-lg">
            {!isContactsDone
              ? <span><span className="font-black text-slate-900 dark:text-emerald-50">Tu siguiente paso de hoy es:</span> Hacer tus contactos diarios.</span>
              : !isFollowUpsDone
                ? <span><span className="font-black text-slate-900 dark:text-emerald-50">¡Gran trabajo!</span> Ahora toca hacer tus seguimientos.</span>
                : <span><span className="font-black text-slate-900 dark:text-emerald-50">¡Día Perfecto!</span> Estás dominando el mercado.</span>}
          </p>
          <button
            onClick={() => setViewState(!isContactsDone ? 'CONTACT' : !isFollowUpsDone ? 'FOLLOWUP' : 'DAILY_POST')}
            className="w-full py-6 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-[length:200%_auto] hover:bg-[position:100%_0] text-white font-black text-xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 uppercase tracking-widest flex items-center justify-center gap-3 relative overflow-hidden group/master border border-white/20"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/master:animate-shimmer-sweep pointer-events-none"></div>

            <span className="relative z-10">HACERLO AHORA</span>
            <ChevronRight size={24} strokeWidth={3} className="relative z-10 group-hover/master:translate-x-1.5 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* MAIN ACTION CARDS - RESTORED & AGUERITA */}
      <div className="grid grid-cols-1 gap-4">
        <button onClick={() => setViewState('CONTACT')} className={getCardStyle('contact')}>
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl transition-all duration-300 border-2 ${isContactsDone ? 'bg-slate-100 text-slate-400 border-slate-300/50' : 'bg-emerald-100/50 text-emerald-600 border-emerald-300'}`}>
              <UserPlus size={24} />
            </div>
            <div className="text-left">
              <h4 className={`font-black text-lg tracking-tight ${isContactsDone ? 'text-slate-400' : 'text-slate-900'}`}>1. Contactar Gente</h4>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isContactsDone ? 'text-slate-400' : 'text-slate-400'}`}>
                TOCA AQUÍ PARA EMPEZAR
              </p>
            </div>
          </div>
          <div className={`p-1 rounded-full text-slate-300`}>
            <ChevronRight size={20} strokeWidth={3} />
          </div>
        </button>

        {/* FOLLOWUPS */}
        <button onClick={() => setViewState('FOLLOWUP')} className={getCardStyle('followup')}>
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl transition-all duration-300 border-2 ${isFollowUpsDone ? 'bg-slate-100 text-slate-400 border-slate-300/50' : 'bg-blue-100/50 text-blue-600 border-blue-300'}`}>
              <MessageCircle size={24} />
            </div>
            <div className="text-left">
              <h4 className={`font-black text-lg tracking-tight ${isFollowUpsDone ? 'text-slate-400' : 'text-slate-900'}`}>2. Dar Seguimiento</h4>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isFollowUpsDone ? 'text-slate-400' : 'text-slate-400'}`}>
                TOCA AQUÍ PARA CERRAR TRATOS
              </p>
            </div>
          </div>
          <div className={`p-1 rounded-full text-slate-300`}>
            <ChevronRight size={20} strokeWidth={3} />
          </div>
        </button>

        {/* POSTS */}
        <button onClick={() => setViewState('DAILY_POST')} className={getCardStyle('post')}>
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl transition-all duration-300 border-2 ${(progress.postsMade || 0) >= (goals.dailyPosts || 1) ? 'bg-slate-100 text-slate-400 border-slate-300/50' : 'bg-pink-100/50 text-pink-600 border-pink-300'}`}>
              <Megaphone size={24} />
            </div>
            <div className="text-left">
              <h4 className={`font-black text-lg tracking-tight ${(progress.postsMade || 0) >= (goals.dailyPosts || 1) ? 'text-slate-400' : 'text-slate-900'}`}>3. Publicar en Redes</h4>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${(progress.postsMade || 0) >= (goals.dailyPosts || 1) ? 'text-slate-400' : 'text-slate-400'}`}>
                TOCA AQUÍ PARA ATRAER GENTE
              </p>
            </div>
          </div>
          <div className={`p-1 rounded-full text-slate-300`}>
            <ChevronRight size={20} strokeWidth={3} />
          </div>
        </button>

        {/* OBJECTIONS */}
        <button onClick={() => setViewState('OBJECTIONS')} className={getCardStyle('objections')}>
          <div className="flex items-center gap-5">
            <div className="bg-orange-100/50 text-orange-600 p-4 rounded-2xl border-2 border-orange-300 transition-all duration-300">
              <ShieldCheck size={24} />
            </div>
            <div className="text-left">
              <h4 className="font-black text-lg text-slate-900 tracking-tight">Biblioteca de Objeciones</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                AYUDA PARA RESPONDER MENSAJES
              </p>
            </div>
          </div>
          <div className="p-1 rounded-full text-slate-300">
            <ChevronRight size={20} strokeWidth={3} />
          </div>
        </button>
      </div>


      <TaskTracker
        onNavigate={setViewState}
        onAddPoints={addPoints}
      />

      <div className="my-14 flex items-center justify-center gap-4 px-10">
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
        <div className="w-2.5 h-2 rounded-full border-[3px] border-slate-400 rotate-45" />
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
      </div>

      {gamification.currentMission && (
        <div className={`relative overflow-hidden p-8 rounded-[var(--radius-premium)] border transition-all duration-700 ${gamification.currentMission.completed
          ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500/50 scale-[0.98]'
          : 'bg-white border-slate-100 premium-card-shadow group'}`}>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${gamification.currentMission.completed ? 'text-emerald-500' : 'text-amber-500 animate-pulse'}`}>
                {gamification.currentMission.completed ? '✓ Misión Cumplida' : '✦ Misión de Hoy ✦'}
              </span>
            </div>

            <div className="mb-8 max-w-[300px]">
              <h3 className={`text-2xl font-black mb-3 leading-tight tracking-tight ${gamification.currentMission.completed ? 'text-slate-700 line-through opacity-90' : 'text-slate-900'}`}>
                {(gamification.currentMission as any).title || 'Misión Especial'}
              </h3>
              <p className={`text-sm font-bold leading-relaxed ${gamification.currentMission.completed ? 'text-slate-700/80' : 'text-slate-600 text-balance'}`}>
                {gamification.currentMission.description}
              </p>
            </div>

            {!gamification.currentMission.completed ? (
              <button
                onClick={onCompleteMission}
                className="relative group/btn bg-slate-900 border border-white/10 overflow-hidden text-white text-[10px] font-black px-8 py-5 rounded-2xl hover:bg-indigo-600 transition-all active:scale-95 uppercase tracking-widest shadow-2xl flex items-center gap-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer-sweep"></div>
                <Zap size={16} className="text-amber-400 animate-zap-pulse relative z-10" fill="currentColor" />
                <div className="flex flex-col items-center relative z-10 animate-zap-pulse text-amber-50 leading-none">
                  <span className="text-[12px] mb-1">¡COMPLETAR TAREA!</span>
                  <span className="text-[10px] opacity-80">RECLAMAR PUNTOS</span>
                </div>
              </button>
            ) : (
              <div className="bg-emerald-500/10 text-emerald-600 border border-emerald-200/50 text-[11px] font-black px-12 py-5 rounded-2xl flex items-center gap-3 transition-opacity">
                <Check size={18} strokeWidth={4} />
                COMPLETADA
              </div>
            )}
          </div>
        </div>
      )}


      <DailySecret />

      <button
        onClick={() => setViewState('GOALS')}
        className="w-full bg-slate-900 text-white p-5 rounded-[32px] flex items-center justify-between border-4 border-indigo-500/20 shadow-2xl hover:bg-black transition-all active:scale-[0.98] group"
      >
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500/10 p-3 rounded-[20px] text-indigo-400 group-hover:rotate-12 transition-transform">
            <Settings size={28} />
          </div>
          <div className="text-left">
            <h3 className="font-black text-lg tracking-tight uppercase leading-tight">Mis Metas de Negocio</h3>
            <p className="text-xs font-bold text-indigo-300 opacity-80 uppercase tracking-widest mt-0.5">Configura cuánto quieres ganar</p>
          </div>
        </div>
        <div className="bg-white/10 p-2.5 rounded-full">
          <ChevronRight size={20} strokeWidth={4} />
        </div>
      </button>

      <div className="my-14 flex items-center justify-center gap-4 px-10">
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
        <div className="w-2.5 h-2 rounded-full border-[3px] border-slate-400 rotate-45" />
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
      </div>

      <EliteCommandCenter />




      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onSuccess={() => {
            setShowPaywall(false);
          }}
        />
      )}

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
              <button onClick={() => handleCopy(shareText)} className={`flex-none bg-white border border-slate-200 p-3 rounded-xl transition-all ${!copied ? 'animate-icon-pulse' : ''}`}>{copied ? <Check size={20} /> : <Copy size={20} />}</button>
            </div>
          </div>
        </div>
      )}

      {showShareToolModal && (
        <ShareToolModal
          onClose={() => setShowShareToolModal(false)}
          onShare={() => {
            shareTool();
            setShowShareToolModal(false);
          }}
        />
      )}
    </div>
  );
};
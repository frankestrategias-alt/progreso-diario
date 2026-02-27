import React, { useEffect, useState } from 'react';
import {
  Users,
  Target,
  Flame,
  MessageSquare,
  Share2,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  Shield,
  Zap,
  ShoppingBag,
  ChevronRight,
  Settings,
  UserPlus,
  MessageCircle,
  Megaphone,
  Check,
  ShieldCheck,
  X,
  Copy,
  PlusCircle,
  LayoutGrid,
  Rocket
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
  const radius = size / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  const initialOffset = circumference - (percentage / 100) * circumference;
  const [offset, setOffset] = useState(initialOffset);

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
    const base = "w-full group rounded-[32px] p-5 transition-all duration-500 flex items-center justify-between border border-slate-300 shadow-sm ";

    if (type === 'contact') {
      if (!isContactsDone) return base + "bg-white shadow-[0_0_30px_-5px_rgba(52,211,153,0.3)] scale-[1.02] z-10 relative";
      return base + "bg-slate-50 opacity-90";
    }
    if (type === 'followup') {
      const isActive = isContactsDone || progress.followUpsMade > 0;
      if (!isActive) return base + "bg-slate-50 opacity-60";
      if (!isFollowUpsDone) return base + "bg-white shadow-[0_0_30px_-5px_rgba(96,165,250,0.3)] scale-[1.02] z-10 relative";
      return base + "bg-slate-50 opacity-90";
    }
    if (type === 'post') {
      const isActive = isFollowUpsDone || (progress.postsMade || 0) > 0;
      if (!isActive) return base + "bg-slate-50 opacity-60";
      const isDone = (progress.postsMade || 0) >= (goals.dailyPosts || 1);
      if (!isDone) return base + "bg-white shadow-[0_0_30px_-5px_rgba(244,114,182,0.3)] scale-[1.02] z-10 relative";
      return base + "bg-slate-50 opacity-90";
    }
    if (type === 'objections') {
      return base + "bg-white hover:border-slate-400 transition-all";
    }
    return base + "bg-white";
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

        <div className="grid grid-cols-3 gap-2 relative z-10 mb-2">
          <div onClick={() => setViewState('CONTACT')} className={`flex flex-col items-center gap-2 cursor-pointer transition-all duration-500 group ${!isContactsDone ? 'scale-110 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]' : ''}`}>
            <CircularProgress current={progress.contactsMade} max={goals.dailyContacts} colorClass="text-emerald-400 group-hover:text-emerald-500 transition-colors" icon={UserPlus} size={64} />
            <span className={`text-[10px] font-black uppercase tracking-wider mt-4 ${!isContactsDone ? 'text-emerald-400' : 'text-slate-500'}`}>Contactos</span>
          </div>

          <div onClick={() => setViewState('FOLLOWUP')} className={`flex flex-col items-center gap-2 transition-all duration-500 group ${(!isContactsDone && progress.followUpsMade === 0) ? 'opacity-30 grayscale saturate-0 cursor-not-allowed pointer-events-none' : isFollowUpsDone ? 'cursor-pointer' : 'scale-110 drop-shadow-[0_0_15px_rgba(96,165,250,0.3)] cursor-pointer'}`}>
            <CircularProgress current={progress.followUpsMade} max={goals.dailyFollowUps} colorClass="text-blue-400 group-hover:text-blue-500 transition-colors" icon={MessageCircle} size={64} />
            <span className={`text-[10px] font-black uppercase tracking-wider mt-4 ${(isContactsDone || progress.followUpsMade > 0) && !isFollowUpsDone ? 'text-blue-400' : 'text-slate-500'}`}>Seguim.</span>
          </div>

          <div onClick={() => setViewState('DAILY_POST')} className={`flex flex-col items-center gap-2 relative group transition-all duration-500 ${(!isFollowUpsDone && (progress.postsMade || 0) === 0) ? 'opacity-30 grayscale saturate-0 cursor-not-allowed pointer-events-none' : 'scale-110 drop-shadow-[0_0_15px_rgba(244,114,182,0.3)] cursor-pointer'}`}>
            <div className="transition-transform active:scale-95 duration-200 relative group w-full h-full flex justify-center">
              <CircularProgress current={progress.postsMade || 0} max={goals.dailyPosts || 1} colorClass="text-pink-400 group-hover:text-pink-500 transition-colors" icon={Megaphone} size={64} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider mt-4 ${(isFollowUpsDone || (progress.postsMade || 0) > 0) ? 'text-pink-400' : 'text-slate-500'}`}>Publicar</span>
          </div>
        </div>
      </div>

      <ProspectingPulse />

      {gamification.currentMission && (
        <div className={`relative overflow-hidden p-8 rounded-[var(--radius-premium)] border transition-all duration-700 ${gamification.currentMission.completed
          ? 'bg-emerald-500/25 border-emerald-500/40 scale-[0.98]'
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
                className="relative group/btn bg-slate-900 border border-white/10 overflow-hidden text-white text-[11px] font-black px-12 py-5 rounded-2xl hover:bg-indigo-600 transition-all active:scale-95 uppercase tracking-widest shadow-2xl flex items-center gap-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer-sweep"></div>
                <Zap size={16} className="text-amber-400 animate-zap-pulse relative z-10" fill="currentColor" />
                <span className="relative z-10 animate-zap-pulse text-amber-50">!RECLAMAR PUNTOS!</span>
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

      <div className="grid grid-cols-1 gap-4 mt-8">
        <button
          onClick={() => setViewState('CONTACT')}
          className={getCardStyle('contact') + " active:scale-95 duration-300 group overflow-hidden"}
        >
          <div className="flex items-center gap-5">
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 transition-transform group-hover:scale-105 duration-500">
              <UserPlus size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-[15px] text-slate-900 leading-tight">Paso 1: Contactar</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                {isContactsDone ? '¡Completado!' : '¡CONECTA Y CONQUISTA!'}
              </p>
            </div>
          </div>
          <div className="bg-slate-100 p-3.5 rounded-full text-slate-600 group-hover:text-emerald-700 transition-colors">
            <ChevronRight size={18} strokeWidth={4} />
          </div>
        </button>

        <button
          onClick={() => setViewState('FOLLOWUP')}
          className={getCardStyle('followup') + " active:scale-95 duration-300 group overflow-hidden"}
        >
          <div className="flex items-center gap-5">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 transition-transform group-hover:scale-105 duration-500">
              <MessageCircle size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-[15px] text-slate-900 leading-tight">Paso 2: Seguimiento</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                {!isContactsDone ? 'CIERRA TRATOS HOY' : isFollowUpsDone ? '¡COMPLETADO!' : 'CIERRA TRATOS HOY'}
              </p>
            </div>
          </div>
          <div className="bg-slate-100 p-3.5 rounded-full text-slate-600 group-hover:text-blue-700 transition-colors">
            <ChevronRight size={18} strokeWidth={4} />
          </div>
        </button>

        <button
          onClick={() => setViewState('DAILY_POST')}
          className={getCardStyle('post') + " active:scale-95 duration-300 group overflow-hidden"}
        >
          <div className="flex items-center gap-5">
            <div className="bg-pink-50 p-4 rounded-2xl text-pink-600 transition-transform group-hover:scale-105 duration-500">
              <Megaphone size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-[15px] text-slate-900 leading-tight">Paso 3: Publicar</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">¡IMPACTA Y CRECE!</p>
            </div>
          </div>
          <div className="bg-slate-100 p-3.5 rounded-full text-slate-600 group-hover:text-pink-700 transition-colors">
            <ChevronRight size={18} strokeWidth={4} />
          </div>
        </button>

        <button
          onClick={() => setViewState('OBJECTIONS')}
          className={getCardStyle('objections') + " active:scale-95 duration-300 group overflow-hidden"}
        >
          <div className="flex items-center gap-5">
            <div className="bg-amber-50 p-4 rounded-2xl text-amber-600 transition-transform group-hover:scale-105 duration-500">
              <ShieldCheck size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-[15px] text-slate-900 leading-tight">Biblioteca de Objeciones</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">HERRAMIENTA DE APOYO</p>
            </div>
          </div>
          <div className="bg-slate-100 p-3.5 rounded-full text-slate-600 group-hover:text-amber-700 transition-colors">
            <ChevronRight size={18} strokeWidth={4} />
          </div>
        </button>
      </div>

      <TaskTracker
        onNavigate={setViewState}
        onAddPoints={addPoints}
      />

      <div className="my-10 flex items-center justify-center gap-4 px-10 opacity-80">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
        <div className="w-2 h-1.5 rounded-full border border-slate-400 rotate-45" />
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
      </div>

      <button
        onClick={() => setViewState('GOALS')}
        className="w-full bg-slate-900 text-white p-6 rounded-[32px] flex items-center justify-between border border-white/10 shadow-2xl hover:bg-black transition-all active:scale-[0.98] group"
      >
        <div className="flex items-center gap-5">
          <div className="p-1 text-white group-hover:rotate-12 transition-transform">
            <Settings size={28} />
          </div>
          <div className="text-left">
            <h3 className="font-black text-[18px] tracking-tight">Mis Metas</h3>
            <p className="text-[10px] font-black text-indigo-300/60 uppercase tracking-widest">Configurar mi negocio</p>
          </div>
        </div>
        <div className="bg-white/10 p-3 rounded-full">
          <ChevronRight size={20} strokeWidth={4} />
        </div>
      </button>

      <DailySecret />

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
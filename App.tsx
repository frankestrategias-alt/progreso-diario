import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { HomeView } from './views/HomeView';
import { HelpCircle } from 'lucide-react';
import { ContactView } from './views/ContactView';
import { FollowUpView } from './views/FollowUpView';
import { ObjectionView } from './views/ObjectionView';
import { GoalsView } from './views/GoalsView';
import { DailyPostView } from './views/DailyPostView';
import { StatsView } from './views/StatsView';
import { LevelUpModal } from './components/LevelUpModal';
import { HelpModal } from './components/HelpModal';
import { Layout } from './components/Layout';
import { Onboarding } from './components/Onboarding';
import { ViewState, DailyProgress, UserGoals, DEFAULT_GOALS, DEFAULT_PROGRESS, GamificationState, DEFAULT_GAMIFICATION, LEVELS } from './types';

const MISSIONS = [
  { id: 'm1', description: 'Lee 10 páginas de un libro de liderazgo', xpReward: 30 },
  { id: 'm2', description: 'Revisa un video de entrenamiento de tu compañía', xpReward: 30 },
  { id: 'm3', description: 'Envía un mensaje de gratitud a alguien de tu equipo', xpReward: 30 },
  { id: 'm4', description: 'Organiza tu agenda para el resto de la semana', xpReward: 30 },
  { id: 'm5', description: 'Haz 2 minutos de respiración profunda antes de empezar', xpReward: 30 },
];

const playSound = (type: 'action' | 'success' | 'levelUp') => {
  const sounds = {
    action: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Subtle Click
    success: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3', // Sparkle
    levelUp: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Fanfare
  };
  const audio = new Audio(sounds[type]);
  audio.volume = 0.15;
  audio.play().catch(() => { });
};

function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [showHelp, setShowHelp] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('onboardingSeen'));

  // History Management
  useEffect(() => {
    // Handle browser back button
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setView(event.state.view);
      } else {
        setView('HOME');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (newView: ViewState) => {
    setView(newView);
    window.history.pushState({ view: newView }, '', `#${newView.toLowerCase()}`);
  };

  // Persistent State
  const [goals, setGoals] = useState<UserGoals>(() => {
    const saved = localStorage.getItem('userGoals');
    return saved ? JSON.parse(saved) : DEFAULT_GOALS;
  });

  const [progress, setProgress] = useState<DailyProgress>(() => {
    const saved = localStorage.getItem('dailyProgress');
    return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
  });

  const [gamification, setGamification] = useState<GamificationState>(() => {
    const saved = localStorage.getItem('gamification');
    return saved ? JSON.parse(saved) : DEFAULT_GAMIFICATION;
  });

  const [showLevelUp, setShowLevelUp] = useState<{ level: number, title: string } | null>(null);

  // Effects to save state
  useEffect(() => {
    localStorage.setItem('userGoals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('dailyProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('gamification', JSON.stringify(gamification));
  }, [gamification]);

  // Check Daily Reset & Streak
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    if (progress.lastUpdated !== today) {
      setProgress(prev => ({
        contactsMade: 0,
        followUpsMade: 0,
        postsMade: 0,
        lastUpdated: today,
        history: prev.history || {}
      }));

      // Streak Logic
      const lastActive = new Date(gamification.lastActiveDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const isConsecutive = lastActive.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0];

      if (!isConsecutive && gamification.lastActiveDate !== today) {
        // Reset streak if missed a day (unless it's the first time today)
        if (gamification.lastActiveDate) { // Only reset if not empty (first run)
          setGamification(prev => ({ ...prev, streak: 0 }));
        }
      }

    }

    // Mission Assignment (Ensure it runs even if progress was already updated today)
    setGamification(prev => {
      if (!prev.currentMission || prev.lastActiveDate !== today) {
        const randomMission = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
        return {
          ...prev,
          currentMission: { ...randomMission, completed: false }
        };
      }
      return prev;
    });
  }, []);

  const addXp = (amount: number) => {
    setGamification(prev => {
      const newXp = prev.xp + amount;
      const today = new Date().toISOString().split('T')[0];

      // Calculate Level
      let newLevel = prev.level;
      let newTitle = "";

      for (const l of LEVELS) {
        if (newXp >= l.minXp) {
          newLevel = l.level;
          newTitle = l.title;
        }
      }

      // Check Level Up
      if (newLevel > prev.level) {
        setShowLevelUp({ level: newLevel, title: newTitle });
        playSound('levelUp');
      } else {
        playSound('success');
      }

      // Update Streak if first action today
      let newStreak = prev.streak;
      if (prev.lastActiveDate !== today) {
        newStreak += 1;
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastActiveDate: today
      };
    });
  };

  const completeMission = () => {
    if (gamification.currentMission && !gamification.currentMission.completed) {
      setGamification(prev => ({
        ...prev,
        currentMission: prev.currentMission ? { ...prev.currentMission, completed: true } : undefined
      }));
      addXp(gamification.currentMission.xpReward);
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  };

  // Actions
  const handleRecordContact = () => {
    playSound('action');
    setProgress(prev => {
      const today = new Date().toISOString().split('T')[0];
      const newContacts = prev.contactsMade + 1;
      const newHistory = { ...prev.history };
      newHistory[today] = { contacts: newContacts, followUps: prev.followUpsMade };

      // Trigger confetti if goal is reached
      if (newContacts === goals.dailyContacts) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b']
        });
      }

      return { ...prev, contactsMade: newContacts, history: newHistory };
    });
    addXp(10); // +10 XP for Contact
  };

  const handleRecordFollowUp = () => {
    playSound('action');
    setProgress(prev => {
      const today = new Date().toISOString().split('T')[0];
      const newFollowUps = prev.followUpsMade + 1;
      const newHistory = { ...prev.history };
      newHistory[today] = { contacts: prev.contactsMade, followUps: newFollowUps };

      // Trigger confetti if goal is reached
      if (newFollowUps === goals.dailyFollowUps) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#8b5cf6', '#ec4899']
        });
      }

      return { ...prev, followUpsMade: newFollowUps, history: newHistory };
    });
    addXp(5); // +5 XP for FollowUp
  };

  // Pass addXp to DailyPostView via props if needed, or handle it inside the view by passing a handler
  const handleRecordPost = (isRescue: boolean) => {
    setProgress(prev => ({
      ...prev,
      postsMade: (prev.postsMade || 0) + 1
    }));
    addXp(isRescue ? 50 : 20); // +20 XP for normal post, +50 for rescue

    // Trigger confetti
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#ec4899', '#f59e0b']
    });
  };

  const renderView = () => {
    switch (view) {
      case 'HOME':
        return <HomeView setViewState={navigateTo} progress={progress} goals={goals} gamification={gamification} onShowHelp={() => setShowHelp(true)} onRecordPost={handleRecordPost} onCompleteMission={completeMission} />;
      case 'CONTACT':
        return <ContactView onRecordAction={handleRecordContact} goals={goals} />;
      case 'FOLLOWUP':
        return <FollowUpView onRecordAction={handleRecordFollowUp} goals={goals} />;
      case 'OBJECTIONS':
        return <ObjectionView goals={goals} />;
      case 'GOALS':
        return <GoalsView goals={goals} progress={progress} onUpdateGoals={setGoals} />;
      case 'DAILY_POST':
        return <DailyPostView onPostComplete={handleRecordPost} goals={goals} />;
      case 'STATS':
        return <StatsView progress={progress} goals={goals} onBack={() => navigateTo('HOME')} />;
      default:
        return <HomeView setViewState={navigateTo} progress={progress} goals={goals} gamification={gamification} onShowHelp={() => setShowHelp(true)} onRecordPost={handleRecordPost} />;
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'HOME': return 'MLM Progreso Diario';
      case 'CONTACT': return 'Contactar';
      case 'FOLLOWUP': return 'Seguimiento';
      case 'OBJECTIONS': return 'Manejo de Objeciones';
      case 'GOALS': return 'Mis Metas';
      case 'DAILY_POST': return 'Plan de Contenido';
      case 'STATS': return 'Estadísticas';
    }
  };

  return (
    <Layout
      title={getTitle()}
      showBack={view !== 'HOME'}
      onBack={() => window.history.back()}
      rightContent={view === 'HOME' && (
        <button
          onClick={() => setShowHelp(true)}
          className="group p-2.5 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white transition-all active:scale-90 hover:scale-110 border border-amber-300/30"
          title="Ayuda / Tutorial"
        >
          <HelpCircle size={22} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}
    >
      {renderView()}

      {/* Help Modal */}
      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}

      {/* Level Up Modal */}
      {showLevelUp && (
        <LevelUpModal
          level={showLevelUp.level}
          title={showLevelUp.title}
          onClose={() => setShowLevelUp(null)}
        />
      )}
      {/* Onboarding Flow */}
      {showOnboarding && (
        <Onboarding onComplete={() => {
          localStorage.setItem('onboardingSeen', 'true');
          setShowOnboarding(false);
        }} />
      )}
    </Layout>
  );
}

export default App;
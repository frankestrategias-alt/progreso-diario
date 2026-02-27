import React, { useState, useEffect, Suspense } from 'react';
import confetti from 'canvas-confetti';
import { triggerHaptic } from './utils/magic';
import './services/firebase'; // Inicializa Firebase y Analytics
import { HelpCircle } from 'lucide-react';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const HomeView = React.lazy(() => import('./views/HomeView').then(module => ({ default: module.HomeView })));
const ContactView = React.lazy(() => import('./views/ContactView').then(module => ({ default: module.ContactView })));
const FollowUpView = React.lazy(() => import('./views/FollowUpView').then(module => ({ default: module.FollowUpView })));
const ObjectionView = React.lazy(() => import('./views/ObjectionView').then(module => ({ default: module.ObjectionView })));
const GoalsView = React.lazy(() => import('./views/GoalsView').then(module => ({ default: module.GoalsView })));
const DailyPostView = React.lazy(() => import('./views/DailyPostView').then(module => ({ default: module.DailyPostView })));
const StatsView = React.lazy(() => import('./views/StatsView').then(module => ({ default: module.StatsView })));
const TeamView = React.lazy(() => import('./views/TeamView').then(module => ({ default: module.TeamView })));
const LeaderDashboard = React.lazy(() => import('./views/LeaderDashboard').then(module => ({ default: module.LeaderDashboard })));
const MarketplaceView = React.lazy(() => import('./views/MarketplaceView').then(module => ({ default: module.MarketplaceView })));

import { LevelUpModal } from './components/LevelUpModal';
import { HelpModal } from './components/HelpModal';
import { Layout } from './components/Layout';
import { Onboarding } from './components/Onboarding';
import { DuplicationModal } from './components/DuplicationModal';
import { deserializeGoals } from './services/duplicationService';

import { ViewState, DailyProgress, UserGoals, GamificationState, LEVELS } from './types';
import { useAppContext } from './contexts/AppContext';

import { useAppEngine, playSound } from './hooks/useAppEngine';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const getViewFromPath = (): ViewState => {
    const path = location.pathname;
    if (path.startsWith('/team')) return 'TEAM';
    if (path.startsWith('/leader')) return 'LEADER';
    if (path.startsWith('/contact')) return 'CONTACT';
    if (path.startsWith('/followup')) return 'FOLLOWUP';
    if (path.startsWith('/objections')) return 'OBJECTIONS';
    if (path.startsWith('/goals')) return 'GOALS';
    if (path.startsWith('/daily-post')) return 'DAILY_POST';
    if (path.startsWith('/stats')) return 'STATS';
    if (path.startsWith('/marketplace')) return 'MARKETPLACE';
    return 'HOME';
  };

  const view = getViewFromPath();

  const [showHelp, setShowHelp] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('onboardingSeen'));

  // DUPLICATION PROTOCOL: Check for incoming shared goals (Synchronous to avoid flash)
  const [incomingGoals, setIncomingGoals] = useState<UserGoals | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const hashPart = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
    const hashParams = new URLSearchParams(hashPart);
    const dupParam = params.get('dup') || hashParams.get('dup');

    if (dupParam) {
      console.log('📡 Protocolo de Duplicación detectado...');
      const decoded = deserializeGoals(dupParam);
      if (decoded) {
        console.log('✅ Visión de Líder cargada:', decoded.companyName);
        return decoded;
      }
    }
    return null;
  });

  // FORCE CACHE CLEANING (VERSIONING) & URL Cleanup
  const APP_VERSION = '1.7.2-ultra'; // Super Nuke - Chrome fix
  useEffect(() => {
    const savedVersion = localStorage.getItem('appVersion');
    if (savedVersion && savedVersion !== APP_VERSION) {
      console.log('🚀 Nueva versión detectada. Limpiando caché...', APP_VERSION);
      localStorage.setItem('appVersion', APP_VERSION);

      // Force reload ignoring cache if version changed
      if ('caches' in window) {
        caches.keys().then(names => {
          Promise.all(names.map(name => caches.delete(name))).then(() => {
            (window as any).location.reload();
          });
        });
      } else {
        (window as any).location.reload();
      }
    } else if (!savedVersion) {
      localStorage.setItem('appVersion', APP_VERSION);
    }

    // Global Error Handler for Chunk Load Failures (Anti-White Screen)
    const handleError = (e: ErrorEvent | PromiseRejectionEvent) => {
      const message = (e as any).message || '';
      if (message.includes('Loading chunk') || message.includes('Failed to fetch dynamically imported module')) {
        console.warn('⚠️ Fallo de carga detectado. Reparando...');
        if ('caches' in window) {
          caches.keys().then(names => {
            Promise.all(names.map(name => caches.delete(name))).then(() => {
              (window as any).location.reload();
            });
          });
        } else {
          (window as any).location.reload();
        }
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    // Clean URL if we detected a duplication link on init
    if (incomingGoals) {
      const newUrl = window.location.origin + window.location.pathname + window.location.hash.split('?')[0];
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const navigateTo = (newView: ViewState, forceRefresh = false) => {
    if (forceRefresh && newView === 'HOME') {
      window.location.href = window.location.origin + '/';
      return;
    }
    const paths: Record<ViewState, string> = {
      HOME: '/',
      TEAM: '/team',
      LEADER: '/leader',
      CONTACT: '/contact',
      FOLLOWUP: '/followup',
      OBJECTIONS: '/objections',
      GOALS: '/goals',
      DAILY_POST: '/daily-post',
      STATS: '/stats',
      MARKETPLACE: '/marketplace'
    };
    navigate(paths[newView]);
  };

  const { setGoals, setProgress } = useAppContext();
  const {
    showLevelUp,
    setShowLevelUp,
    addPoints,
    completeMission,
    handleRecordContact,
    handleRecordFollowUp,
    handleRecordPost
  } = useAppEngine();

  const handleSaveGoals = (newGoals: UserGoals) => {
    setGoals(newGoals);
  };

  const handleJoinTeam = (code: string) => {
    setProgress(prev => ({ ...prev, teamId: code }));
    if (code) {
      playSound('success');
      // En un futuro, aquí cargaríamos la configuración del equipo desde Firebase
    }
    navigateTo('HOME');
  };

  const renderRouterViews = () => {
    return (
      <Suspense fallback={<div className="flex items-center justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>}>
        <Routes>
          <Route path="/" element={
            <HomeView setViewState={navigateTo} onShowHelp={() => setShowHelp(true)} onRecordPost={handleRecordPost} onCompleteMission={completeMission} />
          } />
          <Route path="/team" element={<TeamView onJoinTeam={handleJoinTeam} onBack={() => navigateTo('HOME')} />} />
          <Route path="/leader" element={<LeaderDashboard onBack={() => navigateTo('HOME')} />} />
          <Route path="/contact" element={<ContactView onRecordAction={handleRecordContact} onNavigate={navigateTo} />} />
          <Route path="/followup" element={<FollowUpView onRecordAction={handleRecordFollowUp} onNavigate={navigateTo} />} />
          <Route path="/objections" element={<ObjectionView />} />
          <Route path="/goals" element={<GoalsView />} />
          <Route path="/daily-post" element={<DailyPostView onPostComplete={handleRecordPost} onRecordAction={() => addPoints(10)} onNavigate={navigateTo} />} />
          <Route path="/stats" element={<StatsView onBack={() => navigateTo('HOME')} />} />
          <Route path="/marketplace" element={<MarketplaceView setViewState={navigateTo} />} />
        </Routes>
      </Suspense>
    );
  };

  const getTitle = () => {
    switch (view) {
      case 'HOME': return 'Networker Pro';
      case 'TEAM': return 'Estrategia de Equipo';
      case 'LEADER': return 'Panel de Control';
      case 'CONTACT': return 'Invitar / Prospectar';
      case 'FOLLOWUP': return 'Seguimiento';
      case 'OBJECTIONS': return 'Manejo de Objeciones';
      case 'GOALS': return 'Mis Metas';
      case 'DAILY_POST': return 'Plan de Contenido';
      case 'STATS': return 'Estadísticas';
      case 'MARKETPLACE': return 'Marketplace de Herramientas';
    }
  };

  return (
    <Layout
      title={getTitle()}
      hideHeader={showOnboarding}
      showBack={view !== 'HOME'}
      onBack={() => navigateTo('HOME', true)}
      onNavigate={navigateTo}
      currentView={view}
      rightContent={view === 'HOME' && (
        <button
          onClick={() => setShowHelp(true)}
          className="group p-2.5 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white transition-all duration-300 active:scale-95 animate-[bounce_2s_infinite] shadow-lg shadow-orange-500/30 border border-amber-300/30"
          title="Ayuda / Tutorial"
        >
          <HelpCircle size={22} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}
    >
      {renderRouterViews()}

      {/* Help Modal */}
      {
        showHelp && (
          <HelpModal onClose={() => setShowHelp(false)} />
        )
      }

      {/* Level Up Modal */}
      {
        showLevelUp && (
          <LevelUpModal
            level={showLevelUp.level}
            title={showLevelUp.title}
            onClose={() => setShowLevelUp(null)}
          />
        )
      }
      {/* Onboarding Flow */}
      {showOnboarding && !incomingGoals && (
        <Onboarding onComplete={(company, niche) => {
          setGoals(prev => ({ ...prev, companyName: company, productNiche: niche }));
          localStorage.setItem('onboardingSeen', 'true');
          setShowOnboarding(false);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
          playSound('success');
        }} />
      )}

      {/* Duplication Protocol Modal (Receiver) */}
      {incomingGoals && (
        <DuplicationModal
          incomingGoals={incomingGoals}
          onAccept={() => {
            setGoals(incomingGoals);
            setIncomingGoals(null);
            confetti({
              particleCount: 200,
              spread: 100,
              origin: { y: 0.6 },
              colors: ['#6366f1', '#a855f7', '#ec4899']
            });
            playSound('success');
            // If they accepted duplication, ensure onboarding is marked as seen
            if (showOnboarding) {
              localStorage.setItem('onboardingSeen', 'true');
              setShowOnboarding(false);
            }
          }}
          onCancel={() => setIncomingGoals(null)}
        />
      )}

    </Layout >
  );
}

export default App;
import React from 'react';
import { ArrowLeft, Layout as LayoutIcon, Users, BarChart2, ShoppingBag } from 'lucide-react';
import { InstallPrompt } from './InstallPrompt';
import EliteChatBubble from './EliteChatBubble';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
  rightContent?: React.ReactNode;
  hideHeader?: boolean;
  onNavigate?: (view: ViewState, forceRefresh?: boolean) => void;
  currentView?: ViewState;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  onBack,
  showBack = false,
  rightContent,
  hideHeader = false,
  onNavigate,
  currentView
}) => {
  return (
    <div className="h-screen h-[100dvh] bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-200 text-slate-900 flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden tap-highlight-none selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header - Elite Sticky Navigation */}
      {!hideHeader && (
        <header
          className="absolute top-0 left-0 right-0 z-50 w-full bg-white/40 border-b border-white/20 px-4 h-20 flex items-center justify-between transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.02)]"
          style={{
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)'
          }}
        >
          {/* Navigation & Title Group */}
          <div className="flex items-center gap-3 flex-1 overflow-hidden">
            {onNavigate && (
              <div className="flex items-center bg-slate-100/40 p-1 rounded-2xl border border-white/50 backdrop-blur-md">
                <button
                  onClick={() => onNavigate('HOME')}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${currentView === 'HOME' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' : 'text-slate-400 hover:text-indigo-600 hover:bg-white'}`}
                >
                  <LayoutIcon size={20} strokeWidth={2.5} />
                </button>

                <button
                  onClick={() => onNavigate('TEAM')}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${currentView === 'TEAM' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' : 'text-slate-400 hover:text-indigo-600 hover:bg-white'}`}
                >
                  <Users size={20} strokeWidth={2.5} />
                </button>

                <button
                  onClick={() => onNavigate('STATS')}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${currentView === 'STATS' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' : 'text-slate-400 hover:text-indigo-600 hover:bg-white'}`}
                >
                  <BarChart2 size={20} strokeWidth={2.5} />
                </button>

                <button
                  onClick={() => onNavigate('MARKETPLACE')}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${currentView === 'MARKETPLACE' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' : 'text-slate-400 hover:text-indigo-600 hover:bg-white'}`}
                >
                  <ShoppingBag size={20} strokeWidth={2.5} />
                </button>
              </div>
            )}

            {/* Dynamic Section Title - Now visible in Mobile */}
            <div className="flex-1 min-w-0">
              <h1 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.1em] truncate animate-in slide-in-from-left duration-500 leading-none">
                {title}
              </h1>
            </div>
          </div>

          {rightContent && (
            <div className="flex items-center gap-2">
              {rightContent}
            </div>
          )}
        </header>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide pt-20">
        <div className="animate-fade-in min-h-full flex flex-col p-4 pb-10">
          <div className="flex-1">
            {children}
          </div>

          {/* Global Footer Credits */}
          <footer className="mt-12 py-8 border-t border-slate-200/60 text-center">
            <div className="mb-4">
              <h4 className="text-[14px] font-black text-slate-800 uppercase tracking-[0.3em] mb-1">
                Networker Pro
              </h4>
              <div className="h-0.5 w-8 bg-indigo-500/20 mx-auto rounded-full"></div>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
              App diseñada y creada por <br />
              <span className="text-slate-500 font-extrabold">Frank Estrategias</span>
            </p>
          </footer>
        </div>
      </main>
      <InstallPrompt />
      <EliteChatBubble />
    </div>
  );
};
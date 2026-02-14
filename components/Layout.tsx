import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
  rightContent?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, onBack, showBack = false, rightContent }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-200 text-slate-900 flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden tap-highlight-none selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="glass sticky top-0 z-20 flex items-center h-16 px-4 border-b border-white/20 transition-all duration-300">
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="mr-3 p-2 rounded-full hover:bg-slate-200/50 text-slate-700 transition-all active:scale-90"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-black text-slate-800 truncate flex-1 tracking-tight">{title || 'Networker Pro'}</h1>
        {rightContent && (
          <div className="flex items-center gap-2">
            {rightContent}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-10 scrollbar-hide">
        <div className="animate-fade-in min-h-full flex flex-col">
          <div className="flex-1">
            {children}
          </div>

          {/* Global Footer Credits */}
          <footer className="mt-12 py-8 border-t border-slate-200/60 text-center">
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
              App diseñada y creada por <br />
              <span className="text-slate-600 font-extrabold">Frank Bolívar</span>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};
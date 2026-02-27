import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export const ThemeToggle = () => {
    const { theme, setTheme } = useAppContext();

    return (
        <div className="flex items-center gap-1 p-1 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full border border-white/20">
            <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-full transition-all ${theme === 'light'
                        ? 'bg-white text-indigo-600 shadow-lg scale-110'
                        : 'text-white/60 hover:text-white'
                    }`}
                title="Modo Claro"
            >
                <Sun size={18} />
            </button>

            <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-full transition-all ${theme === 'dark'
                        ? 'bg-indigo-600 text-white shadow-lg scale-110'
                        : 'text-white/60 hover:text-white'
                    }`}
                title="Modo Oscuro"
            >
                <Moon size={18} />
            </button>
        </div>
    );
};

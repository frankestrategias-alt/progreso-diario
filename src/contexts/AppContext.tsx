import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserGoals, DailyProgress, GamificationState, ViewState, DEFAULT_GOALS, DEFAULT_PROGRESS, DEFAULT_GAMIFICATION } from '../../types';

interface AppContextType {
    goals: UserGoals;
    progress: DailyProgress;
    gamification: GamificationState;
    setGoals: React.Dispatch<React.SetStateAction<UserGoals>>;
    setProgress: React.Dispatch<React.SetStateAction<DailyProgress>>;
    setGamification: React.Dispatch<React.SetStateAction<GamificationState>>;
    addPoints: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [goals, setGoals] = useState<UserGoals>(() => {
        try {
            const saved = localStorage.getItem('userGoals');
            return saved ? JSON.parse(saved) : DEFAULT_GOALS;
        } catch (e) {
            console.error('Error loading goals, using defaults:', e);
            return DEFAULT_GOALS;
        }
    });

    const [progress, setProgress] = useState<DailyProgress>(() => {
        try {
            const saved = localStorage.getItem('dailyProgress');
            const parsed = saved ? JSON.parse(saved) : null;
            if (parsed && parsed.date === new Date().toDateString()) {
                return parsed;
            }
            return { ...DEFAULT_PROGRESS, date: new Date().toDateString() };
        } catch (e) {
            return { ...DEFAULT_PROGRESS, date: new Date().toDateString() };
        }
    });

    const [gamification, setGamification] = useState<GamificationState>(() => {
        try {
            const saved = localStorage.getItem('userGamification');
            return saved ? JSON.parse(saved) : DEFAULT_GAMIFICATION;
        } catch (e) {
            return DEFAULT_GAMIFICATION;
        }
    });

    useEffect(() => {
        localStorage.setItem('userGoals', JSON.stringify(goals));
    }, [goals]);

    useEffect(() => {
        localStorage.setItem('dailyProgress', JSON.stringify(progress));
    }, [progress]);

    useEffect(() => {
        localStorage.setItem('userGamification', JSON.stringify(gamification));
    }, [gamification]);

    const addPoints = (amount: number) => {
        setGamification(prev => {
            const newPoints = prev.points + amount;
            return { ...prev, points: newPoints };
        });
    };

    return (
        <AppContext.Provider value={{
            goals, setGoals,
            progress, setProgress,
            gamification, setGamification,
            addPoints
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { triggerHaptic } from '../utils/magic';
import { useAppContext } from '../contexts/AppContext';
import { MISSIONS, LEVELS } from '../types';

export const playSound = (type: 'action' | 'success' | 'levelUp') => {
    const sounds = {
        action: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Subtle Click
        success: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3', // Sparkle
        levelUp: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Fanfare
    };
    const audio = new Audio(sounds[type]);
    audio.volume = 0.15;
    audio.play().catch(() => { });
};

export const useAppEngine = () => {
    const { goals, progress, setProgress, gamification, setGamification } = useAppContext();
    const [showLevelUp, setShowLevelUp] = useState<{ level: number, title: string } | null>(null);

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

            // Streak Logic - Robust Validation
            const lastActiveStr = gamification.lastActiveDate;
            const lastActiveDate = lastActiveStr ? new Date(lastActiveStr) : null;
            const isValidDate = lastActiveDate && !isNaN(lastActiveDate.getTime());

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            const isConsecutive = isValidDate && lastActiveDate.toISOString().split('T')[0] === yesterdayStr;

            if (!isConsecutive && lastActiveStr !== today) {
                // Reset streak if missed a day (unless it's the first time today)
                if (lastActiveStr) { // Only reset if not empty (first run)
                    setGamification(prev => ({ ...prev, streak: 0 }));
                }
            }
        }

        // Mission Assignment (Ensure it runs even if progress was already updated today)
        setGamification(prev => {
            // Ensure points is safe
            const currentPoints = Number(prev.points) || 0;

            if (!prev.currentMission || prev.lastActiveDate !== today) {
                const randomMission = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
                return {
                    ...prev,
                    points: currentPoints, // Safety update
                    currentMission: { ...randomMission, completed: false }
                };
            }
            return { ...prev, points: currentPoints };
        });
    }, [progress.lastUpdated, gamification.lastActiveDate, gamification.currentMission?.id, setGamification, setProgress]);

    const addPoints = (amount: number) => {
        setGamification(prev => {
            const currentPoints = Number(prev.points) || 0; // Safety against NaN
            const newPoints = currentPoints + amount;
            const today = new Date().toISOString().split('T')[0];

            // Calculate Level
            let newLevel = prev.level;
            let newTitle = "";

            for (const l of LEVELS) {
                if (newPoints >= l.minPoints) {
                    newLevel = l.level;
                    newTitle = l.title;
                }
            }

            // Check Level Up
            if (newLevel > prev.level) {
                setShowLevelUp({ level: newLevel, title: newTitle });
                playSound('levelUp');
                triggerHaptic('success');
            } else {
                playSound('success');
                triggerHaptic('light');
            }

            // Update Streak if first action today
            let newStreak = prev.streak;
            if (prev.lastActiveDate !== today) {
                newStreak += 1;
            }

            return {
                ...prev,
                points: newPoints,
                level: newLevel,
                streak: newStreak,
                lastActiveDate: today
            };
        });
    };

    const completeMission = () => {
        if (gamification.currentMission && !gamification.currentMission.completed) {
            const reward = Number(gamification.currentMission.pointsReward) || 0; // Validate reward
            addPoints(reward);

            setGamification(prev => {
                if (!prev.currentMission) return prev;
                return {
                    ...prev,
                    currentMission: { ...prev.currentMission, completed: true }
                };
            });

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
        addPoints(10); // +10 Puntos for Contact
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
        addPoints(5); // +5 Puntos for FollowUp
    };

    const handleRecordPost = (isRescue: boolean) => {
        setProgress(prev => ({
            ...prev,
            postsMade: (prev.postsMade || 0) + 1
        }));
        addPoints(isRescue ? 50 : 20); // +20 Puntos for normal post, +50 for rescue

        // Trigger confetti
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#8b5cf6', '#ec4899', '#f59e0b']
        });
    };

    return {
        showLevelUp,
        setShowLevelUp,
        addPoints,
        completeMission,
        handleRecordContact,
        handleRecordFollowUp,
        handleRecordPost
    };
};

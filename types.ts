export type ViewState = 'HOME' | 'CONTACT' | 'FOLLOWUP' | 'OBJECTIONS' | 'GOALS' | 'DAILY_POST' | 'STATS';

export interface UserGoals {
  dailyContacts: number;
  dailyFollowUps: number;
  dailyPosts: number; // New target
  monthlyIncome: string;
  companyName?: string;
  productNiche?: string;
  teamChallenge?: string;
}

export interface DailyProgress {
  contactsMade: number;
  followUpsMade: number;
  postsMade: number;
  lastUpdated: string;
  history?: Record<string, { contacts: number, followUps: number }>;
}

export const DEFAULT_GOALS: UserGoals = {
  dailyContacts: 5,
  dailyFollowUps: 3,
  dailyPosts: 1, // Default to 1 post/day
  monthlyIncome: "1000",
  companyName: "",
  productNiche: "Salud y Bienestar",
  teamChallenge: "¡Haz 10 contactos nuevos esta semana! 🚀",
};

export interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  badges: string[];
  currentMission?: {
    id: string;
    description: string;
    xpReward: number;
    completed: boolean;
  };
}

export const LEVELS = [
  { level: 1, minXp: 0, title: "Aprendiz" },
  { level: 2, minXp: 100, title: "Ejecutivo" },
  { level: 3, minXp: 300, title: "Líder de Equipo" },
  { level: 4, minXp: 600, title: "Top Earner" },
  { level: 5, minXp: 1000, title: "Leyenda" },
];

export const DEFAULT_GAMIFICATION: GamificationState = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: '',
  badges: [],
};

export const DEFAULT_PROGRESS: DailyProgress = {
  contactsMade: 0,
  followUpsMade: 0,
  postsMade: 0,
  lastUpdated: new Date().toISOString().split('T')[0],
};
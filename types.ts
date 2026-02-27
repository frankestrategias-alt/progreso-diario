export type ViewState = 'HOME' | 'CONTACT' | 'FOLLOWUP' | 'OBJECTIONS' | 'GOALS' | 'DAILY_POST' | 'STATS' | 'TEAM' | 'LEADER' | 'MARKETPLACE';

export interface UserGoals {
  dailyContacts: number;
  dailyFollowUps: number;
  dailyPosts: number; // New target
  monthlyIncome: string;
  companyName?: string;
  sponsorName?: string; // New: leader's name
  productNiche?: string;
  teamChallenge?: string;
  teamId?: string; // New: linked team
}

export interface TeamConfig {
  id: string;
  name: string;
  leaderId: string;
  customSecret?: string;
  customScripts?: Record<string, string[]>;
  primaryColor?: string;
  leaderWhatsApp?: string;
  capacity: number; // Max members allowed
  memberCount: number; // Current active members
}

export interface DailyProgress {
  contactsMade: number;
  followUpsMade: number;
  postsMade: number;
  teamId?: string; // Track team membership
  lastUpdated: string;
  history?: Record<string, { contacts: number, followUps: number }>;
}

export const DEFAULT_GOALS: UserGoals = {
  dailyContacts: 5,
  dailyFollowUps: 3,
  dailyPosts: 1, // Default to 1 post/day
  monthlyIncome: "1000",
  companyName: "",
  sponsorName: "",
  productNiche: "Salud y Bienestar",
  teamChallenge: "¡Haz 10 contactos nuevos esta semana! 🚀",
};

export interface GamificationState {
  points: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  badges: string[];
  currentMission?: {
    id: string;
    description: string;
    pointsReward: number;
    completed: boolean;
  };
}

export const LEVELS = [
  { level: 1, minPoints: 0, title: "Aprendiz" },
  { level: 2, minPoints: 100, title: "Ejecutivo" },
  { level: 3, minPoints: 300, title: "Líder de Equipo" },
  { level: 4, minPoints: 600, title: "Top Earner" },
  { level: 5, minPoints: 1000, title: "Leyenda" },
];

export const DEFAULT_GAMIFICATION: GamificationState = {
  points: 0,
  level: 1,
  streak: 0,
  lastActiveDate: '',
  badges: [],
};

export const DEFAULT_PROGRESS: DailyProgress = {
  contactsMade: 0,
  followUpsMade: 0,
  postsMade: 0,
  teamId: '', // Default: no team
  lastUpdated: new Date().toISOString().split('T')[0],
};

export const MISSIONS = [
  { id: 'm1', title: 'Mente de Diamante', description: 'Inyección de 10 páginas de sabiduría para expandir tu contexto y visión.', pointsReward: 30 },
  { id: 'm2', title: 'Activa tu Saber', description: 'Cápsula de entrenamiento: Extrae 1 idea clave y ejecútala hoy mismo.', pointsReward: 30 },
  { id: 'm3', title: 'Energía de Equipo', description: 'Cura de Gratitud: Mensaje honesto para elevar la frecuencia de tu red.', pointsReward: 30 },
  { id: 'm4', title: 'Arquitectura del Triunfo', description: 'Control de Agenda: Bloquea tu tiempo alfa y domina tus prioridades.', pointsReward: 30 },
  { id: 'm5', title: 'Enfoque Alfa', description: '2 min de respiración profunda para silenciar el ruido y liderar con paz.', pointsReward: 30 },
  { id: 'm6', title: 'Escucha de Poder', description: 'Audio de Liderazgo: 15 minutos que reprogramen tu éxito financiero.', pointsReward: 30 },
  { id: 'm7', title: 'Semilla de Valor', description: 'Atracción Social: Comparte un tip valioso en tus historias (IG/FB).', pointsReward: 30 },
  { id: 'm8', title: 'Conexión Real', description: 'Toque de Cortesía: Llama a un socio solo para conocer cómo está hoy.', pointsReward: 30 },
  { id: 'm9', title: 'Imán de Prospectos', description: 'Bio-Optimización: Revisa y ajusta tu biografía social para atraer líderes.', pointsReward: 30 },
  { id: 'm10', title: 'Duplicación Maestra', description: 'Expansión de Red: Comparte esta app con un socio que quiera crecer.', pointsReward: 30 },
];
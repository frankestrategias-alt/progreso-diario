import { TeamConfig } from '../types';

export const MOCK_TEAMS: Record<string, TeamConfig> = {
    'DIAMANTE2024': {
        id: 'team_001',
        name: 'Organización Diamante',
        leaderId: 'leader_frank',
        customSecret: 'ÉxitoTotal',
        primaryColor: '#4f46e5',
        leaderWhatsApp: '5491100000001',
        capacity: 200,
        memberCount: 145
    },
    'PLATINO_PRO': {
        id: 'team_002',
        name: 'Equipo Platinos Pro',
        leaderId: 'leader_maria',
        customSecret: 'CrecimientoInfinito',
        primaryColor: '#0ea5e9',
        leaderWhatsApp: '5491100000002',
        capacity: 50,
        memberCount: 42
    },
    'ELITE_SALUD': {
        id: 'team_003',
        name: 'Elite Salud & Bienestar',
        leaderId: 'leader_juan',
        customSecret: 'VidaSana',
        primaryColor: '#10b981',
        leaderWhatsApp: '5491100000003',
        capacity: 500,
        memberCount: 89
    },
    'LEGION_PRO': {
        id: 'team_999',
        name: 'Legión de Networkers Pro',
        leaderId: 'leader_frank_master',
        customSecret: 'LibreYPro',
        primaryColor: '#6366f1',
        leaderWhatsApp: '573214567890',
        capacity: 1000,
        memberCount: 450
    },
    'EQUIPO_50': {
        id: 'team_004',
        name: 'Grupo de Crecimiento 50',
        leaderId: 'leader_test',
        capacity: 50,
        memberCount: 48,
        leaderWhatsApp: '5491100000004'
    }
};

export const getTeamByCode = (code: string): TeamConfig | undefined => {
    return MOCK_TEAMS[code.toUpperCase()];
};

import { UserGoals, DEFAULT_GOALS } from '../types';

const KEY_MAP: Record<string, keyof UserGoals> = {
    c: 'dailyContacts',
    f: 'dailyFollowUps',
    p: 'dailyPosts',
    i: 'monthlyIncome',
    n: 'companyName',
    s: 'sponsorName',
    h: 'productNiche',
    t: 'teamChallenge'
};

const INV_MAP: Record<keyof UserGoals, string> = Object.fromEntries(
    Object.entries(KEY_MAP).map(([k, v]) => [v, k])
) as any;

/**
 * Serializes the UserGoals object using the robust "Pipe Protocol".
 * Format: ?dup=c:5|f:3|n:HUYU|t:Reto%20Elite
 */
export const serializeGoals = (goals: UserGoals): string => {
    try {
        const parts: string[] = [];
        const ESSENTIAL_KEYS: (keyof UserGoals)[] = ['dailyContacts', 'dailyFollowUps', 'companyName', 'sponsorName', 'teamChallenge'];

        ESSENTIAL_KEYS.forEach((key) => {
            const value = goals[key];
            const shortKey = INV_MAP[key];
            if (shortKey && value !== undefined && value !== null && value !== '') {
                // Encode only the values to keep the structure clear
                const safeVal = encodeURIComponent(String(value)).replace(/%7C/g, '|'); // Avoid pipe escaping if possible
                parts.push(`${shortKey}:${safeVal}`);
            }
        });
        return parts.join('|');
    } catch (error) {
        console.error('Error serializing goals:', error);
        return '';
    }
};

/**
 * Deserializes the "Pipe Protocol" string back into UserGoals.
 */
export const deserializeGoals = (encoded: string = ''): UserGoals | null => {
    if (!encoded) return null;
    try {
        const goals: any = { ...DEFAULT_GOALS };
        // Split by pipe and colon
        const parts = encoded.split('|');
        let hasData = false;

        parts.forEach(part => {
            const [shortKey, val] = part.split(':');
            const fullKey = KEY_MAP[shortKey];
            if (fullKey && val !== undefined) {
                const decodedVal = decodeURIComponent(val);
                // Handle numeric vs string fields
                if (typeof DEFAULT_GOALS[fullKey] === 'number') {
                    goals[fullKey] = parseInt(decodedVal) || 0;
                } else {
                    goals[fullKey] = decodedVal;
                }
                hasData = true;
            }
        });

        return hasData ? (goals as UserGoals) : null;
    } catch (error) {
        console.error('Error deserializing goals:', error);
        return null;
    }
};

/**
 * Generates a full shareable URL based on the current environment.
 */
export const generateDuplicationLink = (goals: UserGoals): string => {
    const serialized = serializeGoals(goals);
    const baseUrl = 'https://networker-pro.netlify.app/';
    return `${baseUrl}?dup=${serialized}`;
};

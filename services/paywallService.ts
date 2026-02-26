// --- PAYWALL SERVICE (SIMULATION) ---
// This service manages the "IA Credits" and the simulated "Pro" status.

export interface PaywallStatus {
    isPro: boolean;
    creditsUsed: number;
    maxFreeCredits: number;
}

const STORAGE_KEY = 'networker_paywall_state';

const defaultState: PaywallStatus = {
    isPro: false,
    creditsUsed: 0,
    maxFreeCredits: 3 // Let's set it to 3 for a quick demo
};

export const paywallService = {
    getStatus(): PaywallStatus {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : defaultState;
    },

    useCredit(): boolean {
        const status = this.getStatus();
        if (status.isPro) return true;

        if (status.creditsUsed >= status.maxFreeCredits) {
            return false;
        }

        const newState = { ...status, creditsUsed: status.creditsUsed + 1 };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        window.dispatchEvent(new Event('paywall_update'));
        return true;
    },

    hasCredits(): boolean {
        const status = this.getStatus();
        return status.isPro || status.creditsUsed < status.maxFreeCredits;
    },

    getRemainingCredits(): number {
        const status = this.getStatus();
        if (status.isPro) return 999;
        return Math.max(0, status.maxFreeCredits - status.creditsUsed);
    },

    simulateUpgrade() {
        const status = this.getStatus();
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...status, isPro: true }));
        window.dispatchEvent(new Event('paywall_update'));
    },

    resetCredits() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
        window.dispatchEvent(new Event('paywall_update'));
    }
};

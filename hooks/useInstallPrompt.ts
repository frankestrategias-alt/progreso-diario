import { useState, useEffect } from 'react';

export const useInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if app is already installed (standalone mode)
        const checkStandalone = () => {
            const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone ||
                document.referrer.includes('android-app://');
            setIsStandalone(isStandaloneMode);
        };

        checkStandalone();
        window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandalone);

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        // Capture install prompt (Android/Chrome)
        const handler = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkStandalone);
        };
    }, []);

    const promptInstall = async () => {
        if (deferredPrompt) {
            // Show the install prompt
            deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                // We've used the prompt, and can't use it again, discard it
                setDeferredPrompt(null);
                setIsInstallable(false);
            }
        }
    };

    return { isInstallable, isIOS, isStandalone, promptInstall };
};

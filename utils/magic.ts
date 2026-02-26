import confetti from 'canvas-confetti';

export const triggerMagic = () => {
    // Sound (Magic Sparkle - Pleasant & Addictive)
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3');
    audio.volume = 0.15; // Subtle but clear
    audio.play().catch(e => console.log('Audio play failed', e));

    // Confetti
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#fbbf24', '#818cf8']
    });

    // Success Vibe
    triggerHaptic('success');
};

export const triggerHaptic = (type: 'light' | 'medium' | 'success' = 'medium') => {
    if (!('vibrate' in navigator)) return;

    switch (type) {
        case 'light':
            navigator.vibrate(30);
            break;
        case 'success':
            navigator.vibrate([60, 80, 60]);
            break;
        case 'medium':
        default:
            navigator.vibrate(70);
            break;
    }
};

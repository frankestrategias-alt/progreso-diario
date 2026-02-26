const fetch = require('node-fetch');

(async () => {
    try {
        const res = await fetch('https://networker-pro.netlify.app/.netlify/functions/ai-services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'gemini',
                payload: {
                    prompt: 'Hola',
                    temperature: 0.7
                }
            })
        });
        const data = await res.json();
        console.log('Gemini Response:', JSON.stringify(data, null, 2));

        const resTts = await fetch('https://networker-pro.netlify.app/.netlify/functions/ai-services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'tts',
                payload: {
                    text: 'Hola'
                }
            })
        });
        const dataTts = await resTts.json();
        console.log('TTS Response:', JSON.stringify(dataTts, null, 2).slice(0, 200) + '...');
    } catch (e) {
        console.error(e);
    }
})();

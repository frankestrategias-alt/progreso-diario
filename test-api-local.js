(async () => {
    try {
        console.log("Testing Gemini through Netlify dev port 8890...");
        const res = await fetch('http://localhost:8890/.netlify/functions/ai-services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'gemini',
                payload: {
                    prompt: 'Quien eres?',
                    history: [
                        { role: 'user', content: 'Iniciando asistente' },
                        { role: 'ai', content: 'Soy tu asistente Elite' },
                        { role: 'user', content: 'Como me llamo?' },
                        { role: 'ai', content: 'Te llamas Franco.' }
                    ],
                    temperature: 0.7
                }
            })
        });
        const text = await res.text();
        console.log('Raw Response:', text);

    } catch (e) {
        console.error("Test failed:", e);
    }
})();

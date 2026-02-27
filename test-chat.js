import fetch from 'node-fetch';

async function testChat() {
    console.log("Testing Gemini Chat Endpoint...");
    try {
        const res = await fetch('http://localhost:3001/.netlify/functions/ai-services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'gemini',
                payload: {
                    prompt: "Hola asisntente, ¿qué puedes hacer?",
                    history: [{ role: 'ai', content: '¡Hola! Soy tu Asistente Elite.' }],
                    systemInstruction: "You are a helpful assistant",
                    temperature: 0.7
                }
            })
        });

        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response Body:", text);
    } catch (err) {
        console.error("Fetch failed", err);
    }
}

testChat();

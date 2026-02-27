import fetch from 'node-fetch';

async function testTTS() {
    console.log("Testing TTS Endpoint...");
    try {
        const res = await fetch('http://localhost:3001/.netlify/functions/ai-services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'tts',
                payload: { text: "Hola, esto es una prueba super corta y directa." }
            })
        });

        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Body:", text);
    } catch (err) {
        console.error("Fetch failed", err);
    }
}

testTTS();

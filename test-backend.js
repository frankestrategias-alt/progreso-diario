import { handler } from './netlify/functions/ai-services.js';
import fs from 'fs';

const envStr = fs.readFileSync('.env.local', 'utf-8');
envStr.split('\\n').forEach(line => {
    if (line && line.includes('=')) {
        const [k, v] = line.split('=');
        process.env[k.trim()] = v.trim();
    }
});

console.log("Length:", process.env.VITE_GEMINI_API_KEY?.length);
console.log("Raw String:", JSON.stringify(process.env.VITE_GEMINI_API_KEY));

async function runTest() {
    console.log("Mocking Netlify Event...");
    const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
            action: 'gemini',
            payload: {
                prompt: "Hola asisntente, ¿qué puedes hacer?",
                systemInstruction: "You are a helpful assistant",
                temperature: 0.7
            }
        })
    };

    try {
        console.log("GOOGLE CLOUD KEY LOADED:", process.env.VITE_GOOGLE_CLOUD_API_KEY ? "YES" : "NO");
        const response = await handler(event);
        console.log("Status Code:", response.statusCode);
        if (response.statusCode === 500) {
            console.error("Function Error Body:", response.body);
        } else {
            console.log("Success Body:", response.body);
        }
    } catch (e) {
        console.error("Execution crashed:", e);
    }
}

runTest();

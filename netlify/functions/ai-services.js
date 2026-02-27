

export const handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        const { action, payload } = body;

        const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY
            || process.env.GEMINI_API_KEY
            || process.env.GEMINI_KEY;

        const GOOGLE_CLOUD_KEY = process.env.VITE_GOOGLE_CLOUD_API_KEY
            || process.env.GOOGLE_CLOUD_KEY
            || process.env.GOOGLE_CLOUD_API_KEY;

        const ELEVENLABS_API_KEY = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;

        if (action === "tts") {
            if (ELEVENLABS_API_KEY) {
                const voiceId = "pNInz6obpgDQGcFmaJgB"; // Adam - Voz super humana
                const elRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                    method: 'POST',
                    headers: { 'xi-api-key': ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: payload.text,
                        model_id: "eleven_multilingual_v2",
                        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                    })
                });

                if (elRes.ok) {
                    const arrayBuffer = await elRes.arrayBuffer();
                    const base64 = Buffer.from(arrayBuffer).toString('base64');
                    return {
                        statusCode: 200,
                        headers: { "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ audioContent: base64 })
                    };
                }
            }

            if (!GOOGLE_CLOUD_KEY) {
                return {
                    statusCode: 200,
                    headers: { "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ audioContent: null })
                };
            }

            const response = await fetch(
                `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_CLOUD_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        input: { text: payload.text },
                        voice: { languageCode: "es-US", name: "es-US-Journey-D" },
                        audioConfig: { audioEncoding: "MP3" }
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return {
                    statusCode: 200,
                    headers: { "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ audioContent: null, error: data })
                };
            }

            return {
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ audioContent: data.audioContent || null })
            };
        }

        if (action === "gemini") {
            if (!GEMINI_API_KEY) {
                return {
                    statusCode: 500,
                    headers: { "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ error: "API key de Gemini no configurada." })
                };
            }

            const modelId = "gemini-2.5-flash"; // Se revierte a 2.5-flash porque el 2.0-flash lanza error de permisos
            const { prompt, systemInstruction, temperature, responseMimeType, maxOutputTokens, history } = payload;

            let contents = [];

            // 1. Procesar y sanear historial para forzar alternancia estricta (user -> model -> user)
            if (history && Array.isArray(history)) {
                for (const msg of history) {
                    const mappedRole = msg.role === 'ai' ? 'model' : 'user';
                    const textContent = msg.content || "";

                    if (contents.length > 0 && contents[contents.length - 1].role === mappedRole) {
                        // Si el rol es el mismo que el anterior, concatenamos el texto para evitar doble turno
                        contents[contents.length - 1].parts[0].text += "\\n" + textContent;
                    } else {
                        contents.push({
                            role: mappedRole,
                            parts: [{ text: textContent }]
                        });
                    }
                }
            }

            // Gemini requiere que el historial comience siempre con el rol 'user'. 
            // Si nuestro primer mensaje fue la intro de la IA, le pre-cargamos un 'user' invisible
            if (contents.length > 0 && contents[0].role === 'model') {
                contents.unshift({ role: 'user', parts: [{ text: 'Hola, inicia el asistente.' }] });
            }

            // 2. Agregar el prompt actual al final
            if (prompt) {
                if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
                    // Si el último enviado al historial fue user, agrupamos este prompt
                    contents[contents.length - 1].parts[0].text += "\\n" + prompt;
                } else {
                    contents.push({ role: "user", parts: [{ text: prompt }] });
                }
            }

            const reqBody = {
                contents,
                generationConfig: {
                    temperature: temperature || 0.7,
                }
            };

            if (systemInstruction) {
                reqBody.systemInstruction = { parts: [{ text: systemInstruction }] };
            }
            if (responseMimeType) {
                reqBody.generationConfig.responseMimeType = responseMimeType;
            }
            if (maxOutputTokens) {
                reqBody.generationConfig.maxOutputTokens = maxOutputTokens;
            }

            const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody)
            });

            const dataContent = await geminiResponse.json();

            if (!geminiResponse.ok) {
                return {
                    statusCode: 500,
                    headers: { "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({
                        error: dataContent.error || "Gemini API error",
                        debugKeyLength: GEMINI_API_KEY ? GEMINI_API_KEY.length : 0,
                        debugKeyPrefix: GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 5) : ""
                    })
                };
            }

            const text = dataContent.candidates?.[0]?.content?.parts?.[0]?.text || "";

            return {
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ text })
            };
        }

        return {
            statusCode: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Invalid action" })
        };

    } catch (error) {
        console.error("Netlify Function Error:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: error.message })
        };
    }
};

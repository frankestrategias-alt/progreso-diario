

export const handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        const { action, payload } = body;

        const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        const GOOGLE_CLOUD_KEY = process.env.VITE_GOOGLE_CLOUD_API_KEY || process.env.GOOGLE_CLOUD_API_KEY;

        if (action === "tts") {
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
                        voice: { languageCode: "es-US", name: "es-US-Neural2-B" },
                        audioConfig: { audioEncoding: "MP3", pitch: 0, speakingRate: 1.0 }
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

            const modelId = "gemini-2.0-flash";
            const { prompt, systemInstruction, temperature, responseMimeType, maxOutputTokens } = payload;

            const reqBody = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
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
                    body: JSON.stringify({ error: dataContent.error || "Gemini API error" })
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

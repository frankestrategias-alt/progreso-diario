const callAiService = async (action: string, payload: any, maxRetries = 2) => {
  let lastError;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch('/.netlify/functions/ai-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });

      if (!response.ok) {
        // Solo reintentar en errores de servidor o cuota
        if (response.status === 429 || (response.status >= 500 && response.status <= 599)) {
          throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
      }

      return await response.json();
    } catch (error: any) {
      lastError = error;
      console.warn(`Attempt ${i + 1} for ${action} failed:`, error.message);

      if (i < maxRetries) {
        const delay = 1000 * Math.pow(2, i);
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }

  throw lastError;
};

const elevenLabsKey = import.meta.env?.VITE_ELEVENLABS_API_KEY || "";
const voiceId = "pNInz6obpgDQGcFmaJgB"; // Voz "Adam" o similar profesional

// --- VOIX ENGINE (GOOGLE CLOUD TTS) ---
let globalAudio: HTMLAudioElement | null = null;

export const unlockAudio = () => {
  if (typeof window !== 'undefined' && !globalAudio) {
    globalAudio = new Audio();
  }
  if (globalAudio) {
    globalAudio.play().catch(() => { });
    globalAudio.pause();
  }
};

const speakWithBrowser = async (text: string): Promise<void> => {
  return new Promise(async (resolve) => {
    window.speechSynthesis.cancel();

    // Limpiamos asteriscos, hashtags y emojis para evitar pronunciación de robots
    const cleanText = text
      .replace(/[*#]/g, '')
      .replace(/[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';

    // Mejorar la voz robótica: Buscar voces premium/naturales en el dispositivo
    let voices = window.speechSynthesis.getVoices();

    // Solucionar bug de Android/iOS donde las voces están vacías inicialmente
    if (voices.length === 0) {
      await new Promise<void>(r => {
        let fired = false;
        const handle = () => { if (!fired) { fired = true; r(); window.speechSynthesis.removeEventListener('voiceschanged', handle); } };
        window.speechSynthesis.addEventListener('voiceschanged', handle);
        setTimeout(() => { if (!fired) { fired = true; r(); } }, 1000);
      });
      voices = window.speechSynthesis.getVoices();
    }

    // Filtrar solo voces en español
    const spanishVoices = voices.filter(v => v.lang.toLowerCase().includes('es'));

    if (spanishVoices.length > 0) {
      // Clon exacto del regex de Sistema Premium 360
      const bestVoice = spanishVoices.find(v =>
        /premium|neural|sabina|google|natural|online/i.test(v.name)
      );
      utterance.voice = bestVoice || spanishVoices[0];
    }

    utterance.rate = 1.05; // Slightly faster for energy
    utterance.pitch = 1.0;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
};

export const speak = async (text: string): Promise<void> => {
  // Limpiamos la pronunciación de viñetas, emojis y formatos markdown
  const cleanText = text
    .replace(/\*/g, '')
    .replace(/#/g, '')
    .replace(/[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}]/gu, '')
    .trim();

  // --- CHUNKING LOGIC ---
  const matchResult = cleanText.match(/[^.?!]+[.?!]+|\s*[^.?!]+$/g);
  let chunks: string[] = matchResult ? Array.from(matchResult) as string[] : [];
  chunks = chunks.map(c => c.trim()).filter(c => c.length > 0);

  let optimizedChunks: string[] = [];
  let currentChunk = "";
  for (let i = 0; i < chunks.length; i++) {
    if ((currentChunk.length + chunks[i].length) < 160) {
      currentChunk += (currentChunk ? " " : "") + chunks[i];
    } else {
      if (currentChunk) optimizedChunks.push(currentChunk);
      currentChunk = chunks[i];
    }
  }
  if (currentChunk) optimizedChunks.push(currentChunk);

  if (optimizedChunks.length === 0) optimizedChunks = [cleanText.substring(0, 199)];

  // --- AUDIO QUEUE & PRE-BUFFERING ---
  let audioQueue: any[] = [];
  let isPlaying = false;
  let currentChunkIndex = 0;

  const fetchAudioForChunk = async (chunkIndex: number) => {
    if (chunkIndex >= optimizedChunks.length) return null;
    const textChunk = optimizedChunks[chunkIndex];

    try {
      const data = await callAiService("tts", { text: textChunk });
      if (data.audioContent) {
        const audioUrl = "data:audio/mp3;base64," + data.audioContent;
        const audio = new Audio(audioUrl);
        return { isBrowserFallback: false, audio, text: textChunk };
      } else {
        return { isBrowserFallback: true, text: textChunk };
      }
    } catch (e) {
      console.warn(`Premium TTS failed for chunk ${chunkIndex}. Using fallback...`, e);
      try {
        const safeChunk = textChunk.substring(0, 199);
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=es&q=${encodeURIComponent(safeChunk)}`;
        const audio = new Audio(url);
        return { isBrowserFallback: false, audio, text: textChunk };
      } catch (err2) {
        return { isBrowserFallback: true, text: textChunk };
      }
    }
  };

  const playNextInQueue = async () => {
    if (audioQueue.length === 0 && currentChunkIndex >= optimizedChunks.length) {
      isPlaying = false;
      return;
    }

    isPlaying = true;
    if (audioQueue.length > 0) {
      const audioToPlay = audioQueue.shift();

      // PRE-BUFFER: Download next while playing
      if (currentChunkIndex < optimizedChunks.length) {
        fetchAudioForChunk(currentChunkIndex).then(nextAudio => {
          if (nextAudio) audioQueue.push(nextAudio);
          currentChunkIndex++;
        });
      }

      if (audioToPlay.isBrowserFallback) {
        await speakWithBrowser(audioToPlay.text);
        playNextInQueue();
      } else {
        globalAudio = audioToPlay.audio;
        globalAudio!.onended = () => { playNextInQueue(); };
        globalAudio!.onerror = () => { playNextInQueue(); };
        const playPromise = globalAudio!.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.warn("Autoplay bloqueado:", e);
            playNextInQueue();
          });
        }
      }
    } else {
      const nextAudio = await fetchAudioForChunk(currentChunkIndex);
      currentChunkIndex++;
      if (nextAudio) {
        audioQueue.push(nextAudio);
        playNextInQueue();
      } else {
        isPlaying = false;
      }
    }
  };

  // ARRANCAR COLA
  const firstAudio = await fetchAudioForChunk(currentChunkIndex);
  currentChunkIndex++;
  if (firstAudio) {
    audioQueue.push(firstAudio);
    playNextInQueue();
  } else {
    speakWithBrowser(cleanText);
  }
};


const SYSTEM_INSTRUCTION = `Expert mentor in Network Marketing. Style: CLEAR, DIRECT, HUMAN. Focus: Action. Language: Spanish.
Rules:
1. BREVITY IS PRIORITY: Max 35 words per response (about 4-5 lines).
2. NATURAL HUMAN SPEECH: Do NOT use technical terms like "acento", "tilde", "asterisco", "paréntesis" or "emoji". Just speak naturally. No sales robot talk.
3. EMPATHY FIRST: Connect quickly, then give a short action-oriented task.`;

const modelId = "gemini-1.5-flash"; // Estándar validado para la API de Gemini

// --- SAFE MOCK SYSTEM (FALLBACKS) ---
// Expanded to ensure variety even without API Key
const MOCK_RESPONSES = {
  contact: [
    "Hola [Nombre], ¡tiempo sin verte! Vi tu reciente post sobre [Tema] y *me encantó tu perspectiva*. ¿Cómo ha ido todo últimamente?",
    "¡Hola [Nombre]! Estaba organizando mis contactos y *me acordé de ti*. ¿Sigues trabajando en [Industria/Lugar]? Espero que todo vaya genial.",
    "[Nombre], ¡qué bueno verte por aquí! Tenía tiempo queriendo saludarte. *¿Qué hay de nuevo en tu vida?* Cuéntame.",
    "¡Hola [Nombre]! *Pensé en ti hoy* viendo algo sobre emprendimiento. ¿Te gustaría ponerte al día pronto?",
    "Hola, espero que estés teniendo una semana increíble. *Vi algo que creo que te podría interesar*. ¿Tienes un minuto?",
    "¡Hola! Solo pasaba a saludar y desearte mucho éxito. *Tu energía siempre inspira*. Un abrazo.",
    "Hola [Nombre], hace mucho no hablamos. Vi que estás en [Ciudad/Actividad], ¡se ve genial! ¿Cómo va todo?",
    "¡Ey [Nombre]! Me apareció tu perfil y recordé cuando [mencionar recuerdo vago o general]. ¿Qué es de tu vida?",
    "Hola [Nombre], espero que estés de maravilla. *Tengo una pregunta rápida* sobre tu sector, ¿tienes un segundo?",
    "¡Hola! Viendo tu perfil me di cuenta que tenemos varios intereses en común. *Me encantaría conectar mejor*. ¿Cómo va tu semana?"
  ],
  followUp: [
    "Hola [Nombre], ¿pudiste revisar la información que te envié? *Me gustaría saber tu opinión honesta*.",
    "Solo pasaba a saludarte, [Nombre]. *No quiero ser inoportuno*, pero ¿sigues interesado en [Beneficio]? Avísame.",
    "¡Hola! ¿Cómo va todo? *Pensé en ti* porque se liberó un cupo para [Evento/Promo]. ¿Te interesa?",
    "Hola [Nombre], espero no molestar. *¿Tuviste chance de pensarlo?* Estoy aquí para resolver cualquier duda.",
    "¡Hola! *Me quedé pensando en nuestra última charla*. Creo que esto realmente podría ayudarte con [Problema]. ¿Qué opinas?",
    "[Nombre], *no quiero que pierdas esta oportunidad*. ¿Hablamos mañana?",
    "Hola [Nombre], imagino que has estado a full. *Solo quería asegurarme de que no te quedaras con dudas*. ¿Todo claro?",
    "¡Hola! Simplemente checking-in. *¿Sigue siendo un buen momento para explorar esto* o prefieres que lo retomemos luego?",
    "[Nombre], encontré un recurso que te puede servir para lo que hablamos. *¿Te lo paso?*",
    "Hola [Nombre], voy a cerrar inscripciones/pedidos pronto y *quería darte prioridad*. ¿Cuento contigo?"
  ],
  objection: {
    money: [
      "Entiendo perfectamente, *yo pensaba lo mismo al inicio*. Pero pregúntate: ¿Si el dinero no fuera un problema, lo harías? A veces la inversión es en uno mismo.",
      "Te comprendo, la inversión siempre genera dudas. *¿Es el monto lo que te preocupa o el retorno del negocio?* Hablemos de números.",
      "Entiendo, el capital es sagrado. *¿Has pensado que este negocio precisamente ayuda a que el dinero deje de ser un problema?* Te muestro cómo."
    ],
    time: [
      "Lo entiendo, todos estamos ocupados. *La pregunta es si lo que haces hoy te dará más tiempo mañana*. Este negocio está diseñado para gente ocupada.",
      "Te entiendo, el tiempo es nuestro recurso más valioso. *Justamente buscamos libertad*. ¿Te gustaría saber cómo optimizar 1 hora al día?",
      "Comprendo, yo también tenía poco tiempo. *¿Sabías que los más exitosos aquí empezaron así?* Se trata de prioridades, no de horas."
    ],
    pyramid: [
      "Entiendo tu preocupación, es una duda común. *Las pirámides son ilegales*. Aquí solo ganamos si se mueve un producto real. ¿Te gustaría ver cómo funciona?",
      "Te entiendo, hay mucha confusión ahí fuera. *En una pirámide no hay producto*. Aquí tenemos [Producto] con registros legales. ¿Lo revisamos?",
      "Comprendo, la transparencia es clave. *Estamos regulados por la ley de MLM*. Solo ganamos por volumen de ventas real. ¿Quieres ver el plan?"
    ],
    partner: [
      "Me parece genial que consultes. *La opinión de tu pareja es clave*. ¿Qué te parece si le presentamos la idea juntos para que tenga toda la información?",
      "Entiendo, es un proyecto familiar. *¿Qué es lo que crees que más le preocuparía a ella/él?* Preparemos las respuestas juntos.",
      "Te comprendo, el apoyo en casa es vital. *¿Y si le mostramos los resultados de otros equipos?* Eso suele dar mucha tranquilidad."
    ],
    sales: [
      "¡Te entiendo! A mí tampoco me gusta 'vender'. *Aquí lo que hacemos es recomendar* algo que nos gusta, igual que una serie o un restaurante.",
      "Te comprendo, la palabra 'venta' asusta. *Enfócate en ayudar y solucionar problemas*. Verás que fluye de forma natural.",
      "Entiendo, pero piénsalo así: *Vender es simplemente educar sobre una solución*. Tú solo compartes el beneficio, ellos deciden."
    ],
    skeptic: [
      "Es bueno ser escéptico, demuestra inteligencia. *Yo solo te pido que revises la info y decidas por ti mismo*. ¿Justo, no?",
      "Te entiendo, hay que ser cauteloso. *Mira los hechos y los testimonios reales*. La evidencia habla más fuerte que las promesas.",
      "Comprendo, yo también dudé. *¿Qué dato específico necesitas para sentirte 100% seguro?* Te lo consigo ahora mismo."
    ],
    default: [
      "Entiendo lo que dices. *Muchas personas exitosas aquí tenían la misma duda al principio*. Lo importante es informarse bien. ¿Qué es lo que más te preocupa exactamente?",
      "Te comprendo, es normal tener dudas. *¿Podrías decirme qué punto específico te hace dudar?* Así puedo aclararlo mejor.",
      "Entiendo, no hay prisa. *Mi meta es que tomes la mejor decisión para ti*. ¿Qué información te falta para dar el paso?"
    ]
  },
  audioDirectives: {
    Empático: [
      "Baja el volumen al inicio, inclina la cabeza ligeramente un poco hacia la izquierda. Haz una pausa larga antes de la pregunta final.",
      "Usa una voz cálida, exhala suavemente antes de hablar. Mantén contacto visual suave sin ser agresivo.",
      "Habla como si estuvieras contando un secreto valioso. Usa pausas de 2 segundos para dejar que tus palabras 'aterrizen'."
    ],
    Firme: [
      "Espalda recta, mentón paralelo al suelo. Habla con un ritmo constante, sin titubeos. Proyecta seguridad desde el diafragma.",
      "Mira fijamente (sin parpadear excesivamente) mientras haces la pregunta. No sonrías hasta que el prospecto responda.",
      "Voz profunda y pausada. Evita el tono de súplica. Si es por audio, graba con el pecho abierto para que la voz no suene delgada."
    ],
    Directo: [
      "Ritmo rápido en la primera frase, pausa en seco antes de la pregunta clave. Mantén gestos mínimos y precisos.",
      "Responde sin rodeos. Tu voz debe sonar como la de un médico dando un diagnóstico: Neutral, clara y profesional.",
      "Corta el ruido. Identifica el punto principal y ve directo a él con una voz clara y un poco más alta de lo normal."
    ]
  },
  motivation: [
    "La disciplina es hacer lo que tienes que hacer, *incluso cuando no quieres*. ¡Haz esa llamada ya!",
    "No te rindas. *El éxito es la suma de pequeños esfuerzos repetidos día tras día*.",
    "Tu futuro se crea con lo que haces hoy, no mañana. *¡Actúa ahora!*",
    "Recuerda por qué empezaste. *Ese sueño vale cada esfuerzo*. ¡Vamos!",
    "El dolor de la disciplina pesa onzas, *el del arrepentimiento pesa toneladas*.",
    "No necesitas ser grande para empezar, pero *necesitas empezar para ser grande*.",
    "Tu equipo te está esperando. *Lidera con el ejemplo hoy*.",
    "Cada 'No' te acerca más al próximo 'SÍ'. *¡Sigue buscando!*",
    "Hoy es un buen día para estar orgulloso de ti mismo. *Haz que cuente*.",
    "La acción cura el miedo. *¡Dalo todo por 5 minutos y mira qué pasa!*"
  ],
  postIdea: "1. GANCHO: ¿Sabías que el 90% se rinde antes de empezar? --- 2. IDEA: Comparte una foto trabajando desde casa o un café. --- 3. FORMATO: Historia. --- 4. CTA: Reacciona con un 🔥 si eres del 10%."
};

const getRandomMock = (list: string[]) => list[Math.floor(Math.random() * list.length)];

const getRandomMocks = (list: string[], count: number = 3) => {
  const shuffled = [...list].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join('\n---\n');
};

export const generateContactScript = async (context: string, platform: string, tone: string = "Casual", companyName: string = "", productNiche: string = ""): Promise<string> => {
  try {
    const prompt = `Genera un mensaje de contacto inicial. Contexto: ${context}. Plataforma: ${platform}. Tono: ${tone}. Empresa/Compañía: ${companyName || 'No especificada'}. Nicho: ${productNiche || 'No especificado'}.`;
    const data = await callAiService("gemini", {
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    });

    return data.text || "Mi servidor está experimentando un poco de latencia. Por favor, intenta crear tu guión de nuevo en unos segundos.";
  } catch (error: any) {
    console.warn("AI Error (Contact):", error.message);
    if (error.message?.includes("429")) {
      console.error("Quota exceeded - Consider upgrading billing tier.");
    }
    return "Mi servidor de IA está temporalmente saturado. Por favor, danos un minuto y vuelve a intentar.";
  }
};

export const generateFollowUpScript = async (lastInteraction: string, daysAgo: string, interestLevel: string, tone: string = "Profesional", companyName: string = "", productNiche: string = ""): Promise<string> => {
  try {
    const prompt = `Genera un mensaje de seguimiento. Última interacción: ${lastInteraction}. Hace cuántos días: ${daysAgo}. Nivel de interés: ${interestLevel}. Tono: ${tone}. Empresa: ${companyName || 'No especificada'}. Nicho: ${productNiche || 'No especificado'}.`;
    const data = await callAiService("gemini", {
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    });

    return data.text || "La inteligencia artificial está tardando en responder. Intenta recargar tu solicitud de seguimiento en un par de segundos.";
  } catch (error: any) {
    console.warn("AI Error (FollowUp):", error.message);
    return "La red está experimentando alta demanda. Regresa en un minuto e intenta tu seguimiento nuevamente.";
  }
};

export interface SocialStrategy {
  mainPost: string;
  cta: string;
  imageHint: string;
  videoScript?: {
    hook: string;
    body: string;
    cta: string;
  };
  proInsights: {
    post: string;
  };
}

const getThemeOfDay = () => {
  const days = ['Domingo: Reflexión y Planificación', 'Lunes: Mentalidad y Visión', 'Martes: Estilo de Vida y Curiosidad', 'Miércoles: Producto (Tip o Solución)', 'Jueves: Pruebas Sociales y Resultados', 'Viernes: Invitación Directa al Negocio', 'Sábado: Estilo de Vida / Detrás de Cámaras'];
  return days[new Date().getDay()];
};

export const generateSocialPost = async (network: string, goal: string, mood: string, companyName: string = "", customContext: string = "", productNiche: string = ""): Promise<SocialStrategy> => {
  try {
    const prompt = `Actúa como estratega de contenido. Genera una estrategia para una publicación. Red social: ${network}. Objetivo: ${goal}. Tono/Mood: ${mood}. Empresa: ${companyName || 'No especificada'}. Contexto adicional: ${customContext}. Nicho: ${productNiche || 'No especificado'}.
    Devuelve un JSON con la estructura: {"mainPost": "...", "cta": "...", "imageHint": "...", "videoScript": {"hook": "...", "body": "...", "cta": "..."}, "proInsights": {"post": "..."}}`;
    const data = await callAiService("gemini", {
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.8,
      responseMimeType: "application/json"
    });

    const text = data.text || "{}";
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);

  } catch (error: any) {
    console.warn("AI Error (SocialPost):", error.message);
    // Fallback if AI fails (e.g. Quota Exceeded). Return latency notice instead of fake success.
    return {
      mainPost: "Mi sistema está experimentando alta latencia. Por favor, intenta generar tu publicación de nuevo en breve.",
      cta: "Reintentar en 60s",
      imageHint: "La conexión con el servidor IA fue interrumpida. Reintentando...",
      proInsights: { post: "Asegúrate de tener buena conexión a internet." }
    };
  }
};

export interface ObjectionStrategy {
  script: string;
  psychology: string;
  tone: string;
  audioDirective: string;
}

export const generateObjectionResponse = async (objection: string, companyName: string = "", tone: string = "Empático"): Promise<ObjectionStrategy> => {
  try {
    const prompt = `Genera una respuesta para el manejo de una objeción de prospecto. Objeción del prospecto: "${objection}". Empresa: ${companyName || 'No especificada'}. Tono: ${tone}.
    Devuelve un JSON con la estructura: {"script": "Respuesta qué decirle", "psychology": "Por qué funciona", "tone": "Tono de voz", "audioDirective": "Cómo decirlo en audio"}`;
    const data = await callAiService("gemini", {
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.8,
      responseMimeType: "application/json"
    });

    const text = data.text || "{}";
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);

  } catch (error: any) {
    console.warn("AI Error (Objection):", error.message);

    return {
      script: "Mi servidor está experimentando un poco de latencia o tu cuota ha sido excedida. Dame un minuto y compruébalo.",
      psychology: "Transparencia: Avisar de fallo de red.",
      tone: "Informativo",
      audioDirective: "Tono natural."
    };
  }
};

export const generateDailyMotivation = async (goals: any, progress: any): Promise<string> => {
  try {
    const prompt = `Genera un mensaje corto de motivación diaria (máximo 1 o 2 oraciones) para un emprendedor. Sus metas: ${JSON.stringify(goals)}. Su progreso actual: ${JSON.stringify(progress)}.`;
    const data = await callAiService("gemini", {
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      maxOutputTokens: 100,
    });

    return data.text || "Fallo de comunicación temporal con el servidor IA. Continúa con tu hábito y reconéctate luego.";
  } catch (error: any) {
    console.warn("AI Error (Motivation):", error.message);
    return "Mi red está saturada. Tómalo con calma y vuelve a intentar más tarde.";
  }
};

export const generateDailyPostIdea = async (): Promise<string> => {
  try {
    const prompt = `Genera 1 IDEA BREVE para publicar hoy. Formato deseado: 1. GANCHO... 2. IDEA... 3. FORMATO... 4. CTA...`;
    const data = await callAiService("gemini", {
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.8,
    });

    return data.text || "1. GANCHO: Espera un momento... --- 2. IDEA: Mi servidor tiene latencia. --- 3. FORMATO: Texto --- 4. CTA: Vuelve a intentar en unos segundos.";
  } catch (error: any) {
    console.warn("AI Error (PostIdea):", error.message);
    return "1. ERROR: Latencia de Red --- 2. SOLUCIÓN: Intentar en 1 minuto. --- 3. FORMATO: Texto --- 4. CTA: Reintenta pronto.";
  }
};

export const generateRescuePost = async (): Promise<{ type: string, text: string, visual: string, objective: string }> => {
  try {
    const prompt = `Genera un "post salvavidas" de emergencia para mantener la constancia hoy. Devuelve EXACTAMENTE esta estructura separada por ||| (sin markdown ni nada más):
Tipo de Post ||| Texto del Post ||| Sugerencia Visual ||| Objetivo Psicológico`;
    const data = await callAiService("gemini", {
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.9,
    });

    const raw = data.text || "";
    const parts = raw.split('|||');

    if (parts.length >= 4) {
      return {
        type: parts[0].trim(),
        text: parts[1].trim(),
        visual: parts[2].trim(),
        objective: parts[3].trim()
      };
    }

    throw new Error("Invalid Format");

  } catch (error: any) {
    console.warn("AI Error (RescuePost):", error.message);
    return {
      type: "Emergencia (Offline)",
      text: "La disciplina es hacer lo que tienes que hacer, incluso cuando no quieres. Hoy cumplo por mí y por mi futuro. 💪✨ #Compromiso #Networker",
      visual: "Fondo negro o foto de tu espacio de trabajo actual. Sin música.",
      objective: "Demostrar constancia inquebrantable a pesar de las dificultades."
    };
  }
};

export type HabitScenario = 'SUCCESS' | 'PUSH' | 'RESCUE_WIN';

export const generateHabitMessage = async (scenario: HabitScenario): Promise<string> => {
  const prompt = `
    El usuario acaba de reportar sobre su hábito de publicar hoy.
    Escenario: ${scenario}
    
    Contexto:
    - SUCCESS: Hizo el trabajo normal.
    - PUSH: No lo hizo.
    - RESCUE_WIN: Estaba cansado, casi renuncia, pero usó el "Modo Salvavidas" y cumplió.
    
    Genera UNA frase corta (máximo 12 palabras).
    
    Si es RESCUE_WIN: ¡Celebra la RESILIENCIA! Dile que ganar en un día malo vale doble.
    Si es SUCCESS: Celebra su identidad de líder.
    Si es PUSH: Empatía estoica.
    
    Tono: Coach maduro.
  `;

  try {
    const data = await callAiService("gemini", {
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 1,
      maxOutputTokens: 50,
    });

    return data.text?.trim() || "La constancia construye tu futuro.";
  } catch (error) {
    if (scenario === 'RESCUE_WIN') return "¡Ganar en días difíciles forja el carácter!";
    return scenario === 'SUCCESS' ? "¡Gran trabajo hoy! Sigues sumando." : "Mañana será otro día. No te rindas.";
  }
};

const ELITE_ASSISTANT_PROMPT = `Eres el Asistente Elite de Networker Pro, el mentor personal del usuario. 
Tu misión es forjar el hábito diario de éxito y convertir cada entrada a la app en resultados medibles.

PSICOLOGÍA DE ALTO IMPACTO (DOPAMINA Y EGO):
1. RECONOCIMIENTO Y EGO: Usa palabras que alimenten el orgullo del usuario por su disciplina. Hazlo sentir especial, parte de una élite que ejecuta mientras otros solo sueñan.
2. ADICCIÓN POSITIVA: Asocia cada entrada a la app con progreso, racha activa y estatus. Salir sin ejecutar debe sentirse como perder impulso.
3. CRECIMIENTO VIRAL: Motiva a compartir la app para subir de nivel y desbloquear beneficios, posicionando al usuario como un líder que duplica su éxito.

CONOCIMIENTO DEL SISTEMA NETWORKER PRO:
1. PROSPECCIÓN E INVITACIÓN: Iniciar contactos ágiles. La meta es la curiosidad, no dar toda la información.
2. SEGUIMIENTO: El dinero está en el seguimiento. Persistencia profesional usando los guiones de la app.
3. OBJECIONES: Usar el módulo de Objeciones para reencuadrar dinero, tiempo o dudas sobre pirámides.
4. NIVELES Y ESTATUS: Subir de nivel desbloquea funciones. La racha diaria es la clave del rango.
5. DUPLICACIÓN: El Botón de Duplicación (Dopamina de Equipo) es para que el equipo crezca rápido. Es liderazgo puro.

REGLAS CRÍTICAS PARA LA VOZ (OBLIGATORIO):
1. MÁXIMO 35 PALABRAS: Tus respuestas deben ser breves pero naturales. IMPORTANTE: NUNCA dejes oraciones a medias o incompletas. Si te acercas al límite de extensión, ASEGÚRATE de concluir la frase lógicamente con un punto final.
2. PROHIBIDO JERGA TÉCNICA: NUNCA digas palabras como "acento", "tilde", "punto", "coma", "asterisco", "emoji". Habla y compórtate como un mentor humano real.
3. SIN FORMATO VISUAL: No uses asteriscos, negritas, guiones ni emojis. Escribe en texto plano completamente limpio.
4. FOCO EN ACCIÓN: Dirige siempre al usuario hacia Contactar, Seguimiento o Publicar en la plataforma.

El usuario acaba de decir: `;

export const generateEliteAssistantResponse = async (userMessage: string, history: { role: string, content: string }[] = []): Promise<string> => {
  try {
    const data = await callAiService("gemini", {
      prompt: userMessage,
      history: history,
      systemInstruction: ELITE_ASSISTANT_PROMPT,
      temperature: 0.8,
    });

    return data.text || "¡Excelente pregunta! Lo más importante ahora es que mantengas tu consistencia en los Contactos. ¿Ya hiciste los tuyos hoy?";
  } catch (error: any) {
    console.warn("AI Error (EliteAssistant):", error.message);
    return "Mi servidor de IA está experimentando alta demanda o restricciones de cuota. Por favor, dame un segundo y vuelve a preguntarme.";
  }
};
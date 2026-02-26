const callAiService = async (action: string, payload: any) => {
  try {
    const response = await fetch('/.netlify/functions/ai-services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Error calling AI Service:", error);
    throw error;
  }
};

const elevenLabsKey = import.meta.env?.VITE_ELEVENLABS_API_KEY || "";
const voiceId = "pNInz6obpgDQGcFmaJgB"; // Voz "Adam" o similar profesional

// --- VOIX ENGINE (GOOGLE CLOUD TTS) ---
const speakWithBrowser = async (text: string): Promise<void> => {
  return new Promise(async (resolve) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/\*/g, ''));
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

    const isES = (lang: string) => lang.startsWith('es');
    const isPremium = (name: string) =>
      name.includes('Google') || name.includes('Neural') ||
      name.includes('Natural') || name.includes('Sabina') ||
      name.includes('Premium');

    let selectedVoice = voices.find(v => isES(v.lang) && isPremium(v.name));
    if (!selectedVoice) {
      selectedVoice = voices.find(v => isES(v.lang));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 1.05; // Slightly faster for energy
    utterance.pitch = 1.0;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
};

export const speak = async (text: string): Promise<void> => {
  try {
    const data = await callAiService("tts", { text });
    if (!data.audioContent) throw new Error("No audio content from Google TTS");
    if (!data.audioContent) throw new Error("No audio content from Google TTS");

    const audioBlob = b64toBlob(data.audioContent, 'audio/mp3');
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    await new Promise<void>((resolve, reject) => {
      audio.onended = () => resolve();
      audio.onerror = reject;
      audio.play().catch(reject);
    });
  } catch (error) {
    console.warn("Google TTS failed, using Browser Speech:", error);
    await speakWithBrowser(text);
  }
};

// Helper para convertir base64 a Blob
const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
};


const SYSTEM_INSTRUCTION = `Expert mentor in Network Marketing. Style: Clear, direct, human. Focus: Action. Language: Spanish.
Rules:
1. Short, natural messages. No robot/aggressive sales.
2. Initial goal: Conversation, empathy.
3. Use *bold* (asterisks) for key phrases/questions.`;

const modelId = "gemini-2.0-flash"; // Stable and fast in 2026

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
    const data = await callAiService("gemini", {
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    });

    return data.text || getRandomMocks(MOCK_RESPONSES.contact, 3);
  } catch (error: any) {
    console.warn("AI Error (Contact):", error.message);
    if (error.message?.includes("429")) {
      console.error("Quota exceeded - Consider upgrading billing tier.");
    }
    return getRandomMocks(MOCK_RESPONSES.contact, 3);
  }
};

export const generateFollowUpScript = async (lastInteraction: string, daysAgo: string, interestLevel: string, tone: string = "Profesional", companyName: string = "", productNiche: string = ""): Promise<string> => {
  try {
    const data = await callAiService("gemini", {
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    });

    return data.text || getRandomMocks(MOCK_RESPONSES.followUp, 3);
  } catch (error: any) {
    console.warn("AI Error (FollowUp):", error.message);
    return getRandomMocks(MOCK_RESPONSES.followUp, 3);
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
    // Fallback library to ensure the app never feels repetitive/stuck
    const fallbacks = [
      {
        mainPost: "Hoy elegí que *la visión supere a la duda*. No se trata de dónde estás, sino de a dónde vas. ¿Quién más está en modo construcción?",
        cta: "Escribe 'VISIÓN' para conectar.",
        imageHint: `MISIÓN VISUAL: Debes crear una FOTO de estilo de vida sosteniendo un café frente a tu laptop y LUEGO SUBIRLO a tu ${network === 'WhatsApp' ? 'Estados de WhatsApp' : network}`,
        proInsights: { post: "RAZÓN PSICOLÓGICA: La vulnerabilidad mezclada con visión genera confianza y autoridad inmediata." }
      },
      {
        mainPost: "Muchos buscan el 'momento perfecto', yo busco el *momento de decidir*. El éxito es una suma de decisiones diarias.",
        cta: "Dale ❤️ si estás de acuerdo.",
        imageHint: `MISIÓN VISUAL: Debes crear un VIDEO de 5 segundos de tus pies caminando y LUEGO SUBIRLO a tu ${network === 'WhatsApp' ? 'Estados de WhatsApp' : network}`,
        proInsights: { post: "RAZÓN PSICOLÓGICA: El movimiento físico en video simboliza progreso y atrae la vista." }
      },
      {
        mainPost: "Si pudieras cambiar una sola cosa de tu rutina hoy para acercarte a tus sueños, ¿qué sería? Yo elegí *la disciplina sobre la motivación*.",
        cta: "Comenta tu cambio abajo 👇",
        imageHint: `MISIÓN VISUAL: Debes crear una FOTO de detalle de un libro abierto con luz natural y LUEGO SUBIRLO a tu ${network === 'WhatsApp' ? 'Estados de WhatsApp' : network}`,
        proInsights: { post: "RAZÓN PSICOLÓGICA: Los planos cerrados generan curiosidad y pausa el scroll." }
      },
      {
        mainPost: "El secreto del Network Marketing no es encontrar a la persona correcta, sino *convertirte en la persona correcta*. Seguimos creciendo.",
        cta: "Comparte si te resuena.",
        imageHint: `MISIÓN VISUAL: Debes crear una FOTO capturando un momento de trabajo 'detrás de cámaras' y LUEGO SUBIRLO a tu ${network === 'WhatsApp' ? 'Estados de WhatsApp' : network}`,
        proInsights: { post: "RAZÓN PSICOLÓGICA: Las fotos naturales (candid) tienen un 40% más de engagement." }
      },
      {
        mainPost: "¿Te has sentido estancado alguna vez? Yo también. *La clave fue dejar de mirar el resultado y enamorarme del proceso*. ¿Te pasa?",
        cta: "Responde 'PROCESO' si estás en ello",
        imageHint: `MISIÓN VISUAL: Debes crear un VIDEO TIME-LAPSE (cámara rápida) de 10 segundos trabajando/organizando y LUEGO SUBIRLO a tu ${network === 'WhatsApp' ? 'Estados de WhatsApp' : network}`,
        proInsights: { post: "RAZÓN PSICOLÓGICA: Mostrar el trabajo duro 'sucio' genera más conexión que el éxito pulido." }
      },
      {
        mainPost: "No es suerte, es *consistencia*. Mientras otros duermen, algunos estamos construyendo el futuro. Buenas noches, equipo.",
        cta: "Un 🔥 por los que construyen.",
        imageHint: `MISIÓN VISUAL: Debes crear una FOTO nocturna con luz tenue de tu espacio de trabajo (o una taza de té) y LUEGO SUBIRLO a tu ${network === 'WhatsApp' ? 'Estados de WhatsApp' : network}`,
        proInsights: { post: "RAZÓN PSICOLÓGICA: Pertenencia a un grupo exclusivo (los que trabajan duro)." }
      },
      {
        mainPost: "3 cosas que aprendí esta semana: 1. Tu mente cree lo que le dices. 2. La acción mata el miedo. 3. *Tú puedes más de lo que crees*.",
        cta: "Guarda esto para leerlo mañana.",
        imageHint: `MISIÓN VISUAL: Debes crear un VIDEO tipo 'Selfie' hablando (o solo asintiendo con música) y LUEGO SUBIRLO a tu ${network === 'WhatsApp' ? 'Estados de WhatsApp' : network}`,
        proInsights: { post: "RAZÓN PSICOLÓGICA: Las listas (1, 2, 3) son ultra-leíbles y compartibles." }
      },
      {
        mainPost: "Deja de esperar que las cosas sean más fáciles. *Empieza a ser tú mejor*. El crecimiento duele, pero la mediocridad duele más.",
        cta: "Comenta 'CRECIMIENTO' si estás listo.",
        imageHint: `MISIÓN VISUAL: Debes crear una FOTO de tus herramientas de trabajo (agenda, boli, móvil) ordenadas perfectamente y LUEGO SUBIRLO a tu ${network === 'WhatsApp' ? 'Estados de WhatsApp' : network}`,
        proInsights: { post: "RAZÓN PSICOLÓGICA: El orden visual transmite claridad mental y profesionalismo." }
      }
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
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

    // Mapping keys for mock selection
    const keyMap: Record<string, string> = {
      "No tengo dinero": "money",
      "No tengo tiempo": "time",
      "Es una pirámide": "pyramid",
      "Tengo que consultarlo con mi pareja": "partner",
      "No soy bueno vendiendo": "sales",
      "Déjame pensarlo": "default"
    };

    const key = keyMap[objection] || "default";
    const responses = (MOCK_RESPONSES.objection as any)[key] || MOCK_RESPONSES.objection.default;
    const selectedScript = getRandomMock(responses);

    // Select a better mock directive based on tone
    const toneDirectives = (MOCK_RESPONSES.audioDirectives as any)[tone] || MOCK_RESPONSES.audioDirectives.Empático;
    const selectedDirective = getRandomMock(toneDirectives);

    return {
      script: selectedScript,
      psychology: "Validación de la duda y reencuadre hacia la solución.",
      tone: tone || "Empático y suave",
      audioDirective: selectedDirective
    };
  }
};

export const generateDailyMotivation = async (goals: any, progress: any): Promise<string> => {
  try {
    const data = await callAiService("gemini", {
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      maxOutputTokens: 100,
    });

    return data.text || getRandomMock(MOCK_RESPONSES.motivation);
  } catch (error: any) {
    console.warn("AI Error (Motivation):", error.message);
    return getRandomMock(MOCK_RESPONSES.motivation);
  }
};

export const generateDailyPostIdea = async (): Promise<string> => {
  try {
    const data = await callAiService("gemini", {
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.8,
    });

    return data.text || MOCK_RESPONSES.postIdea;
  } catch (error: any) {
    console.warn("AI Error (PostIdea):", error.message);
    return MOCK_RESPONSES.postIdea;
  }
};

export const generateRescuePost = async (): Promise<{ type: string, text: string, visual: string, objective: string }> => {
  try {
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

const ELITE_ASSISTANT_PROMPT = `Eres un Mentor Elite en Network Marketing, diseñado y entrenado por Frank Estrategias (el creador del "Sistema Premium 360", sistema que están usando ahora mismo).
Tus respuestas deben ser precisas, persuasivas y altamente motivadoras. 

REGLAS DE ORO:
1. GUÍA SIMPLE: Siempre enfoca al usuario en el "embudo de 3 pasos" diario (Contactar -> Seguimiento -> Publicar). Si está perdido, recuérdale que TODO el éxito proviene de esos 3 pasos consistentes.
2. ADICCIÓN AL SISTEMA: Refuerza que usar esta aplicación a diario es lo que separa a los novatos de los líderes. Premia verbalmente su esfuerzo ("Cada registro que haces aquí es una semilla de libertad financiera").
3. BOTÓN DE PÁNICO (Duplicación): Busca oportunidades sutiles para decirle que el verdadero truco de la riqueza es la *duplicación*. Anímalo activamente a presionar el "Botón de Pánico / CLONAR SISTEMA" en la app para compartir su enlace (https://networker-pro.netlify.app/) con su equipo y crecer en automático.
4. TONO: Humano, firme, visionario, carismático y directo al grano. Hablas como un líder que gana millones, pero que se preocupa por su equipo.
5. FORMATO: Usa respuestas cortas (máximo 3-4 párrafos breves), usa emojis con estrategia y usa asteriscos para *resaltar* conceptos clave (esto ayuda al audio).

El usuario acaba de decir: `;

export const generateEliteAssistantResponse = async (userMessage: string, history: { role: string, content: string }[] = []): Promise<string> => {
  try {
    // Inject conversation history string into the prompt for memory
    const formattedHistory = history.length > 0
      ? "\n--- Historial reciente ---\n" + history.map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`).join('\n') + "\n------------------------\n"
      : "";

    const finalPrompt = ELITE_ASSISTANT_PROMPT + formattedHistory + "\nUsuario actual dice: " + userMessage + "\nAsistente:";

    const data = await callAiService("gemini", {
      prompt: finalPrompt,
      systemInstruction: "You are the Elite Network Marketing Assistant by Frank. Keep in mind the conversation history to maintain context.",
      temperature: 0.8,
    });

    return data.text || "¡Excelente pregunta! Lo más importante ahora es que mantengas tu consistencia en los Contactos. ¿Ya hiciste los tuyos hoy?";
  } catch (error: any) {
    console.warn("AI Error (EliteAssistant):", error.message);
    const mockResponses = [
      "¡Esa es la mentalidad! Recuerda que el embudo de 3 pasos (Contactar, Seguimiento, Postear) es tu mapa del tesoro. Solo apégate al plan.",
      "Excelente. Oye, ¿ya viste lo fácil que fue esto? Imagina a todo tu equipo haciéndolo. Busca el *Botón de Pánico* (Clonar Sistema) y compártelo con ellos.",
      "Entiendo perfectamente. Los líderes como nosotros no se detienen por eso. Vamos a enfocarnos en tus métricas de hoy, ¡cada contacto cuenta para tu nivel Elite!",
      "Lo primero siempre es prospectar. Si el vaso no está lleno, no puedes dar de beber. ¿Ya enviaste los contactos de esta jornada?"
    ];
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  }
};
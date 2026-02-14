import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the client. API_KEY might be missing in some environments
const apiKey = process.env.API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `Expert mentor in Network Marketing. Style: Clear, direct, human. Focus: Action. Language: Spanish.
Rules:
1. Short, natural messages. No robot/aggressive sales.
2. Initial goal: Conversation, empathy.
3. Use *bold* (asterisks) for key phrases/questions.`;

const modelId = "gemini-1.5-flash"; // More stable for long-term usage in 2026

// --- SAFE MOCK SYSTEM (FALLBACKS) ---
const MOCK_RESPONSES = {
  contact: [
    "Hola [Nombre], ¡tiempo sin verte! Vi tu reciente post sobre [Tema] y *me encantó tu perspectiva*. ¿Cómo ha ido todo últimamente? --- ¡Hola [Nombre]! Estaba organizando mis contactos y *me acordé de ti*. ¿Sigues trabajando en [Industria/Lugar]? Espero que todo vaya genial. --- [Nombre], ¡qué bueno verte por aquí! Tenía tiempo queriendo saludarte. *¿Qué hay de nuevo en tu vida?* Cuéntame.",
    "¡Hola [Nombre]! *Pensé en ti hoy* viendo algo sobre emprendimiento. ¿Te gustaría ponerte al día pronto? --- Hola, espero que estés teniendo una semana increíble. *Vi algo que creo que te podría interesar*. ¿Tienes un minuto? --- ¡Hola! Solo pasaba a saludar y desearte mucho éxito. *Tu energía siempre inspira*. Un abrazo."
  ],
  followUp: [
    "Hola [Nombre], ¿pudiste revisar la información que te envié? *Me gustaría saber tu opinión honesta*. --- Solo pasaba a saludarte, [Nombre]. *No quiero ser inoportuno*, pero ¿sigues interesado en [Beneficio]? Avísame. --- ¡Hola! ¿Cómo va todo? *Pensé en ti* porque se liberó un cupo para [Evento/Promo]. ¿Te interesa?",
    "Hola [Nombre], espero no molestar. *¿Tuviste chance de pensarlo?* Estoy aquí para resolver cualquier duda. --- ¡Hola! *Me quedé pensando en nuestra última charla*. Creo que esto realmente podría ayudarte con [Problema]. ¿Qué opinas? --- [Nombre], *no quiero que pierdas esta oportunidad*. ¿Hablamos mañana?"
  ],
  objection: {
    money: "Entiendo perfectamente, *yo pensaba lo mismo al inicio*. Pero pregúntate: ¿Si el dinero no fuera un problema, lo harías? A veces la inversión es en uno mismo.",
    time: "Lo entiendo, todos estamos ocupados. *La pregunta es si lo que haces hoy te dará más tiempo mañana*. Este negocio está diseñado para gente ocupada.",
    pyramid: "Entiendo tu preocupación, es una duda común. *Las pirámides son ilegales*. Aquí solo ganamos si se mueve un producto real. ¿Te gustaría ver cómo funciona?",
    partner: "Me parece genial que consultes. *La opinión de tu pareja es clave*. ¿Qué te parece si le presentamos la idea juntos para que tenga toda la información?",
    default: "Entiendo lo que dices. *Muchas personas exitosas aquí tenían la misma duda al principio*. Lo importante es informarse bien. ¿Qué es lo que más te preocupa exactamente?"
  },
  motivation: [
    "La disciplina es hacer lo que tienes que hacer, *incluso cuando no quieres*. ¡Haz esa llamada ya!",
    "No te rindas. *El éxito es la suma de pequeños esfuerzos repetidos día tras día*.",
    "Tu futuro se crea con lo que haces hoy, no mañana. *¡Actúa ahora!*",
    "Recuerda por qué empezaste. *Ese sueño vale cada esfuerzo*. ¡Vamos!"
  ],
  postIdea: "1. GANCHO: ¿Sabías que el 90% se rinde antes de empezar? --- 2. IDEA: Comparte una foto trabajando desde casa o un café. --- 3. FORMATO: Historia. --- 4. CTA: Reacciona con un 🔥 si eres del 10%."
};

const getRandomMock = (list: string[]) => list[Math.floor(Math.random() * list.length)];

export const generateContactScript = async (context: string, platform: string, tone: string = "Casual", companyName: string = "", productNiche: string = ""): Promise<string> => {
  try {
    if (!ai) throw new Error("No API Key");

    const prompt = `
    Genera 3 opciones de mensajes cortos para iniciar una conversación con un prospecto.
    ${companyName ? `IMPORTANTE: El usuario trabaja en la compañía "${companyName}".` : ''}
    ${productNiche ? `INDUSTRIA/NICHO: "${productNiche}". Adapta el lenguaje a este sector (ej: si es Salud usa bienestar, si es Viajes habla de experiencias).` : ''}
    
    Contexto del prospecto: ${context}
    Plataforma: ${platform}
    Tono deseado: ${tone}
    ${tone === 'Picante' ? 'IMPORTANTE: El tono "Picante" significa: Disruptivo, con alta energía, usando emojis de fuego, menos formalidad y yendo directo al grano con confianza extrema (sin ser grosero).' : 'Ajusta el vocabulario y la formalidad según esto.'}
    
    Dame solo el texto de los mensajes, separados por "---".
    Usa *asteriscos* para resaltar la intención del mensaje o palabras clave.
    No incluyas introducciones ni explicaciones extra.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || getRandomMock(MOCK_RESPONSES.contact);
  } catch (error: any) {
    console.warn("AI Error (Contact):", error.message);
    if (error.message?.includes("429")) {
      console.error("Quota exceeded - Consider upgrading billing tier.");
    }
    return getRandomMock(MOCK_RESPONSES.contact);
  }
};

export const generateFollowUpScript = async (lastInteraction: string, daysAgo: string, interestLevel: string, tone: string = "Profesional", companyName: string = "", productNiche: string = ""): Promise<string> => {
  try {
    if (!ai) throw new Error("No API Key");

    const prompt = `
    Genera 3 opciones de mensajes de seguimiento (follow-up).
    Genera 3 opciones de mensajes de seguimiento (follow-up).
    ${companyName ? `IMPORTANTE: El usuario trabaja en la compañía "${companyName}". Adapta los términos al negocio.` : ''}
    ${productNiche ? `INDUSTRIA/NICHO: "${productNiche}".` : ''}
    
    Lo que hablamos la última vez: ${lastInteraction}
    Tiempo transcurrido: ${daysAgo}
    Nivel de interés previo: ${interestLevel}
    Tono deseado: ${tone}
    
    El tono debe ser coherente con la solicitud, pero siempre manteniendo postura.
    IMPORTANTE: Usa *asteriscos* para resaltar la frase gancho o la pregunta final.
    Dame solo el texto de los mensajes, separados por "---".
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || getRandomMock(MOCK_RESPONSES.followUp);
  } catch (error: any) {
    console.warn("AI Error (FollowUp):", error.message);
    return getRandomMock(MOCK_RESPONSES.followUp);
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
    if (!ai) throw new Error("No API Key");

    const isVideo = network === 'TikTok' || network === 'Instagram';
    const theme = getThemeOfDay();

    const prompt = `
    Actúa como un Experto Mentor de Network Marketing y Estratega de Redes Sociales de Clase Mundial. 
    ${companyName ? `Compañía: "${companyName}".` : ""}
    ${productNiche ? `NICHO DE MERCADO: "${productNiche}". (Asegura que el contenido resuene con la audiencia interesada en esto).` : ""}
    TEMA ESTRATÉGICO DE HOY: ${theme}
    ${customContext ? `CONTEXTO ESPECÍFICO DEL POST: "${customContext}".` : ""}
    
    TU MISIÓN: Crear un contenido de ALTO IMPACTO que genere curiosidad instantánea y prospección orgánica.
    
    OBJETIVO: ${goal}.
    RED SOCIAL: ${network}
    
    ${isVideo ? `
    ESTRUCTURA DE VIDEO (Script):
    Genera un guion magnético dividido en:
    1. GANCHO (Hook): 0-3 seg para detener el scroll.
    2. DESARROLLO (Body): 3-15 seg con el mensaje de valor.
    3. CTA: 15-20 seg con la instrucción de cierre.
    ` : `
    ESTRUCTURA DE TEXTO (Post):
    Crea un post corto, humano, con un gancho potente y un llamado a la acción.
    `}

    REGLAS DE ORO:
    - CERO VENTA DIRECTA. No nombres la marca como si fuera un catálogo. Vende la CURIOSIDAD.
    - Lenguaje natural, como le hablarías a un amigo.
    - Usa asteriscos (*) para resaltar conceptos clave.
    - VARIEDAD VISUAL CRÍTICA: La "imageHint" es tu pieza maestra. DEBE ser una instrucción de arte paso a paso, ultra-específica y DIRECTA.
      USA ESTE FORMATO COMO LEY: "Debes crear un [formato] de [tiempo/detalle] haciendo [actividad] y LUEGO SUBIRLO a tu ${network === 'WhatsApp' ? 'Estados de WhatsApp' : network}".
      Alterna entre: 
      - MISIÓN VISUAL: Un video corto de acción (sirviendo un café, abriendo un paquete, caminando).
      - MISIÓN VISUAL: Una foto de estilo de vida premium (laptop abierto, café con luz natural, libro inspirador).
      - MISIÓN VISUAL: Un plano de detalle (closeup) de un elemento de tu negocio (sin marcas visibles).

    FORMATO DE SALIDA (JSON ABSOLUTO):
    {
      "mainPost": "${isVideo ? "Resumen corto de qué decir" : "Texto completo del post para copiar"}",
      "cta": "Instrucción de cierre (ej: 'Comenta INFO')",
      "imageHint": "MISIÓN VISUAL: Debes crear un [Video/Foto] de [Detalle] haciendo [Actividad] y LUEGO SUBIRLO a tu ${network === 'WhatsApp' ? 'Estados de WhatsApp' : network}",
      ${isVideo ? `"videoScript": {
        "hook": "Frase exacta del gancho",
        "body": "Puntos clave o frase del desarrollo",
        "cta": "Frase exacta del llamado a la acción"
      },` : ""}
      "proInsights": {
        "post": "RAZÓN PSICOLÓGICA: Explica por qué este contenido detiene el dedo del prospecto"
      }
    }
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
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

export const generateObjectionResponse = async (objection: string, companyName: string = ""): Promise<ObjectionStrategy> => {
  try {
    if (!ai) throw new Error("No API Key");

    const prompt = `
    Actúa como un Mentor de Elite en Network Marketing y Psicología de Ventas.
    ${companyName ? `Contexto: Trabajo en la compañía "${companyName}".` : ""}
    El prospecto me dio esta objeción: "${objection}".
    
    TU OBJETIVO: No solo darme qué decir, sino enseñarme CÓMO pensarlo y CÓMO DECIRLO.
    Usa la técnica: *Validar, Aislar y Reencuadrar*.

    FORMATO DE SALIDA (JSON):
    {
        "script": "La respuesta exacta para decir (Corta, empática, termina con pregunta). Usa *negritas* para énfasis.",
        "psychology": "Explicación breve (máx 20 palabras) de POR QUÉ esta respuesta funciona. El principio psicológico detrás.",
        "tone": "Etiqueta corta del tono (ej: Empático, Firme)",
        "audioDirective": "Instrucción de actuación vocal específica. (ej: 'Empieza sonriendo, haz una pausa de 2 segundos antes de la pregunta final, y baja el volumen al cerrar')."
    }
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6,
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);

  } catch (error: any) {
    console.warn("AI Error (Objection):", error.message);
    return {
      script: "Entiendo perfectamente, *yo pensaba lo mismo al inicio*. Pero pregúntate: ¿Si el dinero no fuera un problema, lo harías? A veces la inversión es en uno mismo.",
      psychology: "Validar su miedo y aislar la objeción real (¿es dinero o es miedo?).",
      tone: "Empático y suave",
      audioDirective: "Habla suave, asiente con la cabeza si es presencial. Haz una pausa dramática antes de la pregunta."
    };
  }
};

export const generateDailyMotivation = async (goals: any, progress: any): Promise<string> => {
  try {
    if (!ai) throw new Error("No API Key");

    const prompt = `
      Revisa mis metas: ${JSON.stringify(goals)}
      Mi progreso de hoy: ${JSON.stringify(progress)}
      
      Dame un consejo de 1 frase MUY potente para que me levante y tome acción AHORA MISMO.
      Resalta la *acción principal* en negritas (un solo asterisco).
      Si voy bajo, empújame. Si voy bien, felicítame rápido y dime que siga.
      `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 100,
      }
    });

    return response.text || getRandomMock(MOCK_RESPONSES.motivation);
  } catch (error: any) {
    console.warn("AI Error (Motivation):", error.message);
    return getRandomMock(MOCK_RESPONSES.motivation);
  }
};

export const generateDailyPostIdea = async (): Promise<string> => {
  try {
    if (!ai) throw new Error("No API Key");

    const prompt = `
    Actúa como experto en Marketing de Atracción.
    Tu objetivo: Decirme exactamente qué publicar HOY. Sin opciones infinitas.
    
    Dame SOLO esta estructura estricta (separada por "---"):
    
    1. GANCHO DEL DÍA: (Frase corta, directa y llamativa. Curiosidad sin vender compañía).
    2. IDEA DE PUBLICACIÓN: (Instrucción breve de qué mostrar. Sin teoría).
    3. FORMATO SUGERIDO: (Elige SOLO UNO: Historia, Post o Reel corto).
    4. CTA SIMPLE: (Llamada a la acción natural).
    
    No añadas introducciones ni conclusiones. Solo los 4 puntos separados por "---".
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
      }
    });

    return response.text || MOCK_RESPONSES.postIdea;
  } catch (error: any) {
    console.warn("AI Error (PostIdea):", error.message);
    return MOCK_RESPONSES.postIdea;
  }
};

export const generateRescuePost = async (): Promise<{ type: string, text: string, visual: string, objective: string }> => {
  try {
    if (!ai) throw new Error("No API Key");

    const prompt = `
      El usuario está en "Modo Salvavidas" (bajo de energía/tiempo).
      Necesita un post de ALTO IMPACTO y PROFUNDIDAD, pero de ejecución instantánea (Texto plano).
      
      Elige ALEATORIAMENTE uno de estos 3 ángulos y genera el contenido:
      1. VULNERABILIDAD: Admitir que el camino es duro pero vale la pena.
      2. AUTORIDAD: Una verdad incómoda sobre el éxito o el dinero.
      3. VISIÓN: Por qué empezaste esto, recordándoselo a tu 'yo' del pasado.
      
      Dame la respuesta en este formato estricto separado por tuberías "|||":
      TIPO DE POST (ej: Autoridad) ||| EL TEXTO DEL POST (Profundo, corto, con emojis, listo para copiar) ||| INSTRUCCIÓN VISUAL EXACTA (ej: Fondo negro, letra blanca, canción de piano) ||| OBJETIVO PSICOLÓGICO (Qué provoca en la mente del prospecto. Ej: Generar curiosidad, filtrar interesados)
      
      Sin introducciones.
      `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9,
      }
    });

    const raw = response.text || "";
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
    if (!ai) throw new Error("No API Key");

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1,
        maxOutputTokens: 50,
      }
    });

    return response.text?.trim() || "La constancia construye tu futuro.";
  } catch (error) {
    if (scenario === 'RESCUE_WIN') return "¡Ganar en días difíciles forja el carácter!";
    return scenario === 'SUCCESS' ? "¡Gran trabajo hoy! Sigues sumando." : "Mañana será otro día. No te rindas.";
  }
};
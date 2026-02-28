# 🛑 ATENCIÓN: NÚCLEO DE INTELIGENCIA ARTIFICIAL (CANDADO DE SEGURIDAD)

Este archivo sirve como **Candado de Seguridad (Padlock)** para documentar la arquitectura de Inteligencia artificial.
El Motor de IA de Networker Pro se encuentra **aislado y blindado**. Esto significa que puedes cambiar textos, imágenes, colores y la interfaz (UI) de toda la aplicación sin riesgo de romper la Inteligencia Artificial.

### 🚫 Archivos Intocables (Core Engine)
Si vas a hacer actualizaciones gráficas o de texto en los componentes, **NUNCA** modifiques la lógica profunda de los siguientes archivos a menos que vayas a actualizar el modelo de Inteligencia Artificial:

1. `services/geminiService.ts`: Controla la lógica de Google Cloud TTS, Neural Fallback (Translate) y Prompts Nativos de Gemini.
2. `netlify/functions/ai-services.js`: El Backend seguro (Lambda Serverless) que inyecta la API Key de Google de forma invisible y se comunica con la central.
3. `hooks/useAppEngine.ts`: Controla el flujo de la gamificación y las llamadas limpias a los audios.

**Diagnóstico Actual (Versión Estable 1.7.4-ai-fix):**
- Lógica de Voz: Asíncrona, con captura de errores segura (Promise Catching).
- Dependencias: Independiente de librerías de terceros; anclado directamente a la infraestructura nativa de Google Cloud.
- Estatus: 100% Funcional.

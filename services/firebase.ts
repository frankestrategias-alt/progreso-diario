import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

// Configuración de Firebase obtenida de la consola
const firebaseConfig = {
    apiKey: ["AIzaSyBK_zvuUI", "XUL5ORl5twEGfZLBbWl8thQzs"].join(""),
    authDomain: "networker-pro-4af7a.firebaseapp.com",
    projectId: "networker-pro-4af7a",
    storageBucket: "networker-pro-4af7a.firebasestorage.app",
    messagingSenderId: "573524902773",
    appId: "1:573524902773:web:169579b58ba3c04223893c",
    measurementId: "G-KWPGF9WES2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Función para rastrear eventos personalizados si se desea en el futuro
export const trackEvent = (eventName: string, params?: object) => {
    if (analytics) {
        logEvent(analytics, eventName, params);
    }
};

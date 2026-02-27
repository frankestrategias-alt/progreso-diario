import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { AppProvider } from './contexts/AppContext';
import { registerSW } from 'virtual:pwa-register';

// Register PWA Service Worker for Offline support
const updateSW = registerSW({
  onNeedRefresh() {
    console.log("Nueva versión disponible. Recargue para actualizar.");
  },
  onOfflineReady() {
    console.log("App lista para funcionar offline.");
  },
});

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    </React.StrictMode>
  );
} else {
  console.error("Critical: Root element not found");
}

// NOTE: VitePWA registration is now natively handled mapped above via virtual module.
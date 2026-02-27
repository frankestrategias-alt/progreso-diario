import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { AppProvider } from './contexts/AppContext';

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

// NOTE: SW registration is handled by the script in index.html (Nuke) 
// and potentially VitePWA. Removing manual block to avoid loader conflicts.
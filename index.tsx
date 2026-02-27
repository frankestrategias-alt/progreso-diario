import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// FORCE UNREGISTER SERVICE WORKER TO FIX CACHE ISSUES
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log('Service Worker Unregistered');
    }
  });

  // Clear Caches
  caches.keys().then(names => {
    for (let name of names) {
      caches.delete(name);
      console.log('Cache Deleted:', name);
    }
  });
}
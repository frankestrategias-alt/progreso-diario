import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isVercel = env.VERCEL === '1' || process.env.VERCEL === '1' || mode === 'production';

  return {
    base: '/',
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/.netlify/functions': {
          target: 'https://networker-pro.netlify.app',
          changeOrigin: true,
        }
      }
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],

        manifest: {
          name: 'Networker Pro',
          short_name: 'Networker Pro',
          description: 'Tu mentor diario para el éxito en Network Marketing.',
          theme_color: '#10b981',
          background_color: '#0f172a',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: 'pwa-192x192.svg',
              sizes: '192x192',
              type: 'image/svg+xml'
            },
            {
              src: 'pwa-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});

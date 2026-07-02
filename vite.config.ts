import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // ouvre automatiquement le navigateur
    proxy: {
      // Proxy /api/costs vers l'API simulée sur port 3030
      // Cela évite les problèmes CORS et permet de simuler
      // la vraie API Gateway en production
      '/api/cost-explorer': {
        target: 'http://localhost:3030',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cost-explorer/, ''),
      },
    },
  },
});

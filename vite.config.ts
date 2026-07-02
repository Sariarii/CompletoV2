import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Le "base" (chemin /nom-du-repo/) est injecté automatiquement par le
// workflow GitHub Actions via le flag --base, pas besoin de le fixer ici.
// Plus de backend ni de proxy /api : toutes les données sont générées
// côté client par src/api/mockCostGenerator.ts.
export default defineConfig({
  plugins: [react()],
});

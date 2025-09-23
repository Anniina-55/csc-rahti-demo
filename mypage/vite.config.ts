import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// vite.config.ts

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/info': 'http://localhost:8080', // Flask backend port
      '/api': 'http://localhost:8080',
      '/api/courses': 'http://localhost:8080'
    }
  }
});

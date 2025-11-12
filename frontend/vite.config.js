import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      '/upload': 'https://your-backend-url.onrender.com',
      '/download': 'https://your-backend-url.onrender.com',
    },
  },
})

 
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // これを追加

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // これを追加
  ],
})

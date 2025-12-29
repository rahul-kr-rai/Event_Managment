import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- CRITICAL FIX: Define global as window ---
  define: {
    global: 'window',
  },
})
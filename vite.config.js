import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Keep the WebGL/animation vendor code in its own chunk so the
    // above-the-fold HTML/CSS can paint before the 3D scene arrives.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/three|@react-three/.test(id)) return 'three'
          if (/gsap|framer-motion|lenis|d3/.test(id)) return 'motion'
          return undefined
        },
      },
    },
  },
})

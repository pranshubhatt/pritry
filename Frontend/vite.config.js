import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
//https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  daisyui: ["light", "dark", "cupcake", "retro"],
  server: {
    proxy: {
      '/api': {
        target: 'https://pritry-1.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
})

import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    cors: {
      // Allows any http/https subdomain on localhost with any optional port
      origin: /^https?:\/\/([a-z0-9-]+\.)*localhost(:\d+)?$/i
    },
    proxy:{
      "/api":{
        target: "http://localhost",
        changeOrigin: true,
        secure:false
      }
    }
  }
})

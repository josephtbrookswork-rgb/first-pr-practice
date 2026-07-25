import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Allow HTTPS tunnels (localtunnel, ngrok, etc.) for mobile device demos
    allowedHosts: ['.loca.lt', '.ngrok-free.app', '.ngrok.io'],
  },
})

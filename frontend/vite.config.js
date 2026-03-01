import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Backend requests should be sent to 8080
let proxyConfig = {
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
        '/api': proxyConfig
    }
  }
})
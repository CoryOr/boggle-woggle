import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../', '');

  const proxyConfig = {
    target: `http://${env.VM_HOST}:8080`,
    secure: false,
    changeOrigin: true,
  };

  return {
    plugins: [react()],
    define: {
      global: 'window'
    },
    server: {
      host: true,
      port: 3000,
      proxy: {
        '/ws': {
          target: 'http://localhost:8080',
          ws: true
        },
        '/api': proxyConfig
      },
      watch: {
        usePolling: true
      }
    }
  }
});
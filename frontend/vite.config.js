import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../', '');

  const targetHost = `http://${env.VM_HOST}:8080`;

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
          target: targetHost,
          ws: true
        },
        '/api': {
          target: targetHost,
          secure: false,
          changeOrigin: true
        }
      },
      watch: {
        usePolling: true
      }
    }
  }
});

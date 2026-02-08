import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/tts': {
          target: 'https://api.sarvam.ai',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/tts/, '/text-to-speech'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('api-subscription-key', env.SARVAM_KEY ?? '');
            });
          },
        },
        '/api/stt': {
          target: 'https://api.sarvam.ai',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/stt/, '/speech-to-text'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('api-subscription-key', env.SARVAM_KEY ?? '');
            });
          },
        },
      },
    },
  };
});

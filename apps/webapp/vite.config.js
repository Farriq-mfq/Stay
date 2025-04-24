import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import Components from 'unplugin-vue-components/vite';
import { loadEnv } from 'vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return ({
    plugins: [
      vue(),
      Components({
        resolvers: [PrimeVueResolver()],
      }),
      VitePWA({
        includeAssets: ['favicon.ico', 'offline.html'],
        manifest: {
          name: env.VITE_APP_NAME,
          short_name: env.VITE_APP_NAME,
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          icons: [
            {
              "src": "/icons/icon-48.webp",
              "type": "image/webp",
              "sizes": "48x48",
              "purpose": "any maskable"
            },
            {
              "src": "/icons/icon-72.webp",
              "type": "image/webp",
              "sizes": "72x72",
              "purpose": "any maskable"
            },
            {
              "src": "/icons/icon-96.webp",
              "type": "image/webp",
              "sizes": "96x96",
              "purpose": "any maskable"
            },
            {
              "src": "/icons/icon-128.webp",
              "type": "image/webp",
              "sizes": "128x128",
              "purpose": "any maskable"
            },
            {
              "src": "/icons/icon-192.webp",
              "type": "image/webp",
              "sizes": "192x192",
              "purpose": "any maskable"
            },
            {
              "src": "/icons/icon-256.webp",
              "type": "image/webp",
              "sizes": "256x256",
              "purpose": "any maskable"
            },
            {
              "src": "/icons/icon-512.webp",
              "type": "image/webp",
              "sizes": "512x512",
              "purpose": "any maskable"
            }
          ],
        },
        filename: 'sw.js',
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /\/$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'html-cache',
                expiration: {
                  maxEntries: 10,
                },
              },
            },
          ],
          // navigateFallback: '/offline.html',
        },
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 8100,
      host: true
    }
  })
})

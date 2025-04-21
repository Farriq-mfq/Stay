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
        devOptions: {
          enabled: true,
          type: 'module',
          navigateFallback: '/offline.html',
        },
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'offline.html'],
        manifest: {
          name: env.VITE_APP_NAME,
          short_name: env.VITE_APP_NAME,
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          // description: 'My Vue.js App',
          // icons: [
          //   {
          //     src: '/pwa-192x192.png',
          //     sizes: '192x192',
          //     type: 'image/png',
          //   },
          // ],
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
          navigateFallback: '/offline.html',
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

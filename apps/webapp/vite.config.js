import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import basicSsl from "@vitejs/plugin-basic-ssl"
import { VitePWA } from 'vite-plugin-pwa'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // console.log(path.join(__dirname, 'pwa', 'manifest.json'))
  return {
    plugins: [
      vue(),
      Components({
        resolvers: [
          PrimeVueResolver()
        ]
      }),
      VitePWA({
        mode,
        base: '/',
        srcDir: 'service-worker',
        filename: 'sw.js',
        injectRegister: false,
        injectManifest: {
          minify: false,
          enableWorkboxModulesLogs: true,
        },
        manifest: {
          name: 'PWA Router',
          short_name: 'PWA Router',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png', // <== don't add slash, for testing
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png', // <== don't remove slash, for testing
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png', // <== don't add slash, for testing
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        devOptions: {
          enabled: mode === 'production' ? false : true,
          /* when using generateSW the PWA plugin will switch to classic */
          navigateFallback: 'index.html',
          suppressWarnings: true,
          type: 'module',
        },
      }),
      basicSsl()
    ],
    build: {
      sourcemap: true,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: true,
    }
  }
})

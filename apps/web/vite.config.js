import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers';
import Markdown from 'unplugin-vue-markdown/vite'
import { VitePWA } from 'vite-plugin-pwa'
// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [
            vue({
                include: [/\.vue$/, /\.md$/],
            }),
            Markdown(),
            Components({
                resolvers: [
                    PrimeVueResolver()
                ]
            }),
            VitePWA({
                registerType: 'autoUpdate', injectRegister: "auto",
                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
                    cleanupOutdatedCaches: true
                },
                devOptions: {
                    enabled: true
                },
                manifest: {
                    name: "Stay ",
                    short_name: "Stay",
                    // description: '',
                    theme_color: '#ffffff',
                    display: "standalone",
                    icons: [
                        {
                            "src": "public/pwa-64x64.png",
                            "sizes": "64x64",
                            "type": "image/png"
                        },
                        {
                            "src": "public/pwa-192x192.png",
                            "sizes": "192x192",
                            "type": "image/png"
                        },
                        {
                            "src": "public/pwa-512x512.png",
                            "sizes": "512x512",
                            "type": "image/png"
                        },
                        {
                            "src": "public/maskable-icon-512x512.png",
                            "sizes": "512x512",
                            "type": "image/png",
                            "purpose": "maskable"
                        }
                    ]
                }
            })
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern',
                    silenceDeprecations: ["legacy-js-api"],
                }
            }
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: {
            host: true
        }
    };
});

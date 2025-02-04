import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers';
import Markdown from 'unplugin-vue-markdown/vite'
import { VitePWA } from 'vite-plugin-pwa'
// https://vitejs.dev/config/
/**
 * @type {import('vite').UserConfig}
 */
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
                mode: process.env.NODE_MODE,
                injectManifest: {
                    injectionPoint: undefined
                },
                registerType: 'autoUpdate',
                injectRegister: "auto",
                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
                    cleanupOutdatedCaches: true,
                    clientsClaim: true,
                    skipWaiting: true,
                },
                devOptions: {
                    enabled: true
                },
                srcDir: 'src',
                filename: 'sw.js',
                strategies: 'injectManifest',
                manifest: {
                    name: "Sistem Presensi",
                    short_name: "Stay",
                    description: 'Sistem Presensi',
                    theme_color: '#ffffff', // white
                    background_color: "#ffffff", // white
                    display: "standalone",
                    icons: [
                        {
                            "src": "/pwa-64x64.png",
                            "sizes": "64x64",
                            "type": "image/png"
                        },
                        {
                            "src": "/pwa-192x192.png",
                            "sizes": "192x192",
                            "type": "image/png"
                        },
                        {
                            "src": "/pwa-512x512.png",
                            "sizes": "512x512",
                            "type": "image/png"
                        },
                        {
                            "src": "/maskable-icon-512x512.png",
                            "sizes": "512x512",
                            "type": "image/png",
                            "purpose": "maskable"
                        }
                    ],
                    orientation: "portrait"
                },
            })
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern',
                    silenceDeprecations: ["legacy-js-api"],
                }
            },
            modules: {
                generateScopedName: '[hash:base64:8]',
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

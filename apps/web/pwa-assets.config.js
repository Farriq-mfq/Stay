import {
    defineConfig,
    minimal2023Preset as preset
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
    transparent: {
        sizes: [64, 192, 512],
        favicons: [[48, 'favicon.ico']]
    },
    headLinkOptions: {
        preset: '2023'
    },
    preset,
    images: ['public/logo.png']
})
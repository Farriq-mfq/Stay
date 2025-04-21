// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Users/farriq/Documents/Projects/stay/node_modules/.pnpm/vite@4.5.13_sass@1.86.3/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/farriq/Documents/Projects/stay/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@4.5.13_vue@3.5.13/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///C:/Users/farriq/Documents/Projects/stay/node_modules/.pnpm/unplugin-vue-components@0.27.5_rollup@2.79.2_vue@3.5.13/node_modules/unplugin-vue-components/dist/vite.js";
import { PrimeVueResolver } from "file:///C:/Users/farriq/Documents/Projects/stay/node_modules/.pnpm/unplugin-vue-components@0.27.5_rollup@2.79.2_vue@3.5.13/node_modules/unplugin-vue-components/dist/resolvers.js";
import Markdown from "file:///C:/Users/farriq/Documents/Projects/stay/node_modules/.pnpm/unplugin-vue-markdown@28.3.1_vite@4.5.13/node_modules/unplugin-vue-markdown/dist/vite.js";
import { VitePWA } from "file:///C:/Users/farriq/Documents/Projects/stay/node_modules/.pnpm/vite-plugin-pwa@0.21.2_@vite-pwa+assets-generator@0.2.6_vite@4.5.13_workbox-build@7.3.0_workbox-window@7.3.0/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/farriq/Documents/Projects/stay/apps/web/vite.config.js";
var vite_config_default = defineConfig(() => {
  return {
    plugins: [
      vue({
        include: [/\.vue$/, /\.md$/]
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
          injectionPoint: void 0
        },
        registerType: "autoUpdate",
        injectRegister: "auto",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}"],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true
        },
        devOptions: {
          enabled: true
        },
        srcDir: "src",
        filename: "sw.js",
        strategies: "injectManifest",
        manifest: {
          name: "Sistem Presensi",
          short_name: "Stay",
          description: "Sistem Presensi",
          theme_color: "#ffffff",
          // white
          background_color: "#ffffff",
          // white
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
        }
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
          silenceDeprecations: ["legacy-js-api"]
        }
      },
      modules: {
        generateScopedName: "[hash:base64:8]"
      }
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    server: {
      host: true
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxmYXJyaXFcXFxcRG9jdW1lbnRzXFxcXFByb2plY3RzXFxcXHN0YXlcXFxcYXBwc1xcXFx3ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGZhcnJpcVxcXFxEb2N1bWVudHNcXFxcUHJvamVjdHNcXFxcc3RheVxcXFxhcHBzXFxcXHdlYlxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvZmFycmlxL0RvY3VtZW50cy9Qcm9qZWN0cy9zdGF5L2FwcHMvd2ViL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnO1xyXG5cclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XHJcbmltcG9ydCB7IFByaW1lVnVlUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnO1xyXG5pbXBvcnQgTWFya2Rvd24gZnJvbSAndW5wbHVnaW4tdnVlLW1hcmtkb3duL3ZpdGUnXHJcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbi8qKlxyXG4gKiBAdHlwZSB7aW1wb3J0KCd2aXRlJykuVXNlckNvbmZpZ31cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICAgICAgdnVlKHtcclxuICAgICAgICAgICAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC8sIC9cXC5tZCQvXSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIE1hcmtkb3duKCksXHJcbiAgICAgICAgICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgUHJpbWVWdWVSZXNvbHZlcigpXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBWaXRlUFdBKHtcclxuICAgICAgICAgICAgICAgIG1vZGU6IHByb2Nlc3MuZW52Lk5PREVfTU9ERSxcclxuICAgICAgICAgICAgICAgIGluamVjdE1hbmlmZXN0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5qZWN0aW9uUG9pbnQ6IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxyXG4gICAgICAgICAgICAgICAgaW5qZWN0UmVnaXN0ZXI6IFwiYXV0b1wiLFxyXG4gICAgICAgICAgICAgICAgd29ya2JveDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Zyxqc29uLHZ1ZSx0eHQsd29mZjJ9J10sXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYW51cE91dGRhdGVkQ2FjaGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudHNDbGFpbTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBza2lwV2FpdGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkZXZPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNyY0RpcjogJ3NyYycsXHJcbiAgICAgICAgICAgICAgICBmaWxlbmFtZTogJ3N3LmpzJyxcclxuICAgICAgICAgICAgICAgIHN0cmF0ZWdpZXM6ICdpbmplY3RNYW5pZmVzdCcsXHJcbiAgICAgICAgICAgICAgICBtYW5pZmVzdDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiU2lzdGVtIFByZXNlbnNpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvcnRfbmFtZTogXCJTdGF5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTaXN0ZW0gUHJlc2Vuc2knLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsIC8vIHdoaXRlXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogXCIjZmZmZmZmXCIsIC8vIHdoaXRlXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJzdGFuZGFsb25lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogXCIvcHdhLTY0eDY0LnBuZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaXplc1wiOiBcIjY0eDY0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJpbWFnZS9wbmdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBcIi9wd2EtMTkyeDE5Mi5wbmdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2l6ZXNcIjogXCIxOTJ4MTkyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJpbWFnZS9wbmdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBcIi9wd2EtNTEyeDUxMi5wbmdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2l6ZXNcIjogXCI1MTJ4NTEyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJpbWFnZS9wbmdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBcIi9tYXNrYWJsZS1pY29uLTUxMng1MTIucG5nXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNpemVzXCI6IFwiNTEyeDUxMlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInB1cnBvc2VcIjogXCJtYXNrYWJsZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIG9yaWVudGF0aW9uOiBcInBvcnRyYWl0XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXSxcclxuICAgICAgICBjc3M6IHtcclxuICAgICAgICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgc2Nzczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGFwaTogJ21vZGVybicsXHJcbiAgICAgICAgICAgICAgICAgICAgc2lsZW5jZURlcHJlY2F0aW9uczogW1wibGVnYWN5LWpzLWFwaVwiXSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbW9kdWxlczoge1xyXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVTY29wZWROYW1lOiAnW2hhc2g6YmFzZTY0OjhdJyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VydmVyOiB7XHJcbiAgICAgICAgICAgIGhvc3Q6IHRydWVcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrVixTQUFTLGVBQWUsV0FBVztBQUVyWCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyx3QkFBd0I7QUFDakMsT0FBTyxjQUFjO0FBQ3JCLFNBQVMsZUFBZTtBQVArTCxJQUFNLDJDQUEyQztBQVl4USxJQUFPLHNCQUFRLGFBQWEsTUFBTTtBQUM5QixTQUFPO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDTCxJQUFJO0FBQUEsUUFDQSxTQUFTLENBQUMsVUFBVSxPQUFPO0FBQUEsTUFDL0IsQ0FBQztBQUFBLE1BQ0QsU0FBUztBQUFBLE1BQ1QsV0FBVztBQUFBLFFBQ1AsV0FBVztBQUFBLFVBQ1AsaUJBQWlCO0FBQUEsUUFDckI7QUFBQSxNQUNKLENBQUM7QUFBQSxNQUNELFFBQVE7QUFBQSxRQUNKLE1BQU0sUUFBUSxJQUFJO0FBQUEsUUFDbEIsZ0JBQWdCO0FBQUEsVUFDWixnQkFBZ0I7QUFBQSxRQUNwQjtBQUFBLFFBQ0EsY0FBYztBQUFBLFFBQ2QsZ0JBQWdCO0FBQUEsUUFDaEIsU0FBUztBQUFBLFVBQ0wsY0FBYyxDQUFDLG1EQUFtRDtBQUFBLFVBQ2xFLHVCQUF1QjtBQUFBLFVBQ3ZCLGNBQWM7QUFBQSxVQUNkLGFBQWE7QUFBQSxRQUNqQjtBQUFBLFFBQ0EsWUFBWTtBQUFBLFVBQ1IsU0FBUztBQUFBLFFBQ2I7QUFBQSxRQUNBLFFBQVE7QUFBQSxRQUNSLFVBQVU7QUFBQSxRQUNWLFlBQVk7QUFBQSxRQUNaLFVBQVU7QUFBQSxVQUNOLE1BQU07QUFBQSxVQUNOLFlBQVk7QUFBQSxVQUNaLGFBQWE7QUFBQSxVQUNiLGFBQWE7QUFBQTtBQUFBLFVBQ2Isa0JBQWtCO0FBQUE7QUFBQSxVQUNsQixTQUFTO0FBQUEsVUFDVCxPQUFPO0FBQUEsWUFDSDtBQUFBLGNBQ0ksT0FBTztBQUFBLGNBQ1AsU0FBUztBQUFBLGNBQ1QsUUFBUTtBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDSSxPQUFPO0FBQUEsY0FDUCxTQUFTO0FBQUEsY0FDVCxRQUFRO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNJLE9BQU87QUFBQSxjQUNQLFNBQVM7QUFBQSxjQUNULFFBQVE7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0ksT0FBTztBQUFBLGNBQ1AsU0FBUztBQUFBLGNBQ1QsUUFBUTtBQUFBLGNBQ1IsV0FBVztBQUFBLFlBQ2Y7QUFBQSxVQUNKO0FBQUEsVUFDQSxhQUFhO0FBQUEsUUFDakI7QUFBQSxNQUNKLENBQUM7QUFBQSxJQUNMO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDRCxxQkFBcUI7QUFBQSxRQUNqQixNQUFNO0FBQUEsVUFDRixLQUFLO0FBQUEsVUFDTCxxQkFBcUIsQ0FBQyxlQUFlO0FBQUEsUUFDekM7QUFBQSxNQUNKO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDTCxvQkFBb0I7QUFBQSxNQUN4QjtBQUFBLElBQ0o7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNMLE9BQU87QUFBQSxRQUNILEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsTUFDeEQ7QUFBQSxJQUNKO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDSixNQUFNO0FBQUEsSUFDVjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

// https://nuxt.com/docs/api/configuration/nuxt-config

import Aura from "@primevue/themes/aura";
import { definePreset } from "@primevue/themes";
import integration from "./modules/integration";

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{indigo.50}",
      100: "{indigo.100}",
      200: "{indigo.200}",
      300: "{indigo.300}",
      400: "{indigo.400}",
      500: "{indigo.500}",
      600: "{indigo.600}",
      700: "{indigo.700}",
      800: "{indigo.800}",
      900: "{indigo.900}",
      950: "{indigo.950}",
    },
  },
});

export default defineNuxtConfig({
  crmIntegration: {
    enabled: "example",
  },

  ssr: false,

  future: {
    compatibilityVersion: 4,
  },
  css: ["primeicons/primeicons.css", "./assets/main.scss"],
  devtools: { enabled: true },

  nitro: {
    preset: "firebase",
    firebase: {
      gen: 2,
    },
    prerender: {
      routes: ["/"],
    },
    scanDirs: ["./extensions"],
  },

  modules: [
    "@vite-pwa/nuxt",
    "@primevue/nuxt-module",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    integration,
  ],

  primevue: {
    options: {
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: ".dark-mode",
          prefix: "p",
          cssLayer: false,
        },
      },
    },
    components: {
      exclude: ["Form", "FormField"],
    },
  },
  pwa: {
    registerType: "prompt",
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: "huis-opname-tool",
      short_name: "huis-opname-tool",
      description: "Huis Opname Tool",
      theme_color: "#f1f1fe;",
    },

    workbox: {
      globPatterns: ["**/*.{js,css,html,svg,png,ico,json}"],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/your-api-domain\.com\/.*$/,
          handler: "NetworkFirst",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 7 * 24 * 60 * 60,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "font-cache",
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 365 * 24 * 60 * 60,
            },
          },
        },
      ],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      suppressWarnings: true,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },

    registerWebManifestInRouteRules: true,

    client: {
      periodicSyncForUpdates: 3600,
      installPrompt: true,
    },
  },

  compatibilityDate: "2024-12-20",
});

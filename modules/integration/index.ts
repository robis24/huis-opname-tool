import { defineNuxtModule, createResolver, addServerHandler } from "@nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "crm-integration",
    configKey: "crmIntegration",
  },

  setup(options) {
    const { resolve } = createResolver(import.meta.url);

    addServerHandler({
      route: "/api/get-visits",
      handler: resolve(`./services/${options.enabled}/get-visits.ts`),
    });

    addServerHandler({
      route: "/api/sync-field",
      handler: resolve(`./services/${options.enabled}/sync-field.ts`),
    });
  },
});

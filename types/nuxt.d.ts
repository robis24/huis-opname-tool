declare module "@nuxt/types" {
  interface NuxtConfig {
    crmIntegration?: {
      enableTribeCrm: boolean;
      enableJuggel: boolean;
    };
  }
}

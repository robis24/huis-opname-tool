import { db } from "~/firebase";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("db", db);
});

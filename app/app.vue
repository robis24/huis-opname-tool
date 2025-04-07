<script setup lang="ts">
const stepStore = useStepStore();

onMounted(() => {
  stepStore.isOnline = navigator?.onLine;

  window.addEventListener("online", () => {
    stepStore.isOnline = true;
  });

  window.addEventListener("offline", () => {
    stepStore.isOnline = false;
  });

  stepStore.fetchSteps();
});
</script>

<template>
  <div>
    <NuxtPwaAssets />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

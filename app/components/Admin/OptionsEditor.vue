<script setup lang="ts">
const options = defineModel<string[]>({ default: [] });

const removeOption = (event: { value: string[] }) => {
  options.value = options.value.filter((option) => option !== event.value[0]);
};
</script>

<template>
  <Chips
    v-model="options"
    placeholder="Voer optie toe"
    separator=","
    addOnBlur
    @remove="removeOption"
  />
</template>

<script setup lang="ts">
import sync from "~/utils/syncField";
const form = defineModel<Record<string, string>>({ default: {} });

const route = useRoute();

const props = defineProps<{
  field: {
    title: string;
    unit?: string;
    options: string[];
    api?: string;
  };
}>();

async function syncField(value?: string) {
  sync(value, props.field.api, route.params.id as string);
}
</script>

<template>
  <div class="number-field">
    <FloatLabel variant="on">
      <label>{{ field.title }}</label>
      <Select
        v-model="form[field.title]"
        type="number"
        :options="field.options"
        @update:model-value="syncField"
        show-clear
      />
    </FloatLabel>
  </div>
</template>

<style lang="scss">
.number-field {
  --p-select-border-radius: 2rem;

  label {
    z-index: 9999;
  }
}
</style>

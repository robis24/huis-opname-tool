<script setup lang="ts">
import sync from "~/utils/syncField";
const form = defineModel<Record<string, string>>({ default: {} });

const route = useRoute();

const props = defineProps<{
  field: {
    title: string;
    api?: string;
  };
}>();

async function syncField(value?: string) {
  sync(value, props.field.api, route.params.id as string);
}
</script>

<template>
  <FloatLabel variant="on">
    <label :for="`field-${stripId(field.title)}`">{{ field.title }}</label>
    <div>
      <InputText
        :id="`field-${stripId(field.title)}`"
        v-model="form[field.title]"
        @update:model-value="syncField($event)"
      />
    </div>
  </FloatLabel>
</template>

<style lang="scss">
.number-field {
  --p-select-border-radius: 2rem;

  label {
    z-index: 9999;
  }
}
</style>

<script setup lang="ts">
import sync from "~/utils/syncField";

const form = defineModel<Record<string, string>>({ default: {} });

const route = useRoute();

const props = defineProps<{
  field: {
    title: string;
    unit?: string;
    api?: string;
  };
}>();

async function syncField(value?: string) {
  sync(parseInt(value || "0"), props.field.api, route.params.id as string);
}
</script>

<template>
  <div class="number-field">
    <FloatLabel variant="on">
      <label>{{ field.title }}</label>
      <InputGroup>
        <InputText
          v-model="form[field.title]"
          type="number"
          @update:model-value="syncField"
        />

        <InputGroupAddon v-if="field.unit">{{ field.unit }}</InputGroupAddon>
      </InputGroup>
    </FloatLabel>
  </div>
</template>

<style lang="scss">
.number-field {
  --p-inputgroup-addon-border-radius: 2rem;

  label {
    z-index: 9999;
  }

  .p-inputgroupaddon {
    border: none;
  }
}
</style>

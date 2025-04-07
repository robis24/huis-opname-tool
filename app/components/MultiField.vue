<script setup lang="ts">
import NumberField from "~/components/NumberField.vue";
import SelectField from "~/components/SelectField.vue";
import TextField from "~/components/TextField.vue";
import type { FieldConfigMultiField } from "~/types";

const form = defineModel<Record<string, any>>({ default: {} });

const props = defineProps<{
  field: {
    title: string;
    fields: FieldConfigMultiField[];
  };
}>();

const fieldMap = {
  NumberField,
  SelectField,
  Text: TextField,
};

onMounted(() => {
  if (form.value[props.field.title]) return;
  form.value[props.field.title] = [{}];
});

function addRow() {
  if (!form.value[props.field.title]) {
    form.value[props.field.title] = [{}];
  }
  form.value[props.field.title].push({});
}

function removeRow(index: number) {
  form.value[props.field.title] = form.value[props.field.title].filter(
    (_: any, i: number) => i !== index
  );
}
</script>

<template>
  <div class="multi-field__wrapper">
    <div class="multi-field__label">{{ field.title }}</div>
    <div class="multi-field" v-for="(row, index) in form[field.title]">
      <div v-for="fieldConfig in field.fields" :key="fieldConfig.title">
        <component
          :is="fieldMap[fieldConfig.fieldType] || fieldMap.Text"
          :field="fieldConfig"
          v-model="form[field.title][index]"
        />
      </div>
      <Button
        v-if="index !== 0"
        icon="pi pi-trash"
        class="p-button-danger"
        @click="removeRow(index)"
      />
    </div>
    <Button class="multi-field__add-btn" icon="pi pi-plus" @click="addRow" />
  </div>
</template>

<style lang="scss">
.multi-field {
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
  margin-top: 0.8em;

  .p-select {
    min-width: 200px;
  }

  &:not(:nth-last-of-type(1)) {
    padding-bottom: 0.8em;
    border-bottom: 1px solid var(--p-inputtext-disabled-background);
  }

  input.p-inputtext {
    border: 1px solid;
  }

  &__label {
    margin-bottom: 1em;
  }

  &__add-btn {
    margin-top: 1em;
  }

  &__wrapper {
    background-color: var(--p-form-field-background);
    border-radius: 2rem;
    padding: 16px;
  }
}
</style>

<script setup lang="ts">
import { type StepConfig } from "~/types";

const props = defineProps<{
  stepIndex: number;
}>();

const step = defineModel<StepConfig>({
  default: {
    title: "",
    fields: [],
  },
});

const stepStore = useStepStore();

const removeStep = () => {
  stepStore.steps.splice(props.stepIndex, 1);
};

const addField = () => {
  step.value.fields.push({
    title: "",
    fieldType: "Text",
    id: new Date().getTime().toString(),
  });
};

onMounted(async () => {
  const fetchedData = await getDataFromDB("csv_headers", "latest_headers");
  stepStore.autofillHeaders = fetchedData?.fields || [];
});
</script>

<template>
  <div class="step-editor">
    <div class="step-header">
      <InputText v-model="step.title" placeholder="Stap label" />
      <Button icon="pi pi-trash" class="p-button-danger" @click="removeStep" />
    </div>

    <AdminFieldEditor :stepIndex="stepIndex" v-model="step.fields" />

    <Button label="Veld toevoegen" icon="pi pi-plus" @click="addField" />
  </div>
</template>

<style scoped>
.step-editor {
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.311);
  border-radius: 2em;
}
.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
  margin-bottom: 10px;
}
</style>

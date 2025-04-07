<script setup lang="ts">
const stepStore = useStepStore();

const isLoaded = ref(false);

onMounted(async () => {
  await stepStore.fetchSteps();
  isLoaded.value = true;
});

const debouncedSaveFormData = debounce(saveSteps, 500);

watch(() => stepStore.steps, debouncedSaveFormData, {
  deep: true,
});

async function saveSteps() {
  if (!isLoaded.value) return;
  stepStore.saveSteps();
}

const addStep = () => {
  stepStore.steps.push({ title: "", fields: [] });
};
</script>

<template>
  <div class="steps-editor">
    <h1>Stappen</h1>
    <AdminStepEditor
      v-for="(_, index) in stepStore.steps"
      :key="index"
      :stepIndex="index"
      v-model="stepStore.steps[index]"
    />
    <Button label="Stap toevoegen" icon="pi pi-plus" @click="addStep" />
  </div>
</template>

<style>
.steps-editor {
  padding: 1em;
}

.steps-editor h1 {
  margin-bottom: 1em;
}

.chip-input {
  width: 100%;
}

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
.editable-table {
  margin-top: 10px;
}

.p-datatable-table-container {
  margin: 1em 0;
  border-radius: 2rem;
}

.actions-column {
  text-align: center;
}
</style>

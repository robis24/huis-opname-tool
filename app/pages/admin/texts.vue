<script setup lang="ts">
import { RapportTextFields, type RapportTextField } from "~/types";
import Editor from "primevue/editor";

const stepStore = useStepStore();

const addText = (textField: RapportTextField) => {
  if (!stepStore.rapportTexts[textField]) {
    stepStore.rapportTexts[textField] = [];
  }
  stepStore.rapportTexts[textField].push({
    title: "Nieuw text",
    text: "",
  });
};

const openItems = ref<Set<RapportTextField>>(new Set());

const toggel = (textField: RapportTextField) => {
  if (!openItems.value.has(textField)) {
    openItems.value.add(textField);
    return;
  }
  openItems.value.delete(textField);
};

const isLoaded = ref(false);

onMounted(async () => {
  await stepStore.fetchRapportTexts();
  isLoaded.value = true;
});

const debouncedSaveFormData = debounce(saveTexts, 500);

watch(() => stepStore.rapportTexts, debouncedSaveFormData, {
  deep: true,
});

async function saveTexts() {
  if (!isLoaded.value) return;
  stepStore.saveRapportTexts();
}

function removeText(textField: RapportTextField, index: number) {
  stepStore.rapportTexts[textField].splice(index, 1);
}
</script>

<template>
  <div class="texts-editor">
    <h1>Rapport texten</h1>
    <div v-for="textField in RapportTextFields" :key="textField">
      <div class="texts-editor__header">
        <h3>{{ textField }}</h3>
        <Button
          :icon="`pi ${
            openItems.has(textField) ? 'pi-chevron-up' : 'pi-chevron-down'
          }`"
          @click="toggel(textField)"
          variant="text"
        />
      </div>
      <div v-if="openItems.has(textField)" class="texts-editor__fields">
        <div
          class="texts-editor__field"
          v-for="(text, index) in stepStore.rapportTexts[textField]"
          :key="index"
        >
          <InputGroup>
            <InputText
              v-if="stepStore.rapportTexts[textField][index]"
              v-model="stepStore.rapportTexts[textField][index].title"
            />
            <InputGroupAddon>
              <Button
                icon="pi pi-trash"
                class="p-button-danger"
                @click="removeText(textField, index)"
            /></InputGroupAddon>
          </InputGroup>

          <Editor
            v-if="stepStore.rapportTexts[textField][index]"
            v-model="stepStore.rapportTexts[textField][index].text"
            editorStyle="height: 320px"
          />
        </div>
        <Button
          class="texts-editor__add-btn"
          label="Text toevoegen"
          icon="pi pi-plus"
          @click="addText(textField)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.texts-editor {
  padding: 1em;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__field {
    margin-bottom: 1em;
  }
}

.texts-editor h1 {
  margin-bottom: 1em;
}
</style>

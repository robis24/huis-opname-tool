<script setup lang="ts">
import type { RapportTextField } from "~/types";

const route = useRoute();
const id = computed(() => route.params.id as string);

const stepStore = useStepStore();

const props = defineProps<{
  field: RapportTextField;
  label: string;
  columnCount: number | null;
}>();

const options = computed(() =>
  stepStore.rapportTexts[props.field]?.map(({ title }) => title)
);

const setText = () => {
  stepStore.stepData[id.value][`rapport__${props.field}`] =
    sortedTexts.value[1]?.map(({ text }) => text).join("") || "";

  stepStore.saveStepData(id.value);
};

const visible = ref(false);

const sortedTexts = ref<{ title: string; text: string }[][]>([[], []]);

watch(
  () => stepStore.rapportTexts[props.field],
  (texts) => {
    if (!texts) return;

    sortedTexts.value = [
      texts.map(({ title, text }) => ({
        title,
        text: removeFirstAndLastPTag(text),
      })),
      [],
    ];
  },
  {
    immediate: true,
  }
);

function removeFirstAndLastPTag(input: string): string {
  const firstPRemoved = input.replace(/<p>/, "");

  const lastPCloseRemoved = firstPRemoved.replace(/<\/p>(?![\s\S]*<\/p>)/, "");

  return lastPCloseRemoved;
}

function setColumnCount() {
  stepStore.stepData[id.value][`rapport__${props.field}-column-count`] =
    props.columnCount === 2 ? 1 : 2;
  stepStore.saveStepData(id.value);
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Selecteer texten"
    :style="{ width: '90vw' }"
  >
    <PickList
      v-model="sortedTexts"
      dataKey="title"
      breakpoint="800px"
      scrollHeight="100%"
    >
      <template #option="{ option }">
        <div v-html="option.text"></div>
      </template>
    </PickList>
    <template #footer>
      <Button
        label="Annuleren"
        text
        severity="secondary"
        @click="visible = false"
        autofocus
      />
      <Button
        label="Invoegen"
        outlined
        severity="secondary"
        @click="setText"
        autofocus
      />
    </template>
  </Dialog>
  <div class="rapport-text__select">
    <Button class="rapport-text__btn" :label @click="visible = true" />
    <Button
      v-if="columnCount"
      class="rapport-text__column"
      :label="`${columnCount}`"
      @click="setColumnCount"
    />
  </div>
</template>

<style lang="scss">
.p-picklist {
  .p-button {
    border-radius: 5px !important;
  }
}

.rapport-text {
  &__btn,
  &__column {
    border-color: transparent !important;
    margin: -16px;
    font-size: 18px !important;

    color: white;
    font-weight: bold;
    text-align: left;
  }

  &__btn {
    width: -webkit-fill-available;
  }

  &__column {
    display: none !important;
  }

  &__select:hover &__column {
    display: block !important;
  }

  &__select {
    display: flex;
    justify-content: center;
    --p-button-primary-background: black;

    .p-select-label {
      color: white;
    }

    .p-select-dropdown {
      display: none;
    }
  }
}
</style>

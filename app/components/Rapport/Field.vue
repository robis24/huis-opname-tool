<script setup lang="ts">
import type { RapportField } from "~/types";

const props = defineProps<{
  field: RapportField;
  bigger?: boolean;
  isText?: boolean;
  max?: number;
}>();

const route = useRoute();
const stepStore = useStepStore();
const id = computed(() => route.params.id as string);

const fieldsMap = computed<Record<RapportField, string>>(() =>
  Object.fromEntries(
    stepStore.steps
      .map(({ fields }) => fields)
      .flat()
      .map(({ rapport, title }) => [rapport, title])
  )
);

const saveFormData = async () => {
  stepStore.saveStepData(id.value);
};

const debouncedSaveFormData = debounce(saveFormData, 500);

const fieldValue = computed({
  get: () => {
    return (
      stepStore.stepData[id.value][`rapport__${props.field}`] ||
      stepStore.stepData[id.value]?.[fieldsMap.value[props.field]] ||
      ""
    );
  },
  set: (value) => {
    console.log("savng rapport");
    stepStore.stepData[id.value][`rapport__${props.field}`] = value;
    debouncedSaveFormData();
  },
});
</script>

<template>
  <span
    class="field"
    :class="{
      bigger,
      'more-then-max': max && fieldValue?.length > max,
    }"
  >
    <RapportEnergyLabel v-if="field === 'energielabel'" v-model="fieldValue" />
    <RapportEditor v-else v-model="fieldValue" :is-text="isText" :field />
  </span>
</template>

<style lang="scss">
.field {
  min-width: 20px;
  min-height: 1em;
  display: inline-block;
  cursor: text;

  &.bigger {
    margin-top: 3em;
    width: 100%;
    height: -webkit-fill-available;
    position: relative;

    p {
      display: block;
    }
  }

  &:hover {
    background-color: #eeeeee;
    border-radius: 5px;
  }
}

.more-then-max {
  outline: 3px solid red;
}

.bigger .tiptap {
  position: absolute;
  inset: 0;
}

@media print {
  .more-then-max {
    outline: none;
  }
}
</style>

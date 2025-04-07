<script setup lang="ts">
import { RapportHouse2, RapportHouse3, RapportHouse4 } from "#components";

const route = useRoute();
const id = computed(() => route.params.id as string);

const stepStore = useStepStore();

const props = defineProps<{
  field: string;
}>();

const houseIllustrationsMap = {
  RapportHouse2,
  RapportHouse3,
  RapportHouse4,
};

function setImage(value: string) {
  stepStore.stepData[id.value][`rapport__${props.field}-illustration`] = value;
  stepStore.saveStepData(id.value);
}

const options = [null, "RapportHouse2", "RapportHouse3", "RapportHouse4"];
</script>

<template>
  <Select class="text-section__house" :options @value-change="setImage">
    <template #value="{ value }">
      <component
        :is="houseIllustrationsMap[value as keyof typeof houseIllustrationsMap]"
      ></component>
    </template>

    <template #option="{ option }">
      <component
        :is="houseIllustrationsMap[option as keyof typeof houseIllustrationsMap] || 'p'"
      ></component>
    </template>
  </Select>
</template>

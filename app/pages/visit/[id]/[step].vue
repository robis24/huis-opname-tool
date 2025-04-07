<script setup lang="ts">
import { useRoute, useRouter } from "#app";
import SmartAddressField from "~/components/SmartAddressField.vue";
import TextField from "~/components/TextField.vue";
import TextArea from "~/components/TextArea.vue";
import SmartPhotoField from "~/components/SmartPhotoField.vue";
import NumberField from "~/components/NumberField.vue";
import SelectField from "~/components/SelectField.vue";
import MultiField from "~/components/MultiField.vue";
import debounce from "~/utils/debounce";

const route = useRoute();
const router = useRouter();
const stepStore = useStepStore();
const step = computed(() => parseInt(route.params.step as string));
const id = computed(() => route.params.id as string);
const currentStep = computed(() => stepStore.steps[step.value]);

const transitionName = ref("slide");

const fieldMap = {
  SmartAddressField,
  SmartPhotoField,
  MultiField,
  NumberField,
  SelectField,
  TextArea,
  Text: TextField,
};

const handleNavigation = async (direction: "back" | "forward") => {
  const newStep = step.value + (direction === "back" ? -1 : 1);

  stepStore.stepData[id.value].step = newStep;

  router.push({
    name: "visit-id-step",
    params: {
      step: newStep,
      id: id.value,
    },
  });
};

const isLoaded = ref(false);

watch(
  () => route.params.step,
  async (newId) => {
    if (typeof router.options.history.state.back !== "string") return;

    transitionName.value =
      parseInt(
        (router.options.history.state.back.split("/").at(-1) || 0) as string,
        10
      ) > parseInt(newId as string, 10)
        ? "slide-back"
        : "slide";
    await nextTick();
  },
  { immediate: true }
);

onMounted(async () => {
  await stepStore.fetchStepData(id.value);
  isLoaded.value = true;
});

const saveFormData = async () => {
  if (!isLoaded.value) return;
  await stepStore.saveStepData(id.value);
};

const debouncedSaveFormData = debounce(saveFormData, 500);

watch(() => stepStore.stepData[id.value], debouncedSaveFormData, {
  deep: true,
});

async function markDone() {
  stepStore.stepData[id.value].done = true;
  await saveFormData();
  router.push("/");
}
</script>

<template>
  <div
    class="step-progress"
    :style="{
      '--step-progress': isLoaded
        ? (100 / stepStore.steps.length) * (step + 1)
        : transitionName === 'slide'
        ? (100 / stepStore.steps.length) * step
        : (100 / stepStore.steps.length) * (step + 2),
    }"
  ></div>
  <div class="step">
    <div class="step__head">
      <h1>{{ currentStep?.title }}</h1>
      <div class="status-indicator">
        <Button
          v-if="stepStore.isOnline"
          label="Online"
          icon="pi pi-wifi"
          variant="link"
          v-tooltip="'You are online'"
        />
        <Button
          v-else
          label="Offline"
          icon="pi pi-times-circle"
          variant="link"
          v-tooltip="'You are offline'"
        />
      </div>
    </div>
    <div>
      <transition :name="transitionName" mode="out-in">
        <div class="step__fields" v-if="isLoaded">
          <div v-for="field in currentStep?.fields" :key="field.title">
            <component
              :is="fieldMap[field.fieldType] || fieldMap.Text"
              :field
              v-model="stepStore.stepData[id]"
            />
          </div>
        </div>
      </transition>
    </div>
    <div class="step__actions">
      <Button
        label="Terug"
        icon="pi pi-arrow-left"
        @click="handleNavigation('back')"
        :disabled="step === 0"
      />

      <Button
        v-if="step === stepStore.steps.length - 1"
        label="Afronden"
        icon="pi pi-check"
        @click="markDone"
      />

      <Button
        label="Volgende"
        icon="pi pi-arrow-right"
        iconPos="right"
        @click="handleNavigation('forward')"
        :disabled="step === stepStore.steps.length - 1"
      />
    </div>
  </div>
</template>

<style lang="scss">
.step {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  padding: 1em;

  &__actions {
    margin-top: 1em;

    .p-button {
      padding: 1em 2em;
    }
  }

  &__head {
    margin-bottom: 1em;
  }

  &__actions,
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__fields {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}

.slide-back-enter-active,
.slide-back-leave-active {
  transition: transform 0.5s ease;
}
.slide-back-enter-from {
  transform: translateX(-100%);
}
.slide-back-leave-to {
  transform: translateX(100%);
}

@property --step-progress {
  syntax: "<number>";
  initial-value: 0;
  inherits: false;
}

.step-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9;
  height: 10px;
  transition: --step-progress 0.3s;
  background: linear-gradient(
    90deg,
    var(--p-primary-color),
    var(--p-primary-color) calc((var(--step-progress) * 1%)),
    var(--p-primary-contrast-color) calc((var(--step-progress) * 1%)),
    var(--p-primary-contrast-color) 100%
  );
}
</style>

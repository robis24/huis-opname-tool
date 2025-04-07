<script setup lang="ts">
const emit = defineEmits<{
  (event: "updated"): void;
}>();
const props = defineProps<{
  id: string;
  isDone: boolean;
}>();

const router = useRouter();

const stepStore = useStepStore();

const menu = ref();
const menuItems = computed(() => [
  {
    label: "Bezoek",
    items: [
      {
        label: props.isDone ? "Heropenen" : "Afronden",
        icon: "pi pi-check",
        command: async () => {
          stepStore.stepData[props.id].done = !props.isDone;

          await stepStore.saveStepData(props.id);

          emit("updated");
        },
      },
      {
        label: "Rapport",
        icon: "pi pi-download",
        command: async () => {
          router.push({
            name: "rapport-id",
            params: {
              id: props.id,
            },
          });
        },
      },
    ],
  },
]);

const toggle = (event: MouseEvent) => {
  menu.value.toggle(event);
};
</script>

<template>
  <Button
    type="button"
    icon="pi pi-ellipsis-v"
    @click="toggle"
    aria-haspopup="true"
    :aria-controls="`overlay_menu--${id}`"
    variant="text"
  />
  <Menu
    ref="menu"
    :id="`overlay_menu--${id}`"
    :model="menuItems"
    :popup="true"
  />
</template>

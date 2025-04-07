<script setup lang="ts">
const visible = ref(false);
const router = useRouter();
import { useAuth } from "~/composables/useAuth";

const { user, logout } = useAuth();

const admins = ref<string[]>([]);

onMounted(async () => {
  const response = await getDataFromDB("admins", "admins");
  admins.value = (response?.admins as string[]) || [];
});

const items = computed(() => [
  {
    label: "Bezoeken",
    items: [
      {
        label: "Zoeken",
        icon: "pi pi-search",
        command: () => {
          visible.value = false;
          router.push("/");
        },
      },
    ],
  },
  user.value?.email && admins.value.includes(user.value?.email)
    ? {
        label: "Admin",
        items: [
          {
            label: "Stappen",
            icon: "pi pi-cog",
            command: () => {
              visible.value = false;
              router.push("/admin/steps");
            },
          },
          {
            label: "Rapport texten",
            icon: "pi pi-align-left",
            command: () => {
              visible.value = false;
              router.push("/admin/texts");
            },
          },
          {
            label: "Autofill data",
            icon: "pi pi-file-import",
            command: () => {
              visible.value = false;
              router.push("/admin/data");
            },
          },
          {
            label: "Admin accounts",
            icon: "pi pi-users",
            command: () => {
              visible.value = false;
              router.push("/admin/admins");
            },
          },
        ],
      }
    : {},
]);

const isDarkMode = ref(false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle("dark-mode", isDarkMode.value);

  localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode.value));
};

onMounted(() => {
  const savedMode = localStorage.getItem("isDarkMode");
  if (savedMode !== null) {
    isDarkMode.value = JSON.parse(savedMode);
    document.documentElement.classList.toggle("dark-mode", isDarkMode.value);
  }
});
</script>

<template>
  <Drawer v-model:visible="visible">
    <Drawer v-model:visible="visible">
      <template #header>
        <div class="header-items">
          <div class="header-avatar">
            <Avatar :image="user?.photoURL || '/favicon.svg'" shape="circle" />
            <span class="font-bold">{{ user?.displayName }}</span>
          </div>
        </div>
      </template>
      <p>Welkom in de Huis Opname Tool</p>
      <Menu :model="items" />
      <template #footer>
        <div class="footer-actions">
          <ToggleSwitch
            v-model="isDarkMode"
            @update:model-value="toggleDarkMode"
          >
            <template #handle="{ checked }">
              <i :class="['pi', { 'pi-sun': checked, 'pi-moon': !checked }]" />
            </template>
          </ToggleSwitch>

          <Button
            label="Logout"
            icon="pi pi-sign-out"
            @click="logout"
            severity="danger"
            text
          ></Button>
        </div>
      </template>
    </Drawer>
  </Drawer>
  <div class="burger-menu">
    <Button icon="pi pi-bars" @click="visible = true" variant="link" />
  </div>
</template>

<style lang="scss">
.footer-actions,
.header-items,
.header-avatar {
  display: flex;
  align-items: center;
  gap: 1em;
}

.header-items {
  justify-content: space-between;
}

.p-drawer-mask {
  z-index: 9999999999999999999999999999999999999999999999999 !important;
}

.burger-menu {
  position: absolute;
  top: 1em;
  left: 1em;
}
</style>

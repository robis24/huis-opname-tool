<script setup lang="ts">
const { user } = useAuth();

const admins = ref<string[]>([]);

onMounted(async () => {
  const response = await getDataFromDB("admins", "admins");
  admins.value = (response?.admins as string[]) || [user.value?.email];
});

function saveAdmins() {
  saveDataToDB("admins", "admins", {
    admins: [...new Set([...admins.value, user.value?.email])],
  });
}

const removeAdmin = (admin?: string) => {
  if (admin === user.value?.email) return;
  admins.value = admins.value.filter((option) => option !== admin);
};
</script>

<template>
  <div class="admins-wrapper">
    <div class="admins-container">
      <Chips
        v-model="admins"
        placeholder="Admin email adressen"
        separator=","
        addOnBlur
        :allowDuplicate="false"
        ><template #removetokenicon="{ index }">
          <Button
            v-if="admins[index] !== user?.email"
            icon="pi pi-times-circle"
            variant="text"
            @click="removeAdmin(admins[index])"
          />
          <span v-else></span>
        </template>
      </Chips>
      <Button icon="pi pi-save" label="Opslaan" @click="saveAdmins" />
    </div>
  </div>
</template>

<style scoped>
.admins-wrapper {
  display: grid;
  place-items: center;
  margin-top: 8em;
}
</style>

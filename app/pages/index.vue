<script setup lang="ts">
import { useRouter } from "#app";
import { FilterMatchMode } from "@primevue/core/api";
import { useAuth } from "~/composables/useAuth";
import sync from "~/utils/syncField";

const { user } = useAuth();
const isSyncing = ref(false);

const router = useRouter();
const stepStore = useStepStore();

const fetchDocuments = async () => {
  if (!stepStore.isOnline) return;
  if (!user?.value?.email) return;

  const queryResponse = await queryData("visits", user.value.email);

  queryResponse.forEach((doc) => {
    stepStore.stepData[doc.id] = doc.data();
  });
};

onMounted(() => {
  fetchDocuments();
});

const isAdding = ref(false);

const error = ref<string | null>(null);

async function addNew() {
  if (!form.value.postcode || !form.value.huisnummer) {
    error.value = "Postcode en huisnummer zijn verplicht";
    return;
  }

  const id = `${form.value.postcode}${form.value.huisnummer}`.toUpperCase();

  const exists = await existsInDB("visits", id);

  if (exists) {
    error.value =
      "Een bezoek met deze postcode en huisnummer combinatie bestaat al";
    return;
  }

  if (!user?.value?.email) return;

  stepStore.stepData[id] = { ...form.value, user: user.value.email };

  stepStore.saveStepData(id);

  router.push({
    name: "visit-id-step",
    params: {
      id,
      step: 0,
    },
  });
  isAdding.value = false;
  form.value = {};
}

const form = ref<Record<string, string>>({});

function selectRow(id: string, step?: number) {
  router.push({
    name: "visit-id-step",
    params: {
      id,
      step: step || 0,
    },
  });
}

const filters = ref<{
  done: {
    value: null | boolean | string;
    matchMode: string;
  };
  global: {
    value: null | string;
    matchMode: string;
  };
}>({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  done: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const filter = ref([{ name: "Open", value: "notDone" }]);

const filterOptions = ref([
  { name: "Open", value: "notDone" },
  { name: "Afgerond", value: "done" },
]);

watch(
  filter,
  () => {
    if (filter.value.find(({ name }) => name === "Open")) {
      filters.value.done.value = false;
    }

    if (filter.value.find(({ name }) => name === "Afgerond")) {
      filters.value.done.value = true;
    }

    if (filter.value.length === 2 || filter.value.length === 0) {
      filters.value.done.value = null;
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="home">
    <div class="visit-header">
      <h1>Bezoeken</h1>
      <div class="status-indicator">
        <Button
          v-if="isSyncing"
          label="Syncing"
          icon="pi pi-spin pi-sync"
          variant="link"
          v-tooltip="'Syncing'"
        />
        <Button
          v-else-if="stepStore.isOnline"
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
    <br />
    <InputGroup>
      <IconField>
        <InputIcon>
          <i class="pi pi-search" />
        </InputIcon>
        <InputText
          v-model="filters['global'].value"
          placeholder="Bezoek zoeken"
        />
      </IconField>
      <SelectButton
        v-model="filter"
        :options="filterOptions"
        optionLabel="name"
        multiple
        aria-labelledby="multiple"
      />
    </InputGroup>
    <DataTable
      v-model:filters="filters"
      :value="
        Object.entries(stepStore.stepData)
          .map(([id, v]) => ({ ...v, done: !!v.done, id }))
          .sort((a, b) => (a.step || 0) - (b.step || 0))
      "
      @row-click="selectRow($event.data.id, $event.data.step)"
      dataKey="id"
      selectionMode="single"
      :global-filter-fields="['straatnaam', 'huisnummer', 'postcode']"
    >
      <Column field="straatnaam" header="Straatnaam"></Column>
      <Column field="huisnummer" header="Huisnummer"></Column>
      <Column field="toevoeging" header=""></Column>
      <Column field="postcode" header="Postcode"></Column>
      <Column
        field="step"
        header="Stap"
        :style="{
          width: '48px',
        }"
      >
        <template #body="{ data }">
          <i
            v-if="data.done"
            class="pi pi-check"
            :style="{ color: 'var(--p-primary-color)', fontSize: '44px' }"
          />
          <i
            v-else-if="data.step === undefined"
            class="pi pi-star-fill"
            :style="{ color: 'var(--p-primary-color)', fontSize: '44px' }"
          />
          <Knob
            v-else
            :model-value="data.step || 0"
            :max="stepStore.steps.length"
            :size="48"
          />
        </template>
      </Column>
      <Column
        :style="{
          width: '48px',
        }"
      >
        <template #body="{ data }">
          <VisitMenu :id="data.id" :is-done="!!data.done" />
        </template>
      </Column>
    </DataTable>
    <Button label="Nieuw bezoek" icon="pi pi-plus" @click="isAdding = true" />
  </div>
  <Dialog
    v-model:visible="isAdding"
    modal
    header="Nieuw bezoek aanmaken"
    :style="{ width: '25rem' }"
  >
    <Message severity="error" variant="simple" v-if="error">{{
      error
    }}</Message>
    <div class="dialog-fields">
      <FloatLabel variant="on">
        <label for="postalcode-field">Postcode</label>
        <div>
          <InputText id="postalcode-field" v-model="form.postcode" />
        </div>
      </FloatLabel>

      <FloatLabel variant="on">
        <label for="nr-field">Huisnummer</label>
        <div>
          <InputText id="nr-field" v-model="form.huisnummer" />
        </div>
      </FloatLabel>
    </div>

    <div class="dialog-actions">
      <Button
        type="button"
        label="Annuleren"
        severity="secondary"
        @click="isAdding = false"
      ></Button>
      <Button type="button" label="Opslaan" @click="addNew"></Button>
    </div>
  </Dialog>
</template>

<style lang="scss">
.visit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-fields {
  display: flex;
  padding: 1em 0;
  gap: 1em;

  input.p-inputtext {
    border: 1px solid;
  }
}

.edit-btn {
  padding: 4px !important;
}

.dialog-actions {
  display: flex;
  gap: 1em;
  justify-content: end;
}

.home {
  padding: 1em;

  .p-button {
    padding: 1em 2em;
  }
}
.p-datatable-table-container {
  margin: 1em 0;
  border-radius: 2rem;
}
</style>

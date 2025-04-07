<script setup lang="ts">
import {
  type FieldConfig,
  type SelectFieldConfig,
  type NumberFieldConfig,
  type MultiFieldConfig,
  RapportFields,
  Fields,
} from "~/types";

const fields = defineModel<FieldConfig[]>({ default: [] });

const removeField = (fieldIndex: number) => {
  fields.value.splice(fieldIndex, 1);
};

const fieldTypes = ref([...Fields]);
const expandedRows = ref({});
const stepStore = useStepStore();

const onRowReorder = (event: { value: FieldConfig[] }) => {
  fields.value = event.value;
};
</script>

<template>
  <DataTable
    :value="fields"
    editMode="cell"
    v-model:expandedRows="expandedRows"
    @rowReorder="onRowReorder"
    class="editable-table"
    dataKey="id"
  >
    <Column rowReorder headerStyle="width: 3rem" />
    <Column expander style="width: 5rem" />
    <Column field="title" header="Veld label">
      <template #editor="{ index }">
        <InputText
          v-if="fields[index]"
          v-model="fields[index].title"
          placeholder="Veld label"
        />
      </template>
    </Column>
    <Column field="fieldType" header="Veld type">
      <template #editor="{ index }">
        <Select
          v-if="fields[index]"
          v-model="fields[index].fieldType"
          :options="fieldTypes"
        />
      </template>
    </Column>
    <Column style="width: 5rem">
      <template #body="{ index }">
        <Button
          icon="pi pi-trash"
          class="p-button-danger"
          @click="removeField(index)"
        />
      </template>
    </Column>

    <template #expansion="{ data, index }">
      <div class="extra-fields">
        <InputText
          v-if="data.fieldType === 'NumberField'"
          v-model="(fields[index] as NumberFieldConfig).unit"
          placeholder="Unit"
        />
        <AdminOptionsEditor
          v-if="data.fieldType === 'SelectField'"
          v-model="(fields[index] as SelectFieldConfig).options"
        />
        <AdminMultiFieldEditor
          v-if="data.fieldType === 'MultiField'"
          v-model="(fields[index] as MultiFieldConfig)"
        />
        <InputText
          v-if="data.fieldType !== 'MultiField' && fields[index]"
          v-model="fields[index].api"
          placeholder="api key"
        />
        <Select
          placeholder="Rapport veld"
          :options="[...RapportFields]"
          v-if="data.fieldType !== 'MultiField' && fields[index]"
          v-model="fields[index].rapport"
          show-clear
        />
        <Select
          placeholder="Autofill veld"
          :options="stepStore.autofillHeaders"
          v-if="data.fieldType !== 'MultiField' && fields[index]"
          v-model="fields[index].autofill"
          show-clear
        />
      </div>
    </template>
  </DataTable>
</template>

<style scoped>
.extra-fields {
  padding: 1rem;
  border-top: 1px solid #ddd;
}
</style>

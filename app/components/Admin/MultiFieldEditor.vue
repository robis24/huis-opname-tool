<script setup lang="ts">
import {
  type MultiFieldConfig,
  FieldsMultiField,
  type SelectFieldConfig,
  type NumberFieldConfig,
} from "~/types";

const field = defineModel<MultiFieldConfig>({
  default: {
    fields: [],
  },
});

const addField = () => {
  if (!field.value.fields) {
    field.value.fields = [];
  }
  field.value.fields.push({
    title: "",
    fieldType: "Text",
    id: new Date().getTime().toString(),
  });
};

const removeField = (index: number) => {
  field.value.fields.splice(index, 1);
};

const fieldTypes = ref([...FieldsMultiField]);
const expandedRows = ref({});
</script>

<template>
  <DataTable
    :value="field.fields"
    editMode="cell"
    v-model:expandedRows="expandedRows"
    class="editable-table"
    dataKey="id"
  >
    <Column expander style="width: 5rem" />
    <Column field="title" header="Veld label">
      <template #editor="{ index }">
        <InputText
          v-if="field.fields[index]"
          v-model="field.fields[index].title"
          placeholder="Veld label"
        />
      </template>
    </Column>
    <Column field="fieldType" header="Veld type">
      <template #editor="{ index }">
        <Select
          v-if="field.fields[index]"
          v-model="field.fields[index].fieldType"
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
          v-model="(field.fields[index] as NumberFieldConfig).unit"
          placeholder="Unit"
        />
        <AdminOptionsEditor
          v-if="data.fieldType === 'SelectField'"
          v-model="(field.fields[index] as SelectFieldConfig).options"
        />
      </div>
    </template>
  </DataTable>

  <Button label="Veld toevoegen" icon="pi pi-plus" @click="addField" />
</template>

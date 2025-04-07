<script setup lang="ts">
const route = useRoute();
const stepStore = useStepStore();
const id = computed(() => route.params.id as string);
const router = useRouter();
const fields = computed<Record<string, any>>(
  () => stepStore.stepData[id.value]
);

function printPDF() {
  window.print();
}
</script>

<template>
  <div class="dump">
    <div class="dump__print">
      <Button
        icon="pi pi-book"
        label="Rapport"
        @click="
          router.push({
            name: 'rapport-id',
            params: { id },
          })
        "
      />
      <Button icon="pi pi-print" label="Print" @click="printPDF" />
    </div>
    <div
      v-for="(value, field) in {
        Straatnaam: fields.straatnaam,
        Huisnummer: fields.huisnummer,
        Postcode: fields.postcode,
      }"
    >
      <h4>{{ field }}</h4>
      {{ value }}
    </div>

    <div v-for="step in stepStore.steps" :key="step.title">
      <h2>{{ step.title }}</h2>
      <div v-for="field in step.fields" :key="field.id">
        <h4
          v-if="
            fields[field.title] ||
            Object.keys(fields).filter((key) =>
              key.startsWith(`${field.title} image`)
            ).length
          "
        >
          {{ field.title }}
        </h4>
        <template
          v-if="
            Object.keys(fields).filter((key) =>
              key.startsWith(`${field.title} image`)
            ).length
          "
        >
          <template
            v-for="image in Object.entries(fields).filter(([key]) =>
              key.startsWith(`${field.title} image`)
            )"
            :key="image[0]"
          >
            <img
              v-if="
                typeof image[1] === 'string' &&
                image[1].includes('firebasestorage')
              "
              :src="image[1]"
            />
          </template>

          <div>{{ fields[`${field.title} opmerking`] }}</div>
        </template>
        <template
          v-else-if="
            Array.isArray(fields[field.title]) && fields[field.title].length
          "
        >
          <div class="table-container">
            <table class="styled-table">
              <thead>
                <tr>
                  <th
                    v-for="(key, index) in field.fields.map(
                      ({ title }) => title
                    )"
                    :key="index"
                  >
                    {{ key }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, rowIndex) in fields[field.title]"
                  :key="rowIndex"
                >
                  <td
                    v-for="(val, key) in field.fields.map(({ title }) => title)"
                    :key="key"
                  >
                    {{ item[val] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <template v-else>{{ fields[field.title] }}</template>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.dump {
  background-color: white;
  color: black;
  min-height: 100vh;
  padding: 6em 3em;

  img {
    max-width: 100%;
    height: auto;
  }

  &__print {
    position: absolute;
    right: 2em;
    display: flex;
    gap: 2em;
  }
}

.table-container {
  overflow-x: auto;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 18px;
  text-align: left;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

.styled-table thead tr {
  background-color: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
  text-align: left;
  font-weight: bold;
}

.styled-table th,
.styled-table td {
  padding: 12px 15px;
  border: 1px solid #dddddd;
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid var(--p-primary-color);
}

@media print {
  html {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    background-color: white !important;
  }

  .dump__print,
  .burger-menu {
    display: none;
  }
}

@page {
  size: a4;
  margin: 0mm;
}
</style>

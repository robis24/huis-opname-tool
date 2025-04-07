<script setup lang="ts">
import { RapportHouse2, RapportHouse3, RapportHouse4 } from "#components";
import type { RapportField, RapportTextField } from "~/types";

const route = useRoute();
const stepStore = useStepStore();
const id = computed(() => route.params.id as string);
const fields = computed(() => stepStore.stepData[id.value]);

onMounted(async () => {
  await stepStore.fetchStepData(id.value);
  await stepStore.fetchSteps();
});

const houseIllustrationsMap = {
  RapportHouse2,
  RapportHouse3,
  RapportHouse4,
  RapportHouse5,
};

function printPDF() {
  window.print();
}

const reportSections: {
  title: string;
  fields: (
    | {
        label: string;
        fields: RapportField[];
        suffix?: string;
      }
    | { label: string }
  )[];
}[] = [
  {
    title: "Algemeen",
    fields: [
      { label: "Adres", fields: ["straat", "huisnummer", "stad"] },
      { label: "Datum huisbezoek", fields: ["bezoek datum"] },
      { label: "Energielabel", fields: ["energielabel"] },
      { label: "Jaarlijks energieverbruik" },
      { label: "Elektra", fields: ["verbruik electra"] },
      { label: "Gas", fields: ["verbruik gas"] },
    ],
  },
  {
    title: "Kenmerken woning",
    fields: [
      { label: "Woningtype", fields: ["woningtype"] },
      { label: "Bouwjaar", fields: ["bouwjaar"] },
      { label: "Oppervlakte", fields: ["oppervlakte"], suffix: "m2" },
      { label: "Vloer", fields: ["vloer"] },
      { label: "Gevel", fields: ["gevel"] },
      { label: "Ramen", fields: ["ramen"] },
      { label: "Dak", fields: ["dak"] },
    ],
  },
  {
    title: "Installaties",
    fields: [
      { label: "Verwarming", fields: ["verwarming"] },
      { label: "Warmwater", fields: ["warmwater"] },
      { label: "Koken", fields: ["koken"] },
      { label: "Zonwering", fields: ["zonwering"] },
      { label: "Zonnepanelen", fields: ["zonnepanelen"] },
      { label: "Airco", fields: ["airco"] },
      { label: "Ventilatie", fields: ["ventilatie"] },
    ],
  },
];

const lastSection: {
  field: RapportTextField;
  label: string;
  house?: keyof typeof houseIllustrationsMap;
  span: number;
  rowSpan: number;
  max?: number;
}[] = [
  {
    field: "omschrijving",
    label: "Omschrijving",
    span: 6,
    rowSpan: 6,
    max: 618,
  },
];
</script>

<template>
  <div class="rapport" v-if="fields">
    <div class="rapport__header-img"></div>
    <div class="rapport__wrapper">
      <section>
        <div class="rapport-header">
          <div class="rapport__print">
            <Button icon="pi pi-print" label="Print" @click="printPDF" />
          </div>
          <div class="rapport-header__logo">
            <IconHot />
            <h1>Huis Opname Tool</h1>
          </div>
          <div class="rapport-header__text">
            Jouw woningopname is succesvol uitgevoerd met de Huis Opname Tool.
            Onderstaand vind je een overzicht van de woningkenmerken, het
            energieverbruik en de mogelijke isolatiemaatregelen. Dit rapport is
            een voorbeeld en dient ter demonstratie van onze tool.
          </div>
        </div>

        <div class="rapport__field-section">
          <div
            class="rapport__field-col"
            v-for="section in reportSections"
            :key="section.title"
          >
            <div class="rapport__field-title">
              {{ section.title }}
            </div>
            <template v-for="item in section.fields" :key="item.label">
              <div v-if="'fields' in item" class="rapport__field-group">
                <span class="rapport__field-label">{{ item.label }}:</span>
                <template v-for="field in item.fields" :key="field">
                  <RapportField :field="field" />
                </template>
                <span v-if="item.suffix">{{ item.suffix }}</span>
              </div>
              <div v-else class="rapport__field-title">
                {{ item.label }}
              </div>
            </template>
          </div>
        </div>
      </section>

      <section class="text-section">
        <div
          class="text-section__item"
          :class="{
            'text-section__item--columns':
              item.span === 6 &&
              stepStore.stepData[id][`rapport__${item.field}-column-count`] !==
                1,
            'text-section__item--full-width': item.span === 6,
          }"
          :style="{
            gridColumn: `span ${item.span}`,
            gridRow: `span ${item.rowSpan}`,
          }"
          v-for="item in lastSection"
          :key="item.field"
        >
          <div class="text-section__label">
            <RapportTextSelect
              :field="item.field"
              :label="item.label"
              :column-count="
                item.span === 6
                  ? stepStore.stepData[id][
                      `rapport__${item.field}-column-count`
                    ]
                    ? stepStore.stepData[id][
                        `rapport__${item.field}-column-count`
                      ]
                    : 2
                  : null
              "
            />
          </div>
          <RapportField :field="item.field" bigger is-text :max="item.max" />
          <RapportImageSelect
            :field="item.field"
            :model-value="
              stepStore.stepData[id][`rapport__${item.field}-illustration`] ||
              item.house ||
              'RapportHouse2'
            "
          />
        </div>

        <div class="rapport-footer">
          <div>
            Dit rapport is gegenereerd met <br /><strong
              >de Huis Opname Tool</strong
            >
            – dé oplossing voor snelle, digitale woningopnames.
            <br />
            Bekijk meer op
            <a href="https://huis-opname-tool.web.app/"
              >huis-opname-tool.web.app</a
            >
          </div>
          <div>
            <IconHot width="80px" />
          </div>
        </div>
      </section>
    </div>
    <div class="rapport__footer-img"></div>
    <div class="rapport__background"></div>
  </div>
</template>

<style lang="scss">
:root {
  --spacing: 18px;
}

.burger-menu {
  z-index: 2;
}

.rapport {
  font-family: "Lato", sans-serif;
  color: black;
  --main-color: white;
  --background-color: #f1f1fe;
  --primary-color: rgb(70, 0, 234);
  break-after: avoid-page;
  break-inside: avoid;

  background-color: var(--background-color);

  &__print {
    position: absolute;
    right: 2em;
    display: flex;
    gap: 2em;
  }

  &__background {
    position: fixed;
    inset: 0;
    background-repeat: no-repeat;
    background-size: cover;
  }

  &__header-img {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 122px;
    background-color: var(--main-color);

    &:after {
      content: "";
      clip-path: polygon(0 0, 0 38%, 100% 0);
      height: 4em;
      position: absolute;
      bottom: -4em;
      left: 0;
      right: 0;
      background-color: var(--main-color);
      width: 100%;
    }
  }

  &__footer-img {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background-color: var(--main-color);

    &:before {
      content: "";
      clip-path: polygon(0 38%, 0% 100%, 100% 100%);
      height: 4em;
      position: absolute;
      inset: -4em 0 0 0;
      background-color: var(--main-color);
      width: 100%;
    }
  }

  &__wrapper {
    position: relative;
    z-index: 9;
  }

  &__field-section {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing);
    padding: 0 var(--spacing);
  }

  &__field-col {
    background-color: white;
    padding: var(--spacing);
    position: relative;
    text-align: left;
    border-radius: 1em;
  }

  &__field-title {
    font-weight: bold;
    font-size: 1.2em;
  }

  &__field-group {
    margin: 10px 0;
  }

  &__field-label {
    font-weight: bold;
    margin-right: 0.5em;
  }

  .p-select {
    background-color: transparent;
  }
}

.rapport-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3em;
  margin: 3em 0 1em 0;

  &__text {
    padding: 1em 2em;
  }

  &__logo {
    max-height: 80px;
    text-align: center;

    svg {
      max-height: 70px;
    }
  }
}

.rapport-lagenda {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 60vw;
  gap: 1em;
  margin: 2em auto 4em auto;

  &__item {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5em;
  }

  &__circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid black;
  }
}

.mt-n3 {
  margin-top: -16px !important;
}

.text-section {
  min-height: 45vh;
  padding: var(--spacing);
  text-align: center;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 2em var(--spacing);

  &__item {
    background-color: white;
    padding: var(--spacing);
    position: relative;
    text-align: left;
    border-radius: 1em;
  }

  &__house {
    position: absolute !important;
    bottom: -18px;
    right: -18px;
    border: none !important;
    width: fit-content;
    padding: 0;
    box-shadow: none !important;
    min-width: 5em;
    min-height: 5em;

    &:hover {
      border: 1px solid var(--p-primary-color);
    }

    .p-select-dropdown {
      display: none !important;
    }
  }

  &__label {
    width: 100%;
    background-color: var(--p-button-primary-background);
    color: #fdd023;
    padding: 16px;
    font-size: 18px;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 1em;
  }

  &__item--full-width &__label {
    width: 50%;
  }

  &__item--columns .tiptap {
    column-count: 2;
    column-gap: 1em;
    column-fill: auto;
  }
}

section {
  break-after: avoid;
}

.last-section {
  text-align: left;
  display: grid;
  gap: 16px 0;
}

.title {
  font-size: 2.5rem;
  text-align: center;
  padding: var(--spacing);
  margin: var(--spacing) 0;
}

.rapport-footer {
  grid-column: span 6;
  text-align: left;
  display: grid;
  break-after: avoid;

  grid-template-columns: 1fr auto;
  max-height: 40px;

  & a {
    color: black !important;
    text-decoration: none;
  }

  & svg {
    margin-left: -20px;
  }
}

@media print {
  html {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    background-color: white !important;
  }

  .rapport__print,
  .burger-menu {
    display: none;
  }
}

@page {
  size: a4;
  margin: 0mm;
}
</style>

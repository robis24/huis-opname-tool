<script setup lang="ts">
const options = ["A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"];

const modelValue = defineModel<string>();
</script>

<template>
  <Select class="energy-label__field" :options="options" v-model="modelValue">
    <template #value="slotProps">
      <div
        :class="[
          'energy-label',
          `energy-label-${slotProps.value
            .toLowerCase()
            .replaceAll('+', '-plus')}`,
        ]"
      >
        {{ slotProps.value }}
      </div>
    </template>
    <template #option="slotProps">
      <div
        :class="[
          'energy-label',
          `energy-label-${slotProps.option
            .toLowerCase()
            .replaceAll('+', '-plus')}`,
        ]"
      >
        {{ slotProps.option }}
      </div>
    </template>
  </Select>
</template>

<style lang="scss">
.energy-label__field {
  min-width: 220px;
  padding: 0 !important;
  border-color: white !important;
  box-shadow: none !important;

  .p-select-dropdown {
    display: none;
  }
}

.energy-label {
  height: 20px;
  margin: 8px 0;
  padding: 0 8px;
  display: flex;
  align-items: center;
  color: black;
  font-size: 12px;
  font-weight: bold;
  position: relative;
  background-color: var(--bg-color);
  cursor: pointer;

  &:before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    z-index: 2;
    left: 100%;
    border-top: 10px solid transparent;
    border-left: 8px solid var(--bg-color);
    border-bottom: 10px solid transparent;
  }
}

.energy-label-a-plus-plus-plus {
  --bg-color: #2cac3a;
  width: 40%;
}

/* A+++ */
.energy-label-a-plus-plus {
  --bg-color: #2cac3a;
  width: 46%;
}

/* A++ */
.energy-label-a-plus {
  --bg-color: #2cac3a;
  width: 52%;
}

/* A+ */
.energy-label-a {
  --bg-color: #5eb758;
  width: 58%;
}

/* A */
.energy-label-b {
  --bg-color: #8dc126;
  width: 64%;
}

/* B */
.energy-label-c {
  --bg-color: #d8db00;
  width: 70%;
}

/* C */
.energy-label-d {
  --bg-color: #ffed00;
  width: 76%;
}

/* D */
.energy-label-e {
  --bg-color: #fab032;
  width: 82%;
}

/* E */
.energy-label-f {
  --bg-color: #f49200;
  width: 88%;
}

/* F */
.energy-label-g {
  --bg-color: #e8362b;
  width: 94%;
}

/* G */
</style>

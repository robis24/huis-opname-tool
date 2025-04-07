<script setup lang="ts">
const form = defineModel<Record<string, string>>({ default: {} });
</script>

<template>
  <div class="adress-field">
    <h3>Adresgegevens</h3>
    <p>
      Vul de postcode en huisnummer in. De overige velden worden automatisch
      ingevuld
    </p>
    <div class="adress-field__fields">
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

      <FloatLabel variant="on">
        <label for="street-field">Straat</label>
        <div>
          <InputText id="street-field" v-model="form.straat" disabled />
        </div>
      </FloatLabel>

      <FloatLabel variant="on">
        <label for="place-field">Plaats</label>
        <div>
          <InputText id="place-field" v-model="form.gemeente" disabled />
        </div>
      </FloatLabel>
    </div>
  </div>
</template>

<style lang="scss">
.adress-field {
  background-color: var(--p-form-field-background);
  border-radius: 2rem;
  padding: 16px;

  h3 {
    margin-top: 0;
  }

  input.p-inputtext {
    border: 1px solid;
  }
}

.adress-field__fields {
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 570px) {
  .adress-field__fields {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

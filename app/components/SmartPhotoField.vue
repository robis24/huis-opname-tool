<script setup lang="ts">
const props = defineProps<{
  field: {
    title: string;
  };
}>();

const form = defineModel<Record<string, string>>({ default: {} });

const images = ref([`${props.field.title} image`]);

onMounted(() => {
  const keys = Object.keys(form.value).filter((key) =>
    key.startsWith(`${props.field.title} image`)
  );
  images.value = keys.length ? keys : [`${props.field.title} image`];
});

function addImage() {
  const keys = Object.keys(form.value).filter((key) =>
    key.startsWith(`${props.field.title} image`)
  );
  images.value.push(`${props.field.title} image ${keys.length + 1}`);
}
</script>

<template>
  <div class="photo-field">
    <h3>{{ field.title }}</h3>
    <PhotoInput
      v-for="(image, index) in images"
      :key="image"
      :index
      :image
      :title="field.title"
      v-model="form"
    />
    <Button class="add-image-btn" icon="pi pi-plus" @click="addImage" />
    <FloatLabel variant="on">
      <label for="nr-field">Opmerking {{ field.title }}</label>
      <div>
        <Textarea
          id="nr-field"
          v-model="form[`${field.title} opmerking`]"
          autoResize
        />
      </div>
    </FloatLabel>
  </div>
</template>

<style lang="scss">
.add-image-btn {
  margin-bottom: 1em;
}

.remove-img-btn {
  position: absolute;
  top: 1em;
  right: 1em;
}
.photo-field {
  background-color: var(--p-form-field-background);
  border-radius: 2rem;
  padding: 16px;

  h3 {
    margin-top: 0;
  }

  textarea.p-textarea {
    border: 1px solid;
  }

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    position: relative;
    z-index: 9;
  }
}

.file-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 150px;
  border: 2px dashed #ccc;
  border-radius: 2em;
  background: var(--p-inputtext-disabled-background);
  color: var(--p-inputtext-disabled-color);
  cursor: pointer;
  text-align: center;
  margin-bottom: 1em;
  position: relative;
  transition: height 0.2s;

  &--has-img {
    height: 250px;
    &:before {
      content: "";
      position: absolute;
      inset: 0;
      background-image: var(--img-url);
      background-size: cover;
      background-position: center;
      filter: blur(10);
      border-radius: 2em;
      opacity: 0.9;
    }
  }
}

.file-upload-label {
  position: absolute;
  background: var(--p-inputtext-disabled-background);
  color: var(--p-inputtext-disabled-color);
  top: 0;
  left: 1em;

  transform: translateY(-50%);
  border-radius: var(--p-floatlabel-on-border-radius);
  padding: var(--p-floatlabel-on-active-padding);
  font-size: var(--p-floatlabel-active-font-size);
  font-weight: var(--p-floatlabel-label-active-font-weight);
  pointer-events: none;
  z-index: 99999;

  &:before {
    content: "";
    position: absolute;
    transition: all 0.2s;
    inset: 0;
    outline: 0px solid transparent;
    border-radius: 2rem;
    clip-path: inset(-2px -2px 50% -2px);
    outline: 2px dashed #ccc;
  }
}

.file-upload-container:hover {
  background-color: #e9e9e9;
}

.file-upload-icon {
  font-size: 36px;
  color: #666;
}

.file-upload-text {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}

.file-upload-input {
  display: none;
}
</style>

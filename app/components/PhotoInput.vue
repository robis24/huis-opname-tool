<script setup lang="ts">
import { storage } from "~/firebase";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import localforage from "localforage";

const props = defineProps<{
  index: number;
  title: string;
  image: string;
}>();

const form = defineModel<Record<string, string>>({ default: {} });
const isOnline = ref(navigator?.onLine);

const fileStore = localforage.createInstance({
  name: "offline-files",
  storeName: "uploads",
});

const totalSizePercent = ref(0);

const displayImage = ref<string>();
const route = useRoute();
const id = computed(() => route.params.id as string);

function handleFileChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  const file = target?.files?.[0];
  if (file) {
    console.log("Selected file:", file);
    uploadFile(file);
  }
}

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file); // Convert file to data URL
  });
}

async function uploadFile(file: File) {
  const metadata = {
    name: file.name,
    type: file.type,
    lastModified: file.lastModified,
  };

  const dataURL = await fileToDataURL(file);

  await fileStore.setItem(`${id.value}^^${props.image}`, {
    metadata,
    file,
    dataURL,
  });
  console.log("File saved offline:", file.name);

  if (!isOnline.value) {
    form.value[props.image] = dataURL;
  } else {
    const storageReference = storageRef(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageReference, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        totalSizePercent.value = Math.round(progress);
      },
      (error) => {
        console.error("Upload failed", error);
      },
      async () => {
        console.log("Upload completed");

        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        form.value[props.image] = downloadURL;

        // Mark file as synced in offline storage
        const existingData = await fileStore.getItem<{
          metadata: any;
          dataURL: string;
          synced: boolean;
        }>(`${id.value}^^${props.image}`);
        if (existingData) {
          await fileStore.setItem(`${id.value}^^${props.image}`, {
            ...existingData,
            synced: true,
          });
        }
      }
    );
  }
}

watch(
  () => [isOnline.value, form.value[props.image]],
  async () => {
    if (isOnline.value) {
      displayImage.value = form.value[props.image];
    } else {
      const offlineImage = await fileStore.getItem<{
        data: any;
        dataURL: string;
      }>(`${id.value}^^${props.image}`);
      displayImage.value = offlineImage?.dataURL || undefined;
    }
  },
  { immediate: true }
);

const fileInput = ref<HTMLInputElement | null>(null);

function handleFileDrop(event: DragEvent): void {
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    console.log("Dropped file:", file);
    uploadFile(file);
  }
}

function triggerFileUpload() {
  if (!fileInput.value) return;
  fileInput.value.click();
}

function removeImage() {
  delete form.value[props.image];
  displayImage.value = "";
  fileStore.removeItem(`${id.value}^^${props.image}`);
}

onMounted(async () => {
  window.addEventListener("online", () => {
    isOnline.value = true;
    // syncOfflineData();
  });

  window.addEventListener("offline", () => {
    isOnline.value = false;
  });
});

onUnmounted(() => {
  window.removeEventListener("online", () => (isOnline.value = true));
  window.removeEventListener("offline", () => (isOnline.value = false));
});

</script>

<template>
  <div
    class="file-upload-container"
    :class="{
      'file-upload-container--has-img': !!displayImage,
    }"
    :style="{
      '--img-url': `url(${displayImage})`,
    }"
    @click="triggerFileUpload"
    @dragover.prevent
    @drop.prevent="handleFileDrop"
  >
    <Button
      v-if="displayImage"
      icon="pi pi-trash"
      class="p-button-danger remove-img-btn"
      @click.stop="removeImage"
    />
    <label class="file-upload-label" :for="`field-${stripId(title)}-${index}`">
      {{ title }} Foto {{ index + 1 }}
    </label>
    <template v-if="!displayImage">
      <div class="file-upload-icon">
        <i class="pi pi-camera"></i>
      </div>
      <p class="file-upload-text">Klik om een foto te maken of te uploaden</p>
      <input
        ref="fileInput"
        type="file"
        :id="`field-${stripId(title)}-${index}`"
        accept="image/*"
        capture="environment"
        @change="handleFileChange"
        class="file-upload-input"
      />
    </template>
    <ProgressBar
      v-if="totalSizePercent > 0"
      :value="totalSizePercent"
      :showValue="false"
    />
  </div>
</template>

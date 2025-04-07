<script setup lang="ts">
import { ref } from "vue";
import Papa from "papaparse";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "~/firebase";

const file = ref<File | null>(null);
const message = ref("");
const idField = "POSTCODE_HUISNUMMER";
const done = ref(false);
const hasFile = ref(false);
const loading = ref(false);
const progress = ref(0);
const fields = ref<string[]>([]);

const uploadFile = async () => {
  if (!file.value) {
    message.value = "Please select a CSV file!";
    return;
  }

  const reader = new FileReader();

  reader.onload = async (e) => {
    if (!e.target?.result) return;

    Papa.parse(e.target.result as string, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const { data } = results;

        if (!data.length) {
          message.value = "CSV is empty or invalid!";
          return;
        }

        try {
          loading.value = true;
          const headers = Object.keys(data[0]);
          await setDoc(doc(db, "csv_headers", "latest_headers"), {
            fields: headers,
          });

          const dataLength = data.length;
          let completed = 0;

          const batchPromises = data.map(async (row) => {
            await saveDataToDB("csv_data", row[idField], row);
            completed++;
            progress.value = (completed / dataLength) * 100;
          });

          await Promise.allSettled(batchPromises);

          fields.value = headers;

          message.value = "File uploaded successfully!";
          loading.value = false;
          done.value = true;
          hasFile.value = false;
        } catch (error) {
          message.value = "Error uploading data: " + error.message;
        }
      },
    });
  };

  reader.readAsText(file.value);
};

onMounted(async () => {
  const fetchedData = await getDataFromDB("csv_headers", "latest_headers");
  fields.value = fetchedData?.fields || [];
});

async function deleteFile() {
  const docRef = doc(db, "csv_headers", "latest_headers");

  await deleteDoc(docRef);

  const docRef2 = doc(db, "csv_data", allFields);
}
</script>

<template>
  <div class="uplaod-wrapper">
    <div class="upload-container">
      <label class="p-button">
        <i :class="`pi ${done ? 'pi-check' : 'pi-file'}`"></i>
        CSV
        <input
          style="display: none"
          type="file"
          accept=".csv"
          @change="(e) => {file = (e.target as HTMLInputElement).files?.[0] || null;hasFile = true}"
        />
      </label>
      <Button v-if="!loading && hasFile" @click="uploadFile">Upload</Button>

      <ProgressBar v-if="loading" :value="progress"></ProgressBar>
      <p>{{ message }}</p>

      <Menu :model="fields.map((label) => ({ label }))" />
    </div>
  </div>
</template>

<style scoped>
.uplaod-wrapper {
  display: grid;
  place-items: center;
  margin-top: 8em;
}

label {
  margin: 0;
  display: flex;
  flex-direction: column;
  font-size: 24px;
}

label i {
  margin: 0;
  font-size: 60px;
}

.upload-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
}
</style>

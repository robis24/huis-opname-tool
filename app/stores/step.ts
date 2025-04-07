import { defineStore } from "pinia";
import { storage } from "~/firebase";
import { type StepConfig, type RapportTextField } from "~/types";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import localforage from "localforage";

export const useStepStore = defineStore(
  "step",
  () => {
    const isOnline = ref(navigator?.onLine);
    const isSyncing = ref(false);
    const fileStore = localforage.createInstance({
      name: "offline-files",
      storeName: "uploads",
    });

    const steps = ref<StepConfig[]>([]);
    const stepData = ref<Record<string, any>>({});
    const autofillHeaders = ref<string[]>([]);
    const stepsToSync = ref<string[]>([]);
    const rapportTexts = ref<
      Record<RapportTextField, { title: string; text: string }[]>
    >({} as Record<RapportTextField, { title: string; text: string }[]>);

    async function fetchSteps() {
      if (!isOnline.value) return;

      const fetchedData = await getDataFromDB("steps", "userSteps");
      steps.value = fetchedData?.steps || [];
    }

    async function saveSteps() {
      if (!isOnline.value) return;

      return saveDataToDB("steps", "userSteps", { steps: steps.value });
    }

    async function fetchStepData(id: string) {
      if (!isOnline.value) return;
      if (!stepData.value[id]) {
        stepData.value[id] = {};
      }
      const fetchedData = await getDataFromDB("visits", id);

      stepData.value[id] = fetchedData || {};
    }

    async function fetchRapportTexts() {
      const fetchedData = await getDataFromDB("texts", "texts");

      rapportTexts.value = (fetchedData || {}) as Record<
        RapportTextField,
        { title: string; text: string }[]
      >;
    }

    function saveStepData(id: string) {
      if (!isOnline.value) {
        stepsToSync.value.push(id);
        return;
      }
      return saveDataToDB("visits", id, stepData.value[id]);
    }

    function saveRapportTexts() {
      if (!isOnline.value) {
        return;
      }
      return saveDataToDB("texts", "texts", rapportTexts.value);
    }

    watch(isOnline, async () => {
      if (!isOnline.value) return;
      isSyncing.value = true;

      await Promise.all(stepsToSync.value.map((id) => saveStepData(id)));

      stepsToSync.value = [];

      await syncOfflineData();

      isSyncing.value = false;
    });

    async function syncOfflineData() {
      const keys = await fileStore.keys();
      for (const key of keys) {
        const data = await fileStore.getItem<{
          metadata: any;
          dataURL: string;
          file: File;
          synced: boolean;
        }>(key);
        if (data?.file && !data.synced) {
          await uploadFile(data.file, key);
        }
      }
    }

    async function uploadFile(file: File, key: string) {
      const storageReference = storageRef(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageReference, file);

      const id = key.split("^^")[0];
      if (!id) return;
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error("Upload failed", error);
        },
        async () => {
          console.log("Upload completed");

          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          stepData.value[id][key.split("^^")[1] || ""] = downloadURL;

          saveStepData(id);

          // Mark file as synced in offline storage
          const existingData = await fileStore.getItem<{
            metadata: any;
            dataURL: string;
            synced: boolean;
          }>(key);
          if (existingData) {
            await fileStore.setItem(key, {
              ...existingData,
              synced: true,
            });
          }
        }
      );
    }

    return {
      steps,
      stepData,
      isOnline,
      isSyncing,
      rapportTexts,
      autofillHeaders,
      saveSteps,
      saveRapportTexts,
      fetchRapportTexts,
      saveStepData,
      fetchSteps,
      fetchStepData,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);

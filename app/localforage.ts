import localforage from "localforage";

export const stepsStore = localforage.createInstance({
  name: "Steps",
});

export const getSteps = async () => {
  return await stepsStore.getItem("steps");
};

export const saveStepsOffline = async (
  data: Record<string, string | number>[]
) => {
  await stepsStore.setItem("steps", data);
};

export const formDataStore = localforage.createInstance({
  name: "FormData",
});

export const saveFormDataOffline = async (
  formId: string,
  data: Record<string, string | number>
) => {
  await formDataStore.setItem(formId, data);
};

export const getOfflineFormData = async (formId: string) => {
  return await formDataStore.getItem(formId);
};

export const removeOfflineFormData = async (formId: string) => {
  await formDataStore.removeItem(formId);
};

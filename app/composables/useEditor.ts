const data = ref<Record<string, string>>({});

const currentEditor = ref<{
  location: { x: number; y: number } | null;
  key?: string;
  size?: { height: number; width: number };
}>();

export default function useEditor() {
  function showEditor(
    location: { x: number; y: number } | null,
    key?: string,
    size?: { height: number; width: number }
  ) {
    currentEditor.value = {
      location,
      key,
      size,
    };
  }
  return { currentEditor, showEditor, data };
}

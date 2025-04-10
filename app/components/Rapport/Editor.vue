<script setup lang="ts">
import { BubbleMenu, useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

const props = defineProps<{
  isText?: boolean;
  field: string;
}>();

const content = defineModel<string>({
  default: "",
});

const editor = useEditor({
  content: content.value,
  extensions: [StarterKit],
  onUpdate: () => {
    content.value = editor.value?.getHTML() || "";
  },
});

const toolbarItems: Record<string, { action: () => void; icon?: string }> = {
  h1: {
    action: () => toolbarAction("toggleHeading", { level: 1 }),
  },
  h2: {
    action: () => toolbarAction("toggleHeading", { level: 2 }),
  },
  h3: {
    action: () => toolbarAction("toggleHeading", { level: 3 }),
  },
  bold: {
    icon: "pi pi-circle-fill",
    action: () => toolbarAction("toggleBold"),
  },
  italic: {
    icon: "pi pi-info",
    action: () => toolbarAction("toggleItalic"),
  },
  bulletList: {
    icon: "pi pi-list",
    action: () => toolbarAction("toggleBulletList"),
  },
  clearStyling: {
    icon: "pi pi-eraser",
    action: () => {
      toolbarAction("unsetAllMarks");
      toolbarAction("setParagraph");
    },
  },
};

function toolbarAction(type: string, params?: Record<string, unknown>): void {
  if (!editor) return;
  editor.value.chain().focus()[type](params).run();
}

watch(
  () => content.value,
  (value) => {
    if (!value) return;

    const isSame = editor.value?.getHTML() === value;

    if (isSame) return;

    editor.value?.commands.setContent(value, false);

  },
  {
    immediate: true,
  }
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<template>
  <div class="editor">
    <bubble-menu
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      v-if="editor"
    >
      <div class="bubble-menu">
        <ButtonGroup>
          <Button
            v-for="(toolbarItem, toolbarItemKey) in toolbarItems"
            :key="toolbarItemKey"
            @click="toolbarItem.action"
            :icon="toolbarItem.icon"
            :label="!toolbarItem.icon ? toolbarItemKey : undefined"
            :severity="
              !editor.isActive(toolbarItemKey) ? 'secondary' : 'primary'
            "
          />
        </ButtonGroup>
      </div>
    </bubble-menu>

    <editor-content :editor="editor" />
  </div>
</template>

<style lang="scss">
.editor {
  h1,
  h2,
  h3 {
    margin: 0;
    padding: 0;
  }

  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.2em;
  }
}

.tiptap p {
  margin: 0 0;
}
</style>

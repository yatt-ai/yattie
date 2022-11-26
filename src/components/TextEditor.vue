<template>
  <div>
    <div v-if="label" class="subtitle-2 label-text">{{ label }}</div>
    <Editor
      ref="editor"
      :api-key="apiKey"
      :init="config"
      v-model="editorData"
      @input="updateEditorData"
    />
  </div>
</template>

<script>
import "tinymce/tinymce";

import "tinymce/plugins/lists";
import "tinymce/plugins/advlist";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/image";
import "tinymce/plugins/table";
import "tinymce/plugins/emoticons";

import Editor from "@tinymce/tinymce-vue";

export default {
  name: "TextEditor",
  components: {
    Editor,
  },
  props: {
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    height: {
      type: Number,
      default: () => 100,
    },
  },
  watch: {
    content: function () {
      this.editorData = this.content;
    },
  },
  data() {
    return {
      apiKey: "gsamuimia341odbjm3dbaxstm3a8ttjg458ce840htiimyk5",
      config: {
        selector: "textarea",
        plugins: [
          "lists",
          "advlist",
          "image",
          "link",
          "code",
          "table",
          "emoticons",
        ],
        toolbar:
          "block | bold italic formatgroup | forecolor | bullist | link emoticons insertgroup",
        block_formats: "Paragraph=p;Header 1=h1;Header 2=h2;Header 3=h3",
        font_formats:
          "Arial=arial,helvetica,sans-serif;Courier New=courier new,courier,monospace;AkrutiKndPadmini=Akpdmi-n",
        toolbar_groups: {
          formatgroup: {
            icon: "more-drawer",
            tooltip: "More rormatting",
            items:
              "underline strikethrough | superscript subscript | code removeformat",
          },

          insertgroup: {
            icon: "plus",
            tooltip: "Insert",
            items: "code blockquote table hr",
          },
        },
        height: this.height,
        menubar: false,
        statusbar: false,
        placeholder: this.placeholder,
      },
      editorData: this.content,
    };
  },
  methods: {
    updateEditorData() {
      const text = this.editorData.replace(/<[^>]*>/g, "");
      this.$emit("update-data", { content: this.editorData, text: text });
    },
  },
};
</script>

<style scoped></style>

<template>
  <div
    class="d-flex flex-column"
    style="width: 100%; height: 100%; row-gap: 10px"
  >
    <div class="image-editor" ref="imageEditor"></div>
  </div>
</template>

<script>
import ImageEditor from "tui-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";

import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";

export default {
  name: "EditorPanel",
  components: {},
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    triggerSave: {
      type: Boolean,
      default: () => false,
    },
  },
  watch: {
    item: function (newValue) {
      this.sessionItem = newValue;
      this.imageEditorInst.destroy();
      this.imageEditorInst = null;
      this.handleEditor();
    },
    triggerSave: function (oldValue, newValue) {
      if (oldValue !== newValue) {
        this.handleImage(true);
      }
    },
  },
  data() {
    return {
      sessionItem: this.item,
      imageEditorInst: null,
    };
  },
  mounted() {
    this.handleEditor();
  },
  methods: {
    handleEditor() {
      try {
        const imgPath = `file://${this.sessionItem.filePath}`;
        this.imageEditorInst = new ImageEditor(
          document.querySelector(".image-editor"),
          {
            includeUI: {
              loadImage: {
                path: imgPath,
                name: "image",
              },
              menu: ["draw", "shape", "resize", "text", "icon", "crop"],
              initMenu: "",
              uiSize: {
                width: "100%",
                height: "600px",
              },
              menuBarPosition: "bottom",
            },
            cssMaxHeight: 300,
            selectionStyle: {
              cornerSize: 20,
              rotatingPointOffset: 70,
            },
          }
        );
      } catch (e) {
        console.log(e);
      }
    },
    async handleImage(needCallback = false) {
      const imgURI = this.imageEditorInst.toDataURL();
      window.ipc
        .invoke(IPC_HANDLERS.CAPTURE, {
          func: IPC_FUNCTIONS.UPDATE_IMAGE,
          data: { item: this.sessionItem, url: imgURI },
        })
        .then((result) => {
          this.sessionItem = result;
          this.$root.$emit("update-session", this.sessionItem);
          if (needCallback) {
            this.$root.$emit("save-data");
          }
        });
    },
  },
};
</script>
<style scoped>
.tui-image-editor {
  width: 300px;
  height: 90px;
  overflow: hidden;
}

.tui-image-editor-container {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  min-height: 300px;
  height: 100%;
  position: relative;
  background-color: #282828;
  overflow: hidden;
  letter-spacing: 0.3px;
}
</style>

<template>
  <div
    class="d-flex flex-column"
    style="width: 100%; height: 100%; row-gap: 10px"
  >
    <tui-image-editor
      ref="tuiImageEditor"
      :options="options"
    ></tui-image-editor>
    <div class="d-flex justify-end">
      <v-btn class="mr-2 text-capitalize" fill small color="white">
        Cancel
      </v-btn>
      <v-btn
        class="text-capitalize"
        fill
        small
        color="primary"
        @click="() => handleImage(false)"
      >
        Apply
      </v-btn>
    </div>
  </div>
</template>

<script>
import "tui-color-picker/dist/tui-color-picker.css";
import "tui-image-editor/dist/tui-image-editor.css";
import { ImageEditor } from "@toast-ui/vue-image-editor";

import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";

export default {
  name: "EditorPanel",
  components: {
    "tui-image-editor": ImageEditor,
  },
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
      useDefaultUI: false,
      options: {
        cssMaxHeight: 300,
        includeUI: {
          loadImage: {
            path: `file://${this.item.filePath}`,
            name: "image",
          },
          uiSize: {
            width: "100%",
            height: "600px",
          },
          selectionStyle: {
            cornerSize: 20,
            rotatingPointOffset: 70,
          },
          usageStatistics: false,
          menuBarPosition: "bottom",
          menu: ["draw", "shape", "resize", "text", "crop"],
          initMenu: "",
        },
      },
    };
  },
  mounted() {},
  methods: {
    async handleImage(needCallback = false) {
      const imgURI = this.$refs.tuiImageEditor.invoke("toDataURL");
      window.ipc
        .invoke(IPC_HANDLERS.CAPTURE, {
          func: IPC_FUNCTIONS.UPDATE_IMAGE,
          data: { item: this.sessionItem, url: imgURI },
        })
        .then((result) => {
          this.sessionItem = result;
          if (needCallback) {
            this.$root.$emit("save-data", this.sessionItem);
          }
        });

      // const byteString = atob(dataURL.split(",")[1]);
      // const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
      // const ab = new ArrayBuffer(byteString.length);
      // const ia = new Uint8Array(ab);
      // for (let i = 0; i < byteString.length; i++) {
      //   ia[i] = byteString.charCodeAt(i);
      // }
      // const blob = new Blob([ab], { type: mimeString });
      // const buffer = await blob.arrayBuffer();
      // await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
      //   func: IPC_FUNCTIONS.UPDATE_USER_MEDIA,
      //   data: {
      //     buffer: buffer,
      //     filePath: this.sessionItem.filePath,
      //     fileName: this.sessionItem.fileName,
      //   },
      // });
      // if (needCallback) {
      //   this.$root.$emit("save-data", this.sessionItem);
      // }
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

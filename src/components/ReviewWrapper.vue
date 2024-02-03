<template>
  <div
    class="review-wrapper"
    v-if="
      Object.keys(editSessionItem).length &&
      getType(editSessionItem.fileType) !== 'text'
    "
  >
    <div
      v-if="getType(editSessionItem.fileType) === 'image'"
      style="width: 100%; height: 100%"
    >
      <ImageEditor
        :item="editSessionItem"
        :trigger-save="triggerSaveEvent"
        :defaultColor="config.defaultColor"
      />
    </div>
    <div v-else-if="getType(editSessionItem.fileType) === 'video'">
      <VideoWrapper
        :item="editSessionItem"
        :processing="processing"
        :trigger-save="triggerSaveEvent"
      />
    </div>
    <div v-else-if="getType(editSessionItem.fileType) === 'audio'">
      <AudioWrapper :item="editSessionItem" :trigger-save="triggerSaveEvent" />
    </div>
    <div v-else-if="getType(editSessionItem.fileType) === 'mindmap'">
      <mindmap-editor
        :nodes-data="editSessionItem.content.nodes"
        :connections-data="editSessionItem.content.connections"
        :edit="true"
        :trigger-save="triggerSaveEvent"
        :auto-save="autoSaveEvent"
        @submit-mindmap="handleMindmap"
      />
    </div>
    <div v-else>
      <FileWrapper :item="editSessionItem" :trigger-save="triggerSaveEvent" />
    </div>
  </div>
</template>

<script>
import ImageEditor from "./ImageEditor.vue";
import VideoWrapper from "./VideoWrapper.vue";
import AudioWrapper from "./AudioWrapper.vue";
import FileWrapper from "./FileWrapper.vue";
import MindmapEditor from "./MindmapEditor.vue";

import {
  IPC_HANDLERS,
  IPC_FUNCTIONS,
  STATUSES,
  FILE_TYPES,
} from "../modules/constants";

export default {
  name: "ReviewWrapper",
  components: {
    ImageEditor,
    VideoWrapper,
    AudioWrapper,
    FileWrapper,
    MindmapEditor,
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    processing: {
      type: Boolean,
      default: () => false,
    },
    triggerSave: {
      type: Boolean,
      default: () => false,
    },
    autoSave: {
      type: Boolean,
      default: () => false,
    },
    currentView: {
      type: String,
      default: () => "",
    },
    configItem: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    item: function (newValue) {
      this.editSessionItem = newValue;
    },
    triggerSave: function (newValue) {
      this.triggerSaveEvent = newValue;
    },
    autoSave: function (newValue) {
      this.autoSaveEvent = newValue;
    },
    configItem: function (newValue) {
      this.config = newValue;
    },
  },
  data() {
    return {
      editSessionItem: this.item,
      triggerSaveEvent: this.triggerSave,
      autoSaveEvent: this.autoSave,
      currentViewName: this.currentView,
      config: this.configItem,
    };
  },
  methods: {
    getType(type) {
      return FILE_TYPES[type];
    },
    async handleMindmap(value) {
      this.editSessionItem.content.nodes = value.nodes;
      this.editSessionItem.content.connections = value.connections;
      const { status, message, item } = await window.ipc.invoke(
        IPC_HANDLERS.CAPTURE,
        {
          func: IPC_FUNCTIONS.UPDATE_IMAGE,
          data: { item: this.editSessionItem, url: value.imgURI },
        }
      );
      if (status === STATUSES.ERROR) {
        this.$root.$emit("set-snackbar", message);
        console.log(message);
      } else {
        this.editSessionItem = {
          ...this.editSessionItem,
          ...item,
        };
        this.$root.$emit("update-edit-item", this.editSessionItem);
        this.$root.$emit("save-data");
      }
    },
  },
};
</script>
<style scoped>
.review-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.review-wrapper > div {
  width: 100%;
}
</style>

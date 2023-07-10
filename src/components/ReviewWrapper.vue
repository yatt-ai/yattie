<template>
  <div
    class="review-wrapper"
    v-if="Object.keys(sessionItem).length && sessionItem.fileType !== 'text'"
  >
    <div
      v-if="sessionItem.fileType === 'image'"
      style="width: 100%; height: 100%"
    >
      <ImageEditor
        :item="sessionItem"
        :trigger-save="triggerSaveEvent"
        :defaultColor="config.defaultColor"
      />
    </div>
    <div v-else-if="sessionItem.fileType === 'video'">
      <VideoWrapper
        :item="sessionItem"
        :processing="processing"
        :trigger-save="triggerSaveEvent"
      />
    </div>
    <div v-else-if="sessionItem.fileType === 'audio'">
      <AudioWrapper :item="sessionItem" :trigger-save="triggerSaveEvent" />
    </div>
    <div v-else-if="sessionItem.fileType === 'other'">
      <FileWrapper :item="sessionItem" :trigger-save="triggerSaveEvent" />
    </div>
    <div v-else-if="sessionItem.fileType === 'mindmap'">
      <mindmap-editor
        :nodes-data="sessionItem.content.nodes"
        :connections-data="sessionItem.content.connections"
        :edit="true"
        :trigger-save="triggerSaveEvent"
        :auto-save="autoSaveEvent"
        @submit-mindmap="handleMindmap"
      />
    </div>
  </div>
</template>

<script>
import ImageEditor from "./ImageEditor.vue";
import VideoWrapper from "./VideoWrapper.vue";
import AudioWrapper from "./AudioWrapper.vue";
import FileWrapper from "./FileWrapper.vue";
import MindmapEditor from "./MindmapEditor.vue";

import { IPC_HANDLERS, IPC_FUNCTIONS, STATUSES } from "../modules/constants";

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
      this.sessionItem = newValue;
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
      sessionItem: this.item,
      triggerSaveEvent: this.triggerSave,
      autoSaveEvent: this.autoSave,
      currentViewName: this.currentView,
      config: this.configItem,
    };
  },
  methods: {
    async handleMindmap(value) {
      this.sessionItem.content.nodes = value.nodes;
      this.sessionItem.content.connections = value.connections;
      const { status, message, item } = await window.ipc.invoke(
        IPC_HANDLERS.CAPTURE,
        {
          func: IPC_FUNCTIONS.UPDATE_IMAGE,
          data: { item: this.sessionItem, url: value.imgURI },
        }
      );
      if (status === STATUSES.ERROR) {
        // CTODO - bubble up to snackbar
        console.log(message);
      } else {
        this.sessionItem.fileName = item.fileName;
        this.sessionItem.filePath = item.filePath;
        this.$root.$emit("update-session", this.sessionItem);
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

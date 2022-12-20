<template>
  <v-container fluid class="wrapper">
    <div class="content">
      <div class="content-top">
        <ReviewWrapper
          :item="item"
          :processing="processing"
          :config="config"
          :trigger-save="triggerSaveEvent"
          :auto-save="autoSaveEvent"
        />
      </div>
      <v-divider></v-divider>
      <div class="content-bottom">
        <TextEditor
          placeholder="Insert your note here"
          @update-data="updateComment"
          :content="comment.content"
          :height="250"
        />
        <div class="comment-type">
          <div class="subtitle-2 label-text">
            {{ $tc("caption.comment_type", 1) }}
          </div>
          <v-select
            :items="commentTypes"
            v-model="comment.type"
            :placeholder="$tc('caption.comment_type', 1)"
            solo
            dense
            hide-details="true"
          ></v-select>
        </div>
      </div>
    </div>
    <div class="footer">
      <v-btn
        class="text-capitalize"
        fill
        small
        color="white"
        @click="handleClear"
      >
        {{ $tc("caption.clear", 1) }}
      </v-btn>
      <div class="d-flex">
        <v-btn
          class="mr-2 text-capitalize"
          fill
          small
          color="white"
          :disabled="processing"
          @click="handleDiscard"
        >
          {{ $tc("caption.clear", 1) }}
        </v-btn>
        <v-btn
          class="text-capitalize"
          fill
          small
          color="primary"
          :disabled="processing"
          @click="handleSave"
        >
          {{ $tc("caption.save", 1) }}
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
import ReviewWrapper from "../components/ReviewWrapper.vue";
import TextEditor from "../components/TextEditor.vue";
import dayjs from "dayjs";

import { IPC_HANDLERS, IPC_FUNCTIONS, TEXT_TYPES } from "../modules/constants";

export default {
  name: "AddSession",
  components: {
    ReviewWrapper,
    TextEditor,
  },
  data() {
    return {
      item: {},
      items: [],
      config: {},
      comment: {
        type: "",
        content: "",
        text: "",
      },
      commentTypes: TEXT_TYPES.filter((item) => item !== "Summary"),
      processing: true,
      triggerSaveEvent: false,
      autoSaveEvent: false,
    };
  },
  created() {
    this.fetchItems();
    this.getConfig();
  },
  mounted() {
    if (!window.ipc) return;

    window.ipc.on("ACTIVE_SESSION", async (data) => {
      // set theme mode
      const isDarkMode = this.config.apperance === "dark" ? true : false;
      this.$vuetify.theme.dark = isDarkMode;
      localStorage.setItem("isDarkMode", isDarkMode);

      this.item = data;

      // optimize video
      if (this.item.fileType === "video") {
        this.optimizeVideo();
      } else {
        this.processing = false;
      }

      // set comment type by config
      if (this.config.commentType && this.config.commentType !== "") {
        console.log("comment type:", this.config.commentType);
        this.comment.type = this.config.commentType;
      }
      // set templates by config
      this.config.templates.map((item) => {
        let temp = Object.assign({}, item);
        if (temp.type === this.item.sessionType) {
          this.comment.content = temp.precondition.content;
          this.comment.text = temp.precondition.text;
        }
      });
    });

    this.$root.$on("update-session", this.updateSession);
    this.$root.$on("update-processing", this.updateProcessing);
    this.$root.$on("save-data", this.saveData);
  },
  methods: {
    fetchItems() {
      if (!window.ipc) return;

      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, { func: IPC_FUNCTIONS.GET_ITEMS })
        .then((result) => {
          this.items = result;
        });
    },
    async getConfig() {
      if (!window.ipc) return;

      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.GET_CONFIG,
        })
        .then((result) => {
          this.config = result;
        });
    },
    async optimizeVideo() {
      this.processing = true;

      if (!window.ipc) return;

      await window.ipc
        .invoke(IPC_HANDLERS.CAPTURE, {
          func: IPC_FUNCTIONS.OPTIMIZE_VIDEO,
          data: {
            filePath: this.item.filePath,
          },
        })
        .then(() => {
          this.processing = false;
        });
    },
    updateComment({ content, text }) {
      this.comment.content = content;
      this.comment.text = text;
    },
    updateSession(value) {
      this.item = value;
    },
    updateProcessing(value) {
      console.log("new processing:", value);
      this.processing = value;
    },
    async handleDiscard() {
      await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
        func: IPC_FUNCTIONS.DELETE_FILE,
        data: { filePath: this.item.filePath },
      });
      await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
        func: IPC_FUNCTIONS.DELETE_FILE,
        data: { filePath: this.item.poster },
      });
      window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
        func: IPC_FUNCTIONS.CLOSE_ADD_WINDOW,
      });
    },
    handleSave() {
      this.triggerSaveEvent = !this.triggerSaveEvent;
    },
    async saveData() {
      const date = dayjs().format("MM/DD/YYYY HH:mm:ss");
      const newItem = {
        id: Date.now(),
        ...this.item,
        comment: this.comment,
        time: this.item.time,
        createdAt: date,
      };
      this.items.push(newItem);
      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.UPDATE_ITEMS,
          data: this.items,
        })
        .then(() => {
          window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
            func: IPC_FUNCTIONS.CLOSE_ADD_WINDOW,
          });
        });
    },
    handleClear() {
      this.comment = {
        type: "Comment",
        content: "",
        text: "",
      };
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  padding: 0;
}
.content {
  flex-grow: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.content .content-top {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content .content-bottom {
  padding: 20px;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}
.footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}
</style>

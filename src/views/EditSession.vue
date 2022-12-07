<template>
  <v-container fluid class="wrapper" v-if="Object.keys(item).length">
    <div class="content">
      <div class="content-top">
        <ReviewWrapper
          :item="item"
          :processing="processing"
          :trigger-save="triggerSaveEvent"
        />
      </div>
      <v-divider></v-divider>
      <div class="content-bottom">
        <TextEditor
          placeholder="Insert your note here"
          @update-data="updateComment"
          :content="item.comment.content"
          :height="250"
        />
        <div class="comment-type">
          <div class="subtitle-2 label-text">Comment Type</div>
          <v-select
            :items="commentTypes"
            v-model="item.comment.type"
            placeholder="Comment Type"
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
        Clear
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
          Discard
        </v-btn>
        <v-btn
          class="text-capitalize"
          fill
          small
          color="primary"
          :disabled="processing"
          @click="handleSave"
        >
          Save
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
import ReviewWrapper from "../components/ReviewWrapper.vue";
import TextEditor from "../components/TextEditor.vue";

import { IPC_HANDLERS, IPC_FUNCTIONS, TEXT_TYPES } from "../modules/constants";

export default {
  name: "EditSession",
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
        type: "Comment",
        content: "",
        text: "",
      },
      commentTypes: TEXT_TYPES.filter((item) => item !== "Summary"),
      processing: false,
      triggerSaveEvent: false,
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

      // set templates
      this.item = data;
      this.processing = false;
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

    updateSession(value) {
      this.item = value;
    },
    updateProcessing(value) {
      console.log("new processing:", value);
      this.processing = value;
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
    updateComment({ content, text }) {
      this.item.comment.content = content;
      this.item.comment.text = text;
    },
    handleClear() {
      this.item.comment.type = "Comment";
      this.item.comment.content = "";
      this.item.comment.text = "";
    },
    handleDiscard() {
      if (!window.ipc) return;

      window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
        func: IPC_FUNCTIONS.CLOSE_EDIT_WINDOW,
      });
    },
    async handleSave() {
      this.triggerSaveEvent = !this.triggerSaveEvent;
    },
    async saveData() {
      this.items = this.items.map((item) => {
        let temp = Object.assign({}, item);
        if (temp.id === this.item.id) {
          temp = this.item;
        }
        return temp;
      });

      if (window.ipc) {
        window.ipc
          .invoke(IPC_HANDLERS.DATABASE, {
            func: IPC_FUNCTIONS.UPDATE_ITEMS,
            data: this.items,
          })
          .then(() => {
            window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
              func: IPC_FUNCTIONS.CLOSE_EDIT_WINDOW,
            });
          });
      }
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
.file-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 15px;
}
.file-wrapper .file-icon {
  padding: 30px;
  border-radius: 50%;
  border: 1px solid #d1d5db;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
}
.file-wrapper .file-icon .v-icon {
  color: #6b7280;
  font-size: 50px;
}
.file-wrapper p {
  margin-bottom: 0;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #374151;
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

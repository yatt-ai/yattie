<template>
  <v-container>
    <v-card>
      <v-card-title class="dialog-title"> Take a Summary </v-card-title>
      <v-divider></v-divider>
      <v-container>
        <v-row>
          <v-col cols="12">
            <TextEditor
              placeholder="Insert your summary here"
              @update-data="updateComment"
              :content="comment.content"
              :height="200"
            />
          </v-col>
        </v-row>
        <v-row class="mt-0">
          <v-col class="pr-0">
            <div class="subtitle-2 label-text">Comment Type</div>
            <v-select
              :items="commentTypes"
              placeholder="Comment Type"
              solo
              dense
              disabled
              hide-details="true"
            ></v-select>
          </v-col>
          <v-col cols="auto" class="pl-0 d-flex align-end">
            <v-btn
              plain
              color="primary"
              class="text-capitalize px-0 btn"
              @click="handleClear"
            >
              Clear
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row class="action-wrapper">
          <v-col cols="6 pr-1">
            <v-btn class="btn" small block color="white" @click="handleDiscard">
              Discard
            </v-btn>
          </v-col>
          <v-col cols="6 pl-1">
            <v-btn class="btn" small block color="primary" @click="handleSave">
              Save
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
import TextEditor from "../components/TextEditor.vue";
import {
  IPC_HANDLERS,
  IPC_FUNCTIONS,
  IPC_BIND_KEYS,
  TEXT_TYPES,
} from "../modules/constants";

export default {
  name: "SummaryEditor",
  components: {
    TextEditor,
  },
  data() {
    return {
      config: {},
      comment: {
        type: "Summary",
        content: "",
        text: "",
      },
      commentTypes: TEXT_TYPES,
    };
  },
  created() {
    if (!window.ipc) return;

    window.ipc.on(IPC_BIND_KEYS.MODAL_DATA, (data) => {
      this.config = data;
    });
  },
  methods: {
    handleDiscard() {
      if (!window.ipc) return;

      window.ipc.invoke(IPC_HANDLERS.WINDOW, {
        func: IPC_FUNCTIONS.CLOSE_MODAL_WINDOW,
        data: {
          bindKey: IPC_BIND_KEYS.CLOSED_SUMMARY_DIALOG,
        },
      });
    },
    handleSave() {
      if (!window.ipc) return;

      window.ipc.invoke(IPC_HANDLERS.WINDOW, {
        func: IPC_FUNCTIONS.CLOSE_MODAL_WINDOW,
        data: {
          bindKey: IPC_BIND_KEYS.CLOSED_SUMMARY_DIALOG,
          data: this.comment,
        },
      });
    },
    handleClear() {
      this.comment.type = "Summary";
      this.comment.content = "";
      this.comment.text = "";
    },
    updateComment({ content, text }) {
      this.comment.content = content;
      this.comment.text = text;
    },
  },
};
</script>
<style scoped></style>

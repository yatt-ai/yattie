<template>
  <v-container>
    <v-card :style="{ backgroundColor: currentTheme.background }">
      <v-card-title class="dialog-title">
        {{ $tc("caption.take_summary", 1) }}
      </v-card-title>
      <v-divider></v-divider>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-tiptap
              v-model="comment.content"
              :placeholder="$t('message.insert_summary')"
              ref="comment"
              :toolbar="[
                'headings',
                '|',
                'bold',
                'italic',
                'underline',
                '|',
                'color',
                '|',
                'bulletList',
                'orderedList',
                '|',
                'link',
                'emoji',
                'blockquote',
              ]"
              @input="handleComment"
            >
            </v-tiptap>
          </v-col>
        </v-row>
        <v-row class="mt-0">
          <v-col class="pr-0">
            <div
              class="subtitle-2 label-text"
              :style="{ color: currentTheme.secondary }"
            >
              {{ $tc("caption.comment_type", 1) }}
            </div>
            <v-select
              :items="commentTypes"
              :placeholder="$tc('caption.comment_type', 1)"
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
              {{ $tc("caption.clear", 1) }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row class="action-wrapper">
          <v-col cols="6 pr-1">
            <v-btn
              class="btn"
              small
              block
              color="white"
              :style="{ color: currentTheme.black }"
              @click="handleDiscard"
            >
              {{ $tc("caption.discard", 1) }}
            </v-btn>
          </v-col>
          <v-col cols="6 pl-1">
            <v-btn class="btn" small block color="primary" @click="handleSave">
              {{ $tc("caption.save", 1) }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
import {
  IPC_HANDLERS,
  IPC_FUNCTIONS,
  IPC_BIND_KEYS,
  TEXT_TYPES,
} from "../modules/constants";

export default {
  name: "SummaryEditor",
  components: {},
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
  computed: {
    currentTheme() {
      if (this.$vuetify.theme.dark) {
        return this.$vuetify.theme.themes.dark;
      } else {
        return this.$vuetify.theme.themes.light;
      }
    },
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
    handleComment() {
      const regex = /(<([^>]+)>)/gi;
      this.comment.text = this.comment.content.replace(regex, "");
    },
  },
};
</script>
<style scoped>
.theme--dark .v-sheet.v-card {
  box-shadow: none;
}
</style>

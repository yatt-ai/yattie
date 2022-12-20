<template>
  <v-dialog v-bind="$attrs" v-on="$listeners" persistent width="100%" eager>
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <v-card-title class="dialog-title">
          {{ $tc("caption.take_noe", 1) }}
        </v-card-title>
        <v-divider></v-divider>
        <v-container class="note-wrapper">
          <v-row>
            <v-col cols="12">
              <TextEditor
                :placeholder="$t('message.insert_note')"
                @update-data="updateNote"
                :content="comment.content"
                :height="200"
              />
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col cols="12">
              <vue-tags-input
                class="input-box"
                v-model="tag"
                :tags="comment.tags"
                :max-tags="10"
                :maxlength="20"
                @tags-changed="handleTags"
                :placeholder="$t('message.insert_tag')"
              />
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col class="pr-0">
              <div class="subtitle-2 label-text">{{ $tc("note_type", 1) }}</div>
              <v-select
                :items="commentTypes"
                v-model="comment.type"
                :placeholder="$tc('caption.comment_type')"
                solo
                dense
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
                @click="handleDiscard"
              >
                {{ $tc("caption.discard", 1) }}
              </v-btn>
            </v-col>
            <v-col cols="6 pl-1">
              <v-btn
                class="btn"
                small
                block
                color="primary"
                @click="handleSave"
              >
                {{ $tc("caption.save", 1) }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script>
import TextEditor from "../TextEditor.vue";
import VueTagsInput from "@johmun/vue-tags-input";
import { TEXT_TYPES } from "../../modules/constants";
export default {
  name: "NoteDialog",
  components: {
    TextEditor,
    VueTagsInput,
  },
  props: {
    configItem: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    configItem: function (newValue) {
      this.config = newValue;

      // set comment type by config
      if (this.config.commentType && this.config.commentType !== "") {
        this.comment.type = this.config.commentType;
      }

      // set templates by config
      this.config.templates.map((item) => {
        let temp = Object.assign({}, item);
        if (temp.type === "Note") {
          this.comment.content = temp.precondition.content;
          this.comment.text = temp.precondition.text;
        }
      });
    },
  },
  data() {
    return {
      config: this.configItem,
      comment: {
        type:
          this.conifgItem &&
          this.configItem.commentType &&
          this.configItem.commentType !== ""
            ? this.configItem.commentType
            : "Comment",
        content: "",
        text: "",
        tags: [],
      },
      commentTypes: TEXT_TYPES.filter((item) => item !== "Summary"),
      tag: "",
      tags: [],
    };
  },
  methods: {
    handleDiscard() {
      this.handleClear();
      this.$root.$emit("close-notedialog");
    },
    handleSave() {
      const data = { ...this.comment };
      this.handleClear();
      this.$emit("submit-comment", data);
    },
    handleClear() {
      console.log("clear");
      this.comment.type = "Comment";
      this.comment.content = "";
      this.comment.text = "";
      this.comment.tags = [];
    },
    updateNote({ content, text }) {
      this.comment.content = content;
      this.comment.text = text;
    },
    handleTags(newTags) {
      this.comment.tags = newTags;
    },
  },
};
</script>

<style scoped>
.dialog-title {
  /* border-bottom: 1px solid #e5e7eb; */
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  color: #111827;
  padding: 12px;
}
.dialog-content {
  max-height: 250px;
  overflow-y: auto;
}
.v-card__actions {
  padding: 12px;
}
</style>

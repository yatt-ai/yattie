<template>
  <v-dialog v-bind="$attrs" v-on="$listeners" persistent width="100%" eager>
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <v-card-title class="dialog-title"> Take a Note</v-card-title>
        <v-divider></v-divider>
        <v-container class="note-wrapper">
          <v-row>
            <v-col cols="12">
              <TextEditor
                placeholder="Insert your note here"
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
                placeholder="Insert your tags here"
              />
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col class="pr-0">
              <div class="subtitle-2 label-text">Note Type</div>
              <v-select
                :items="commentTypes"
                v-model="comment.type"
                placeholder="Comment Type"
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
                Clear
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
                Discard
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
                Save
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
  destroyed() {
    this.handleClear();
  },
  methods: {
    handleDiscard() {
      this.$root.$emit("close-notedialog");
    },
    handleSave() {
      this.$emit("submit-comment", this.comment);
    },
    handleClear() {
      this.comment.type = "Comment";
      this.comment.content = "";
      this.comment.text = "";
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

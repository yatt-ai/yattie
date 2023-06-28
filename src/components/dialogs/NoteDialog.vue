<template>
  <v-dialog
    v-bind="$attrs"
    v-on="$listeners"
    persistent
    width="100%"
    max-width="500px"
    eager
  >
    <v-sheet outlined rounded>
      <v-card :style="{ backgroundColor: currentTheme.background }">
        <v-card-title class="dialog-title">
          {{ $tc("caption.take_note", 1) }}
        </v-card-title>
        <v-divider></v-divider>
        <v-container class="note-wrapper">
          <v-row>
            <v-col cols="12">
              <v-tiptap
                v-model="comment.content"
                :placeholder="$t('message.insert_note')"
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
            <v-col cols="12">
              <vue-tags-input
                class="input-box"
                v-model="tag"
                :tags="tags"
                :max-tags="10"
                :maxlength="20"
                @tags-changed="handleTags"
                :placeholder="$t('message.insert_tag')"
              />
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col class="pr-0">
              <div :style="{ color: currentTheme.secondary }">
                {{ $tc("caption.note_type", 1) }}
              </div>
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
                :color="currentTheme.secondary"
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
                :color="currentTheme.background"
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
import VueTagsInput from "@johmun/vue-tags-input";
import { TEXT_TYPES } from "../../modules/constants";
export default {
  name: "NoteDialog",
  components: {
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
      this.resetData();
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
      },
      commentTypes: Object.keys(TEXT_TYPES).filter(
        (item) => item !== "Summary"
      ),
      tag: "",
      tags: [],
    };
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
    resetData() {
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
    handleDiscard() {
      this.$root.$emit("close-notedialog");
      this.resetData();
    },
    handleSave() {
      const commentCopy = JSON.parse(JSON.stringify(this.comment));
      const data = {
        comment: commentCopy,
        tags: this.tags,
      };
      this.$emit("submit-comment", data);
      this.resetData();
    },
    handleClear() {
      this.comment.type = "Comment";
      this.comment.content = "";
      this.comment.text = "";
      this.tags = [];
    },
    handleComment() {
      const regex = /(<([^>]+)>)/gi;
      this.comment.text = this.comment.content.replace(regex, "");
    },
    handleTags(newTags) {
      this.tags = newTags;
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

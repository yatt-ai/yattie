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
          <div class="actions-wrapper">
            <template v-if="emoji.length">
              <v-btn
                rounded
                color="primary"
                class="pa-0 mb-1"
                height="26"
                min-width="45"
                style=""
                v-for="(emoji, i) in emoji"
                :key="i"
                @click="removeEmoji(emoji)"
              >
                <span class="emoji-icon">{{ emoji.data }}</span>
                <v-icon x-small>mdi-close</v-icon>
              </v-btn>
            </template>

            <v-menu
              v-model="emojiMenu"
              :close-on-content-click="false"
              right
              bottom
              nudge-bottom="4"
              offset-y
            >
              <template v-slot:activator="{ on: emojiMenu }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                      rounded
                      class="pa-0 mb-1"
                      height="26"
                      min-width="35"
                      v-on="{
                        ...emojiMenu,
                        ...tooltip,
                      }"
                    >
                      <img
                        :src="require('../../assets/icon/add-emoticon.svg')"
                        width="24"
                        height="24"
                      />
                    </v-btn>
                  </template>
                  <span>{{ $tc("caption.add_reaction", 1) }}</span>
                </v-tooltip>
              </template>
              <v-card class="emoji-lookup">
                <VEmojiPicker
                  labelSearch="Search"
                  lang="en-US"
                  @select="selectEmoji"
                />
              </v-card>
            </v-menu>
          </div>
          <div class="check-box">
            <label
              ><input
                type="checkbox"
                name="follow_up"
                class="item-select"
                v-model="followUp"
                @change="handleFollowUp($event)"
              />{{ $tc("caption.required_follow_up", 1) }}
            </label>
          </div>
          <v-row class="mt-0">
            <v-col cols="12">
              <vue-tags-input
                class="input-box"
                v-model="tag_text"
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
import { VEmojiPicker } from "v-emoji-picker";

export default {
  name: "NoteDialog",
  components: {
    VueTagsInput,
    VEmojiPicker,
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
      tag_text: "",
      emojiMenu: false,
      tags: [],
      emoji: [],
      followUp: false,
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

      this.emojiMenu = false;
      this.tags = [];
      this.emoji = [];
      this.followUp = false;
    },
    selectEmoji(emoji) {
      this.emojiMenu = false;
      if (this.emoji.filter((item) => item.data === emoji.data).length) {
        this.emoji = this.emoji.filter((item) => item.data !== emoji.data);
      } else {
        this.emoji.push(emoji);
      }
    },
    removeEmoji(emoji) {
      this.emoji = this.emoji.filter((item) => item.data !== emoji.data);
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
        emoji: this.emoji,
        followUp: this.followUp,
      };
      this.$emit("submit-note", data);
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
    handleFollowUp($event) {
      this.followUp = $event.target.checked;
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
.actions-wrapper {
  display: flex;
  column-gap: 3px;
  flex-wrap: wrap;
}
.actions-wrapper .v-btn.theme--dark {
  background-color: white;
  margin-left: 2px;
}
.emoji-icon {
  font-size: 18px;
  line-height: 1;
}
.check-box {
  display: flex;
  align-items: center;
}
.check-box > label {
  display: flex;
  column-gap: 5px;
  font-size: 13px;
  align-items: center;
  font-weight: 500;
  line-height: 20px;
  color: #6b7280;
}
</style>

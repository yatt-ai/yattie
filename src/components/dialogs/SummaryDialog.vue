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
        <v-card-title
          class="dialog-title"
          :style="{ color: currentTheme.secondary }"
        >
          {{ $tc("caption.summarize_session", 1) }}
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
              <div class="error px-2 py-1" v-if="isEmpty">
                <span style="color: #fff">{{
                  $tc("caption.required_field", 1)
                }}</span>
              </div>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <div :style="{ color: currentTheme.secondary }">
                {{ $tc("caption.comment_type", 1) }}
              </div>
              <v-select
                :items="commentTypes"
                v-model="comment.type"
                :placeholder="$tc('caption.comment_type', 1)"
                solo
                dense
                disabled
                hide-details="true"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-row class="action-wrapper">
            <v-col cols="6" class="pr-1">
              <v-btn
                class="btn px-8"
                small
                block
                :color="currentTheme.background"
                @click="handleCancel"
              >
                {{ $tc("caption.cancel", 1) }}
              </v-btn>
            </v-col>
            <v-col cols="6" class="pr-1">
              <v-btn
                class="btn px-8"
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
import { TEXT_TYPES } from "../../modules/constants";
export default {
  name: "SummaryDialog",
  components: {},
  props: {
    configItem: {
      type: Object,
      default: () => {},
    },
    summary: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    configItem: function (newValue) {
      this.config = newValue;
      this.isRequired = this.config.summary;
    },
    summary: function (newValue) {
      if (Object.keys(newValue).length) {
        this.comment.content = newValue.comment.content;
        this.comment.text = newValue.comment.text;
      }
    },
  },
  data() {
    return {
      config: this.configItem,
      comment: {
        type: "Summary",
        content: "",
        text: "",
      },
      commentTypes: Object.keys(TEXT_TYPES),
      isRequired: this.configItem.summary,
      isEmpty: false,
    };
  },
  destroyed() {
    this.handleClear();
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
    handleCancel() {
      this.$root.$emit("close-summarydialog");
    },
    handleSave() {
      if (this.isRequired && !this.validate()) {
        this.isEmpty = true;
        return;
      }
      this.$emit("submit-summary", this.comment);
    },
    handleClear() {
      this.comment.type = "Summary";
      this.comment.content = "";
      this.comment.text = "";
    },
    handleComment() {
      const regex = /(<([^>]+)>)/gi;
      this.comment.text = this.comment.content.replace(regex, "");
      if (this.isRequired && !this.validate()) {
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }
    },
    validate() {
      if (!this.comment.text || this.comment.text === "") {
        return false;
      }
      return true;
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

<template>
  <v-dialog v-bind="$attrs" v-on="$listeners" persistent width="100%" eager>
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <v-card-title class="dialog-title"> Take a Summary</v-card-title>
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
                v-model="comment.type"
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
import { TEXT_TYPES } from "../../modules/constants";
export default {
  name: "SummaryDialog",
  components: {
    TextEditor,
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
      commentTypes: TEXT_TYPES,
    };
  },
  destroyed() {
    this.handleClear();
  },
  methods: {
    handleDiscard() {
      this.$root.$emit("close-summarydialog");
    },
    handleSave() {
      this.$emit("submit-comment", this.comment);
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

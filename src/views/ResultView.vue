<template>
  <v-container fluid style="min-height: 100vh" class="d-flex">
    <v-row>
      <v-col cols="3" class="wrapper pa-0">
        <div class="header">
          <LogoWrapper :height="34" :width="120" />
        </div>
        <div class="content">
          <TestWrapper />
        </div>
        <div class="footer">
          <ExportPanel :items="items" />
        </div>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="6" class="wrapper">
        <div
          v-if="Object.keys(activeSession).length"
          class="d-flex flex-column"
          style="height: 100%"
        >
          <div class="flex-grow-1">
            <ReviewWrapper :item="activeSession" :auto-save="autoSaveEvent" />
          </div>
          <div class="flex-grow-0 mt-2">
            <TextEditor
              placeholder="Enter your comment here!"
              @update-data="handleComment"
              :content="activeSession.comment.content"
              :height="250"
            />
            <v-row class="mt-0 comment-wrapper">
              <v-col class="pr-0">
                <div class="subtitle-2 label-text">Comment Type</div>
                <v-select
                  :items="commentTypes"
                  v-model="activeSession.comment.type"
                  placeholder="Comment Type"
                  solo
                  dense
                  @change="handleCommentType"
                  hide-details="true"
                ></v-select>
              </v-col>
              <v-col cols="auto" class="pl-0 d-flex align-end">
                <v-btn
                  plain
                  color="primary"
                  class="text-capitalize px-0"
                  @click="handleClear"
                >
                  Clear
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="3" class="wrapper pa-0">
        <div class="header">
          <SearchWrapper />
        </div>
        <div class="content my-1">
          <TimelineWrapper
            :items="searchItems"
            :selectedItems="selected"
            event-type="click"
            @submit-session="updateActiveSession"
          />
        </div>
        <div class="footer">
          <ControlPanel :selectedItems="selected" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SearchWrapper from "../components/SearchWrapper.vue";
import TestWrapper from "../components/TestWrapper.vue";
import TimelineWrapper from "../components/TimelineWrapper.vue";
import ControlPanel from "../components/ControlPanel.vue";
import ExportPanel from "../components/ExportPanel.vue";
import LogoWrapper from "../components/LogoWrapper.vue";
import ReviewWrapper from "../components/ReviewWrapper.vue";
import TextEditor from "../components/TextEditor.vue";

import { IPC_HANDLERS, IPC_FUNCTIONS, TEXT_TYPES } from "../modules/constants";

export default {
  name: "ResultView",
  components: {
    SearchWrapper,
    TestWrapper,
    TimelineWrapper,
    ControlPanel,
    ExportPanel,
    LogoWrapper,
    ReviewWrapper,
    TextEditor,
  },
  data() {
    return {
      items: [],
      activeSession: {},
      commentTypes: TEXT_TYPES,
      type: "Comment",
      search: "",
      selected: [],
      autoSaveEvent: true,
    };
  },
  created() {
    this.fetchItems();
  },
  computed: {
    searchItems() {
      let tempItems = this.items;

      if (this.search !== "" && this.search) {
        tempItems = tempItems.filter((item) => {
          return item.comment.content
            .toUpperCase()
            .includes(this.search.toUpperCase());
        });
      }
      return tempItems;
    },
  },
  mounted() {
    this.$root.$on("submit-search", this.handleSearch);
    this.$root.$on("update-selected", this.updateSelected);
    this.$root.$on("save-data", this.updateActiveSession);
    window.ipc.on("DATA_CHANGE", () => {
      this.fetchItems();
    });
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
    handleSearch(val) {
      this.search = val;
    },
    handleComment({ content, text }) {
      this.activeSession.comment.content = content;
      this.activeSession.comment.text = text;
      this.updateItems();
    },
    handleCommentType(val) {
      this.activeSession.commentType = val;
      this.updateItems();
    },
    updateItems() {
      this.items = this.items.map((item) => {
        let temp = Object.assign({}, item);
        if (temp.id === this.activeSession.id) {
          temp = this.activeSession;
        }
        return temp;
      });
      window.ipc.invoke(IPC_HANDLERS.DATABASE, {
        func: IPC_FUNCTIONS.UPDATE_ITEMS,
        data: this.items,
      });
    },
    handleClear() {
      this.activeSession.comment = "";
      this.activeSession.commentType = "Comment";
      this.updateItems();
    },
    updateSelected(value) {
      this.selected = value;
    },
    updateActiveSession(value) {
      this.activeSession = value;
      this.updateItems();
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
}

.header {
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  flex-grow: 1;
  overflow: auto;
}

.footer {
  width: 100%;
  display: flex;
  align-items: center;
}
</style>

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
            <ReviewWrapper
              :item="activeSession"
              :auto-save="autoSaveEvent"
              :configItem="config"
            />
          </div>
          <div class="flex-grow-0 mt-2">
            <v-tiptap
              v-model="activeSession.comment.content"
              :placeholder="$t('message.insert_comment')"
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
            <vue-tags-input
              class="input-box mt-2"
              v-model="tag"
              :tags="activeSession.tags"
              :max-tags="10"
              :maxlength="20"
              @tags-changed="handleTags"
              :placeholder="$t('message.insert_tag')"
            />
            <v-row class="mt-0 comment-wrapper">
              <v-col class="pr-0">
                <div class="subtitle-2 label-text">
                  {{ $tc("caption.comment_type", 1) }}
                </div>
                <v-select
                  :items="commentTypes"
                  v-model="activeSession.comment.type"
                  :placeholder="$tc('caption.comment_type', 1)"
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
                  {{ $tc("caption.clear", 1) }}
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
          <WorkspaceWrapper
            :items="searchItems"
            :selectedItems="selected"
            event-type="click"
            @submit-session="updateActiveSession"
          />
        </div>
        <div class="footer">
          <ControlPanel
            :selectedItems="selected"
            :items="items"
            :configItem="config"
            view-mode="normal"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SearchWrapper from "../components/SearchWrapper.vue";
import TestWrapper from "../components/TestWrapper.vue";
import WorkspaceWrapper from "../components/WorkspaceWrapper.vue";
import ControlPanel from "../components/ControlPanel.vue";
import ExportPanel from "../components/ExportPanel.vue";
import LogoWrapper from "../components/LogoWrapper.vue";
import ReviewWrapper from "../components/ReviewWrapper.vue";

import VueTagsInput from "@johmun/vue-tags-input";

import { IPC_HANDLERS, IPC_FUNCTIONS, TEXT_TYPES } from "../modules/constants";

export default {
  name: "ResultView",
  components: {
    SearchWrapper,
    TestWrapper,
    WorkspaceWrapper,
    ControlPanel,
    ExportPanel,
    LogoWrapper,
    ReviewWrapper,
    VueTagsInput,
  },
  data() {
    return {
      items: [],
      config: {},
      activeSession: {},
      commentTypes: TEXT_TYPES.filter((item) => item !== "Summary"),
      type: "Comment",
      search: "",
      selected: [],
      autoSaveEvent: true,
      postsession: {
        tasks: [],
      },
      tag: "",
    };
  },
  created() {
    this.fetchItems();
    this.getConfig();
  },
  mounted() {
    this.$root.$on("submit-search", this.handleSearch);
    this.$root.$on("update-selected", this.updateSelected);
    this.$root.$on("save-data", this.updateActiveSession);
    this.$root.$on("update-session", this.updateActiveSession);

    if (!window.ipc) return;

    window.ipc.on("DATA_CHANGE", () => {
      this.fetchItems();
    });
    window.ipc.on("CONFIG_CHANGE", () => {
      this.getConfig();
    });
    window.ipc.on("META_CHANGE", () => {
      this.fetchItems();
      this.getConfig();
    });
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
  methods: {
    fetchItems() {
      if (!window.ipc) return;

      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, { func: IPC_FUNCTIONS.GET_ITEMS })
        .then((result) => {
          this.items = result;
        });
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
    handleSearch(val) {
      this.search = val;
    },
    handleComment() {
      const regex = /(<([^>]+)>)/gi;
      this.activeSession.comment.text =
        this.activeSession.comment.content.replace(regex, "");
      this.saveData();
    },
    handleTags(newTags) {
      this.activeSession.tags = newTags;
    },
    handleCommentType(val) {
      this.activeSession.commentType = val;
      this.saveData();
    },
    saveData() {
      this.items = this.items.map((item) => {
        let temp = Object.assign({}, item);
        if (temp.id === this.activeSession.id) {
          temp = this.activeSession;
        }
        return temp;
      });

      if (!window.ipc) return;

      window.ipc.invoke(IPC_HANDLERS.DATABASE, {
        func: IPC_FUNCTIONS.UPDATE_ITEMS,
        data: this.items,
      });
    },
    handleClear() {
      this.activeSession.comment = "";
      this.activeSession.commentType = "Comment";
      this.saveData();
    },
    updateSelected(value) {
      this.selected = value;
    },
    updateActiveSession(value) {
      this.activeSession = value;
      this.saveData();
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

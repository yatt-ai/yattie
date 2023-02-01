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
          <ExportPanel
            :items="items"
            :configItem="config"
            :credentialItem="credential"
            :isAuthenticated="checkAuth"
          />
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
            <div
              class="actions-wrapper mt-1 mb-2"
              v-if="
                activeSession.fileType === 'image' ||
                activeSession.fileType === 'video' ||
                activeSession.fileType === 'audio'
              "
            >
              <template v-if="activeSession.emoji.length">
                <v-btn
                  rounded
                  color="primary"
                  dark
                  class="pa-0 mb-1"
                  height="26"
                  min-width="45"
                  style=""
                  v-for="(emoji, i) in activeSession.emoji"
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
                          :src="require('../assets/icon/add-emoticon.svg')"
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
            <div class="check-box mb-2">
              <label
                ><input
                  type="checkbox"
                  name="follow_up"
                  class="item-select"
                  v-model="activeSession.followUp"
                  @change="handleFollowUp($event)"
                />{{ $tc("caption.required_follow_up", 1) }}
              </label>
            </div>
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
            :credentialItem="credential"
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
import { VEmojiPicker } from "v-emoji-picker";

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
    VEmojiPicker,
  },
  props: {
    isAuthenticated: {
      type: Boolean,
      default: () => false,
    },
  },
  watch: {
    isAuthenticated: function (newValue) {
      this.checkAuth = newValue;
    },
  },
  data() {
    return {
      items: [],
      config: {},
      credential: {},
      checkAuth: this.isAuthenticated,
      activeSession: {},
      commentTypes: TEXT_TYPES.filter((item) => item !== "Summary"),
      type: "Comment",
      emojiMenu: false,
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
    this.getCredential();
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
    window.ipc.on("CREDENTIAL_CHANGE", () => {
      this.getCredential();
    });
    window.ipc.on("META_CHANGE", () => {
      this.fetchItems();
      this.getConfig();
      this.getCredential();
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
    getConfig() {
      if (!window.ipc) return;

      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.GET_CONFIG,
        })
        .then((result) => {
          this.config = result;
        });
    },
    getCredential() {
      if (!window.ipc) return;

      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.GET_CREDENTIAL,
        })
        .then((result) => {
          this.credential = result;
        });
    },
    selectEmoji(emoji) {
      this.emojiMenu = false;
      if (
        this.activeSession.emoji.filter((item) => item.data === emoji.data)
          .length
      ) {
        this.activeSession.emoji = this.activeSession.emoji.filter(
          (item) => item.data !== emoji.data
        );
      } else {
        this.activeSession.emoji.push(emoji);
      }
      this.saveData();
    },
    removeEmoji(emoji) {
      this.activeSession.emoji = this.activeSession.emoji.filter(
        (item) => item.data !== emoji.data
      );
      this.saveData();
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
      this.saveData();
    },
    handleFollowUp($event) {
      this.activeSession.followUp = $event.target.checked;
      this.saveData();
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
.actions-wrapper {
  display: flex;
  column-gap: 3px;
  flex-wrap: wrap;
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
.footer {
  width: 100%;
  display: flex;
  align-items: center;
}
</style>

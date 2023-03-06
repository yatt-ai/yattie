<template>
  <v-container fluid class="wrapper">
    <div class="content">
      <div class="content-top">
        <ReviewWrapper
          :item="item"
          :processing="processing"
          :configItem="config"
          :trigger-save="triggerSaveEvent"
          :auto-save="autoSaveEvent"
        />
      </div>
      <v-divider></v-divider>
      <div class="content-bottom">
        <div
          class="actions-wrapper"
          v-if="
            item.fileType === 'image' ||
            item.fileType === 'video' ||
            item.fileType === 'audio'
          "
        >
          <template v-if="emojis.length">
            <v-btn
              rounded
              color="primary"
              dark
              class="pa-0 mb-1"
              height="26"
              min-width="45"
              style=""
              v-for="(emoji, i) in emojis"
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
        <div class="check-box">
          <label
            ><input
              type="checkbox"
              name="follow_up"
              class="item-select"
              v-model="item.followUp"
              @change="handleFollowUp($event)"
            />{{ $tc("caption.required_follow_up", 1) }}
          </label>
        </div>
        <v-tiptap
          v-model="comment.content"
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
          @input="updateComment"
        >
        </v-tiptap>
        <vue-tags-input
          class="input-box"
          v-model="tag"
          :tags="tags"
          :max-tags="10"
          :maxlength="20"
          @tags-changed="handleTags"
          :placeholder="$t('message.insert_tag')"
        />
        <div class="comment-type">
          <div :style="{ color: currentTheme.secondary }">
            {{ $tc("caption.comment_type", 1) }}
          </div>
          <v-select
            :items="commentTypes"
            v-model="comment.type"
            :placeholder="$tc('caption.comment_type', 1)"
            solo
            dense
            hide-details="true"
          ></v-select>
        </div>
      </div>
    </div>
    <div class="footer">
      <v-btn
        class="text-capitalize"
        fill
        small
        color="white"
        :style="{ color: currentTheme.black }"
        @click="handleClear"
      >
        {{ $tc("caption.clear", 1) }}
      </v-btn>
      <div class="d-flex">
        <v-btn
          class="mr-2 text-capitalize"
          fill
          small
          color="white"
          :disabled="processing"
          :style="{ color: currentTheme.black }"
          @click="handleDiscard"
        >
          {{ $tc("caption.discard", 1) }}
        </v-btn>
        <v-btn
          class="text-capitalize"
          fill
          small
          color="primary"
          :disabled="processing"
          @click="handleSave"
        >
          {{ $tc("caption.save", 1) }}
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
import ReviewWrapper from "../components/ReviewWrapper.vue";
import VueTagsInput from "@johmun/vue-tags-input";
import { VEmojiPicker } from "v-emoji-picker";

import dayjs from "dayjs";

import { IPC_HANDLERS, IPC_FUNCTIONS, TEXT_TYPES } from "../modules/constants";

export default {
  name: "AddSession",
  components: {
    ReviewWrapper,
    VueTagsInput,
    VEmojiPicker,
  },
  data() {
    return {
      item: {},
      items: [],
      config: {},
      comment: {
        type: "",
        content: "",
        text: "",
      },
      tag: "",
      tags: [],
      emojiMenu: false,
      emojis: [],
      commentTypes: TEXT_TYPES.filter((item) => item !== "Summary"),
      processing: true,
      triggerSaveEvent: false,
      autoSaveEvent: false,
    };
  },
  created() {
    this.fetchItems();
    this.getConfig();
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
  mounted() {
    if (!window.ipc) return;

    window.ipc.on("ACTIVE_SESSION", async (data) => {
      // set theme mode
      const isDarkMode = this.config.apperance === "dark" ? true : false;
      this.$vuetify.theme.dark = isDarkMode;
      localStorage.setItem("isDarkMode", isDarkMode);

      this.item = data;

      // optimize video
      if (this.item.fileType === "video") {
        this.optimizeVideo();
      } else {
        this.processing = false;
      }

      // set comment type by config
      if (this.config.commentType && this.config.commentType !== "") {
        this.comment.type = this.config.commentType;
      }
      // set templates by config
      this.config.templates.map((item) => {
        let temp = Object.assign({}, item);
        if (temp.type === this.item.sessionType) {
          this.comment.content = temp.precondition.content;
          this.comment.text = temp.precondition.text;
        }
      });
    });

    this.$root.$on("update-session", this.updateSession);
    this.$root.$on("update-processing", this.updateProcessing);
    this.$root.$on("save-data", this.saveData);
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
    async optimizeVideo() {
      this.processing = true;

      if (!window.ipc) return;

      await window.ipc
        .invoke(IPC_HANDLERS.CAPTURE, {
          func: IPC_FUNCTIONS.OPTIMIZE_VIDEO,
          data: {
            filePath: this.item.filePath,
          },
        })
        .then(() => {
          this.processing = false;
        });
    },
    updateComment() {
      const regex = /(<([^>]+)>)/gi;
      this.comment.text = this.comment.content.replace(regex, "");
    },
    updateSession(value) {
      this.item = value;
    },
    updateProcessing(value) {
      this.processing = value;
    },
    async handleDiscard() {
      await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
        func: IPC_FUNCTIONS.DELETE_FILE,
        data: { filePath: this.item.filePath },
      });
      await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
        func: IPC_FUNCTIONS.DELETE_FILE,
        data: { filePath: this.item.poster },
      });
      window.ipc.invoke(IPC_HANDLERS.WINDOW, {
        func: IPC_FUNCTIONS.CLOSE_ADD_WINDOW,
      });
    },
    handleSave() {
      this.triggerSaveEvent = !this.triggerSaveEvent;
    },
    handleTags(newTags) {
      this.tags = newTags;
    },
    handleFollowUp($event) {
      this.item.followUp = $event.target.checked;
    },
    selectEmoji(emoji) {
      this.emojiMenu = false;
      if (this.emojis.filter((item) => item.data === emoji.data).length) {
        this.emojis = this.emojis.filter((item) => item.data !== emoji.data);
      } else {
        this.emojis.push(emoji);
      }
    },
    removeEmoji(emoji) {
      this.emojis = this.emojis.filter((item) => item.data !== emoji.data);
    },
    async saveData() {
      const date = dayjs().format("MM/DD/YYYY HH:mm:ss");
      const newItem = {
        id: Date.now(),
        ...this.item,
        comment: this.comment,
        tags: this.tags,
        emoji: this.emojis,
        followUp: false,
        time: this.item.time,
        createdAt: date,
      };
      this.items.push(newItem);
      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.UPDATE_ITEMS,
          data: this.items,
        })
        .then(() => {
          window.ipc.invoke(IPC_HANDLERS.WINDOW, {
            func: IPC_FUNCTIONS.CLOSE_ADD_WINDOW,
          });
        });
    },
    handleClear() {
      this.comment = {
        type: "Comment",
        content: "",
        text: "",
      };
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
  padding: 0;
}
.content {
  flex-grow: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.content .content-top {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content .content-bottom {
  padding: 20px;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
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
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}
</style>

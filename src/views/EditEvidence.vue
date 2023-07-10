<template>
  <v-container fluid class="wrapper" v-if="Object.keys(item).length">
    <div class="content">
      <div
        class="content-top"
        v-if="Object.keys(item).length && item.fileType !== 'text'"
      >
        <ReviewWrapper
          :item="item"
          :configItem="config"
          :processing="processing"
          :trigger-save="triggerSaveEvent"
        />
      </div>
      <v-divider></v-divider>
      <div class="content-bottom">
        <div v-if="item.fileType !== 'text'">
          <div class="actions-wrapper">
            <template v-if="item.emoji.length">
              <v-btn
                rounded
                color="primary"
                class="pa-0 mb-1"
                height="26"
                min-width="45"
                style=""
                v-for="(emoji, i) in item.emoji"
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
        </div>
        <v-text-field
          name="name"
          color="secondary"
          :label="$tc('caption.filename', 1)"
          v-model="name"
          :suffix="fileSuffix"
          :disabled="processing"
          @input="handleName"
        />
        <v-tiptap
          v-model="item.comment.content"
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
        <div class="actions-wrapper" v-if="item.fileType === 'text'">
          <template v-if="item.emoji.length">
            <v-btn
              rounded
              color="primary"
              class="pa-0 mb-1"
              height="26"
              min-width="45"
              style=""
              v-for="(emoji, i) in item.emoji"
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
        <vue-tags-input
          class="input-box"
          v-model="tag"
          :tags="item.tags"
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
            v-model="item.comment.type"
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

import { IPC_HANDLERS, IPC_FUNCTIONS, TEXT_TYPES } from "../modules/constants";

export default {
  name: "EditEvidence",
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
        type: "Comment",
        content: "",
        text: "",
      },
      name: "",
      tag: "",
      emojiMenu: false,
      commentTypes: Object.keys(TEXT_TYPES).filter(
        (item) => item !== "Summary"
      ),
      processing: false,
      triggerSaveEvent: false,
    };
  },
  created() {
    this.fetchItems();
    this.getConfig();
  },
  computed: {
    fileSuffix() {
      let splitName = [];
      if (this.item?.fileName) {
        splitName = this.item?.fileName.split(".");
      }
      return splitName.length > 1 ? "." + splitName[splitName.length - 1] : "";
    },
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

      // set templates
      this.item = data;

      const splitName = this.item?.fileName.split(".") || [""];
      this.name = splitName.slice(0, -1).join(".");

      this.processing = false;
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

    updateSession(value) {
      this.item = value;
    },
    updateProcessing(value) {
      this.processing = value;
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
    updateComment() {
      const regex = /(<([^>]+)>)/gi;
      this.item.comment.text = this.item.comment.content.replace(regex, "");
    },
    selectEmoji(emoji) {
      this.emojiMenu = false;
      if (this.item.emoji.filter((item) => item.data === emoji.data).length) {
        this.item.emoji = this.item.emoji.filter(
          (item) => item.data !== emoji.data
        );
      } else {
        this.item.emoji.push(emoji);
      }
    },
    removeEmoji(emoji) {
      this.item.emoji = this.item.emoji.filter(
        (item) => item.data !== emoji.data
      );
    },
    handleClear() {
      this.item.comment.type = "Comment";
      this.item.comment.content = "";
      this.item.comment.text = "";
    },
    handleDiscard() {
      if (!window.ipc) return;

      window.ipc.invoke(IPC_HANDLERS.WINDOW, {
        func: IPC_FUNCTIONS.CLOSE_EDIT_WINDOW,
      });
    },
    async handleSave() {
      if (this.item.sessionType !== "Note") {
        this.triggerSaveEvent = true;
      } else {
        this.saveData(this.item);
      }
    },
    handleName() {
      this.item.fileName = this.name + this.fileSuffix;
    },
    handleTags(newTags) {
      this.item.tags = newTags;
    },
    handleFollowUp($event) {
      this.item.followUp = $event.target.checked;
    },
    async saveData(data) {
      if (data) {
        this.item.fileName = data.fileName;
        this.item.filePath = data.filePath;
      }

      this.items = this.items.map((item) => {
        let temp = Object.assign({}, item);
        if (temp.id === this.item.id) {
          temp = this.item;
        }
        return temp;
      });

      if (window.ipc) {
        window.ipc
          .invoke(IPC_HANDLERS.DATABASE, {
            func: IPC_FUNCTIONS.UPDATE_ITEMS,
            data: this.items,
          })
          .then(() => {
            window.ipc.invoke(IPC_HANDLERS.WINDOW, {
              func: IPC_FUNCTIONS.CLOSE_EDIT_WINDOW,
            });
          });
      }
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
.file-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 15px;
}
.file-wrapper .file-icon {
  padding: 30px;
  border-radius: 50%;
  border: 1px solid #d1d5db;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
}
.file-wrapper .file-icon .v-icon {
  color: #6b7280;
  font-size: 50px;
}
.file-wrapper p {
  margin-bottom: 0;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #374151;
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
.footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}
</style>

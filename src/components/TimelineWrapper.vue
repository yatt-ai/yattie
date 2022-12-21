<template>
  <v-container class="timeline-wrapper">
    <v-row>
      <v-col cols="12">
        <div class="subtitle-2 label-text">
          {{ $tc("caption.session_started", 1) }}
        </div>
        <div class="date-text">
          <v-icon>mdi-calendar-minus-outline</v-icon>
          <span v-if="$store.state.started">{{ $store.state.started }}</span>
          <span v-else>{{ current }}</span>
        </div>
        <div class="timeline-wrap pt-3">
          <v-timeline align-top dense class="pt-0">
            <v-timeline-item
              class="timeline-item"
              color="primary"
              icon="mdi-play-circle"
              fill-dot
            >
              <div class="duration-text">
                <v-icon>mdi-clock-outline</v-icon>
                <span>{{ formatTime }}</span>
              </div>
            </v-timeline-item>
            <draggable
              v-if="itemLists.length"
              v-model="itemLists"
              draggable=".drag-item"
              :animation="200"
            >
              <div v-for="(item, i) in itemLists" :key="i" :class="`drag-item`">
                <v-timeline-item
                  v-if="item.sessionType === 'Screenshot'"
                  color="primary"
                  icon="mdi-camera-plus"
                  fill-dot
                >
                  <div class="d-flex flex-column screenshot">
                    <div class="d-flex justify-space-between py-2">
                      <div class="duration-text">
                        <v-icon>mdi-clock-outline</v-icon>
                        <span>{{ calculateTime(item.time) }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <input
                          type="checkbox"
                          class="item-select"
                          :value="item.id"
                          :checked="checkedItem(item.id)"
                          @change="handleSelected($event, item.id)"
                        />
                      </div>
                    </div>
                    <div
                      class="image-wrapper"
                      @click="handleItemClick(item.id)"
                    >
                      <img
                        class="screen-img"
                        style="max-width: 100%"
                        :src="`file://${item.filePath}`"
                      />
                    </div>
                    <div class="comment-wrapper mt-2">
                      <span class="comment-type"
                        >{{
                          item.comment.text
                            ? item.comment.type + ": " + item.comment.text
                            : ""
                        }}
                      </span>
                    </div>
                  </div>
                </v-timeline-item>
                <v-timeline-item
                  v-if="item.sessionType === 'Video'"
                  color="primary"
                  icon="mdi-video"
                  fill-dot
                >
                  <div class="d-flex flex-column">
                    <div class="d-flex justify-space-between py-2">
                      <div class="duration-text">
                        <v-icon>mdi-clock-outline</v-icon>
                        <span>{{ calculateTime(item.time) }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <input
                          type="checkbox"
                          class="item-select"
                          :value="item.id"
                          :checked="checkedItem(item.id)"
                          @change="handleSelected($event, item.id)"
                        />
                      </div>
                    </div>
                    <div
                      class="video-wrapper"
                      @click="handleItemClick(item.id)"
                    >
                      <video
                        controls
                        style="width: 100%"
                        :src="`file://${item.filePath}`"
                      ></video>
                    </div>
                    <div class="comment-wrapper mt-2">
                      <span class="comment-type"
                        >{{
                          item.comment.text
                            ? item.comment.type + ": " + item.comment.text
                            : ""
                        }}
                      </span>
                    </div>
                  </div>
                </v-timeline-item>
                <v-timeline-item
                  v-if="item.sessionType === 'Audio'"
                  color="primary"
                  icon="mdi-microphone"
                  fill-dot
                >
                  <div class="d-flex flex-column">
                    <div class="d-flex justify-space-between py-2">
                      <div class="duration-text">
                        <v-icon>mdi-clock-outline</v-icon>
                        <span>{{ calculateTime(item.time) }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <input
                          type="checkbox"
                          class="item-select"
                          :value="item.id"
                          :checked="checkedItem(item.id)"
                          @change="handleSelected($event, item.id)"
                        />
                      </div>
                    </div>
                    <div
                      class="audio-wrapper"
                      @click="handleItemClick(item.id)"
                    >
                      <div class="audio-wave">
                        <img :src="item.poster" />
                      </div>
                      <div class="audio-play">
                        <v-icon medium>mdi-play-circle</v-icon>
                      </div>
                    </div>
                    <div class="comment-wrapper mt-2">
                      <span class="comment-type"
                        >{{
                          item.comment.text
                            ? item.comment.type + ": " + item.comment.text
                            : ""
                        }}
                      </span>
                    </div>
                  </div>
                </v-timeline-item>
                <v-timeline-item
                  v-if="item.sessionType === 'Note'"
                  color="primary"
                  icon="mdi-pencil"
                  fill-dot
                >
                  <div class="d-flex flex-column">
                    <div class="d-flex justify-space-between py-2">
                      <div class="duration-text">
                        <v-icon>mdi-clock-outline</v-icon>
                        <span>{{ calculateTime(item.time) }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <input
                          type="checkbox"
                          class="item-select"
                          :value="item.id"
                          :checked="checkedItem(item.id)"
                          @change="handleSelected($event, item.id)"
                        />
                      </div>
                    </div>
                    <div class="note-wrapper" @click="handleItemClick(item.id)">
                      <span class="comment-type"
                        >{{ item.comment.type + ": " + item.comment.text }}
                      </span>
                    </div>
                    <div
                      v-if="item.comment.tags.length"
                      class="tags-wrapper my-2"
                    >
                      <v-chip
                        v-for="(tag, i) in item.comment.tags"
                        :key="i"
                        class="tag"
                        small
                        color="#fee2e2"
                        text-color="#991b1b"
                      >
                        {{ tag.text }}
                      </v-chip>
                    </div>
                  </div>
                </v-timeline-item>
                <v-timeline-item
                  v-if="item.sessionType === 'File'"
                  color="primary"
                  icon="mdi-file"
                  fill-dot
                >
                  <div class="d-flex flex-column">
                    <div class="d-flex justify-space-between py-2">
                      <div class="duration-text">
                        <v-icon>mdi-clock-outline</v-icon>
                        <span>{{ calculateTime(item.time) }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <input
                          type="checkbox"
                          class="item-select"
                          :value="item.id"
                          :checked="checkedItem(item.id)"
                          @change="handleSelected($event, item.id)"
                        />
                      </div>
                    </div>
                    <div
                      v-if="item.fileType === 'image'"
                      class="file-wrapper image"
                      @click="handleItemClick(item.id)"
                    >
                      <img
                        class="screen-img"
                        style="max-width: 100%"
                        :src="`file://${item.filePath}`"
                      />
                    </div>
                    <div
                      v-else
                      class="file-wrapper file"
                      @click="handleItemClick(item.id)"
                    >
                      <div class="file-name">
                        <span>{{ item.fileName }}</span>
                      </div>
                      <div class="file-icon">
                        <v-icon medium>mdi-file</v-icon>
                      </div>
                    </div>
                    <div class="comment-wrapper mt-2">
                      <span class="comment-type"
                        >{{
                          item.comment.text
                            ? item.comment.type + ": " + item.comment.text
                            : ""
                        }}
                      </span>
                    </div>
                  </div>
                </v-timeline-item>
                <v-timeline-item
                  v-if="item.sessionType === 'Mindmap'"
                  color="primary"
                  icon="mdi-camera-plus"
                  fill-dot
                >
                  <div class="d-flex flex-column map-wrapper">
                    <div class="d-flex justify-space-between py-2">
                      <div class="duration-text">
                        <v-icon>mdi-clock-outline</v-icon>
                        <span>{{ calculateTime(item.time) }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <input
                          type="checkbox"
                          class="item-select"
                          :value="item.id"
                          :checked="checkedItem(item.id)"
                          @change="handleSelected($event, item.id)"
                        />
                      </div>
                    </div>
                    <div
                      class="image-wrapper"
                      @click="handleItemClick(item.id)"
                    >
                      <img
                        class="screen-img"
                        style="max-width: 100%"
                        :src="`file://${item.filePath}`"
                      />
                    </div>
                    <div class="comment-wrapper mt-2">
                      <span class="comment-type"
                        >{{
                          item.comment.text
                            ? item.comment.type + ": " + item.comment.text
                            : ""
                        }}
                      </span>
                    </div>
                  </div>
                </v-timeline-item>
                <v-timeline-item
                  v-if="item.sessionType === 'Summary' && item.comment.text"
                  color="primary"
                  icon="mdi-pencil"
                  fill-dot
                >
                  <div class="d-flex flex-column">
                    <div class="d-flex justify-space-between py-2">
                      <div class="duration-text">
                        <v-icon>mdi-clock-outline</v-icon>
                        <span>{{ calculateTime(item.time) }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <input
                          type="checkbox"
                          class="item-select"
                          :value="item.id"
                          :checked="checkedItem(item.id)"
                          @change="handleSelected($event, item.id)"
                        />
                      </div>
                    </div>
                    <div class="note-wrapper" @click="handleItemClick(item.id)">
                      <span class="comment-type"
                        >{{ item.comment.type + ": " + item.comment.text }}
                      </span>
                    </div>
                  </div>
                </v-timeline-item>
              </div>
            </draggable>
            <v-timeline-item
              class="timeline-item pb-0"
              color="primary"
              icon="mdi-stop-circle"
              fill-dot
            >
              <div class="duration-text">
                <v-icon>mdi-clock-outline</v-icon>
                <span>{{ formatTime }}</span>
              </div>
            </v-timeline-item>
          </v-timeline>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="status !== 'pending' && status !== 'pause'">
      <v-col cols="12" class="text-center">
        <v-btn
          plain
          color="primary"
          class="text-capitalize"
          @click="uploadEvidence"
        >
          {{ $tc("caption.upload_evidence", 1) }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  VContainer,
  VRow,
  VCol,
  VIcon,
  VTimeline,
  VTimelineItem,
  VBtn,
} from "vuetify/lib/components";
import Draggable from "vuedraggable";
import dayjs from "dayjs";

import { IPC_HANDLERS, IPC_FUNCTIONS, STATUSES } from "../modules/constants";

export default {
  name: "TimelineWrapper",
  components: {
    VContainer,
    VRow,
    VCol,
    VIcon,
    VTimeline,
    VTimelineItem,
    VBtn,
    Draggable,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    selectedItems: {
      type: Array,
      default: () => [],
    },
    eventType: {
      type: String,
      default: () => "",
    },
  },
  watch: {
    items: function (newValue) {
      this.itemLists = newValue;
    },
    selectedItems: function (newValue) {
      this.selected = newValue;
    },
    eventType: function (newValue) {
      this.eventName = newValue;
    },
  },
  data() {
    return {
      itemLists: this.items,
      selected: [],
      activeSession: {},
      tags: "",
      eventName: this.eventType,
      clicks: 0,
    };
  },
  computed: {
    status() {
      return this.$store.state.status;
    },
    formatTime() {
      const timer = this.$store.state.timer;
      const seconds = ("0" + (timer % 60)).slice(-2);
      const minutes = ("0" + (parseInt(timer / 60, 10) % 60)).slice(-2);
      const hours = ("0" + (parseInt(timer / 3600, 10) % 24)).slice(-2);

      return hours + ":" + minutes + ":" + seconds;
    },
    current() {
      return dayjs().format("MM-DD-YYYY");
    },
  },
  methods: {
    async uploadEvidence() {
      if (!window.ipc) return;

      const { status, error, result } = await window.ipc.invoke(
        IPC_HANDLERS.CAPTURE,
        {
          func: IPC_FUNCTIONS.UPLOAD_EVIDENCE,
        }
      );

      if (status === STATUSES.ERROR) {
        console.log(error);
      } else {
        const data = {
          sessionType: "File",
          fileType: result.fileType,
          fileName: result.fileName,
          filePath: result.filePath,
          time: this.$store.state.timer,
        };
        this.openEditorModal(data);
      }
    },
    async openEditorModal(data) {
      if (!window.ipc) return;

      await window.ipc.invoke(IPC_HANDLERS.WINDOW, {
        func: IPC_FUNCTIONS.OPEN_ADD_WINDOW,
        data: { width: 700, height: 800, data: data },
      });
    },
    calculateTime(time) {
      const seconds = ("0" + (time % 60)).slice(-2);
      const minutes = ("0" + (parseInt(time / 60, 10) % 60)).slice(-2);
      const hours = ("0" + (parseInt(time / 3600, 10) % 24)).slice(-2);

      return hours + ":" + minutes + ":" + seconds;
    },
    checkedItem(id) {
      if (this.selected.includes(id)) {
        return true;
      }
      return false;
    },
    handleSelected($event, id) {
      if ($event.target.checked && !this.selected.includes(id)) {
        this.selected.push(id);
      } else {
        this.selected = this.selected.filter((n) => n != id);
      }
      this.$root.$emit("update-selected", this.selected);
    },
    handleItemClick(id) {
      this.clicks++;
      if (this.clicks === 1) {
        setTimeout(
          function () {
            switch (this.clicks) {
              case 1:
                if (this.eventName === "click") {
                  this.handleActiveSession(id);
                }
                break;
              default:
                if (this.eventName === "dblclick") {
                  this.handleActiveSession(id);
                }
            }
            this.clicks = 0;
          }.bind(this),
          200
        );
      }
    },
    handleActiveSession(id) {
      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.GET_ITEM_BY_ID,
          data: id,
        })
        .then((data) => {
          this.activeSession = data;
          this.$emit("submit-session", this.activeSession);
        });
    },
  },
};
</script>
<style scoped>
.timeline-item {
  height: auto;
  display: flex;
  align-items: center;
}
.image-wrapper {
  position: relative;
  display: flex;
  background: #fff;
  border: 1px solid #d1d3db;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}
.video-wrapper {
  position: relative;
  display: flex;
  background: #fff;
  border: 1px solid #d1d5db;
  overflow: hidden;
  cursor: pointer;
}
.v-icon.video-play {
  border: 1px solid #c7c7c8;
  border-radius: 50%;
  height: 56px;
  width: 56px;
  background-color: #c7c7c8;
  color: #17191a;
  opacity: 0.8;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.audio-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  cursor: pointer;
}
.comment-wrapper {
  display: flex;
  background: #fff;
}
.comment-wrapper p {
  margin-bottom: 0 !important;
}
.note-wrapper {
  display: flex;
  padding: 8px 14px;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
}
.note-wrapper p {
  margin-bottom: 0 !important;
}
.audio-wrapper .audio-wave {
  flex-grow: 1;
}
.audio-wrapper .audio-wave img {
  width: 100%;
}
.file-wrapper.image {
  position: relative;
  display: flex;
  background: #fff;
  border: 1px solid #d1d5db;
  overflow: hidden;
  cursor: pointer;
}
.file-wrapper.file {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  cursor: pointer;
}
.file-wrapper.file .file-name {
  font-size: 14px;
  font-weight: 500;
  font-style: normal;
  line-height: 16px;
  color: #6b7280;
  cursor: pointer;
}
.tags-wrapper .tag {
  margin-right: 5px;
}
.tags-wrapper .tag:last-child {
  margin-right: 0;
}
</style>

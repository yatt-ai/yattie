<template>
  <v-container>
    <v-row class="text-center" v-if="status === 'pending'">
      <v-col cols="12" class="">
        <v-btn
          id="btn_new_session"
          class="text-capitalize font-weight-regular"
          fill
          small
          block
          color="primary"
          :height="30"
          @click="showSourcePickerDialog"
        >
          Start New Session
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mb-1" v-if="selected.length > 0">
      <v-col cols="6" class="pa-1">
        <v-btn
          id="btn_delete"
          fill
          small
          block
          color="primary"
          @click="deleteConfirmDialog = true"
        >
          <v-icon left>mdi-delete</v-icon> Delete
        </v-btn>
      </v-col>
      <v-col cols="6" class="pa-1">
        <v-btn
          id="btn_download"
          fill
          small
          block
          color="white"
          @click="exportItems"
        >
          <v-icon left>mdi-download</v-icon> Export
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="text-center control-btn-wrapper" v-if="status === 'end'">
      <v-col cols="12" class="d-flex justify-center px-0">
        <v-tooltip top v-if="status !== 'pause'">
          <template v-slot:activator="{ on }">
            <v-btn
              id="btn_resume"
              class="control-btn mx-1"
              fab
              outlined
              small
              color="default"
              v-on="on"
              @click="resume"
            >
              <v-icon> mdi-play-circle </v-icon>
            </v-btn>
          </template>
          <span>Resume Session</span>
        </v-tooltip>

        <v-tooltip top v-if="status !== 'pause'">
          <template v-slot:activator="{ on }">
            <v-btn
              id="btn_plus"
              class="control-btn mx-1"
              fab
              outlined
              small
              color="default"
              v-on="on"
              @click="newSessionDialog = true"
            >
              <v-icon> mdi-content-save </v-icon>
            </v-btn>
          </template>
          <span>Save Session</span>
        </v-tooltip>
        <v-tooltip top v-if="status !== 'pause'">
          <template v-slot:activator="{ on }">
            <v-btn
              id="btn_reset"
              class="control-btn mx-1"
              fab
              outlined
              small
              color="default"
              v-on="on"
              @click="resetConfirmDialog = true"
            >
              <v-icon> mdi-close-circle </v-icon>
            </v-btn>
          </template>
          <span>Clear Session</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row
      class="text-center control-btn-wrapper"
      v-if="status !== 'pending' && status !== 'end'"
    >
      <v-col cols="12" class="d-flex justify-center px-0">
        <v-tooltip top v-if="status !== 'pause'">
          <template v-slot:activator="{ on }">
            <v-btn
              id="btn_pause_session"
              class="control-btn mx-1"
              fab
              outlined
              small
              color="default"
              v-on="on"
              @click="pauseSession()"
            >
              <img
                :src="require('../assets/icon/pause.svg')"
                width="24"
                height="24"
              />
            </v-btn>
          </template>
          <span>Pause Session</span>
        </v-tooltip>
        <v-tooltip top v-if="status === 'pause'">
          <template v-slot:activator="{ on }">
            <v-btn
              id="btn_resume_session"
              class="control-btn mx-1"
              fab
              outlined
              small
              color="default"
              v-on="on"
              @click="resumeSession()"
            >
              <img
                :src="require('../assets/icon/play.svg')"
                width="24"
                height="24"
              />
            </v-btn>
          </template>
          <span>Resume Session</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              id="btn_end_session"
              class="control-btn mx-1"
              fab
              outlined
              small
              color="default"
              v-on="on"
              @click="endSession()"
            >
              <img
                :src="require('../assets/icon/stop.svg')"
                width="24"
                height="24"
              />
            </v-btn>
          </template>
          <span>End Session</span>
        </v-tooltip>
        <v-tooltip top v-if="!recordVideoStarted">
          <template v-slot:activator="{ on }">
            <v-btn
              id="btn_start_record_video"
              class="control-btn mx-1"
              fab
              outlined
              small
              color="default"
              v-on="on"
              :disabled="status === 'pause'"
              @click="startRecordVideo()"
            >
              <img
                :src="require('../assets/icon/video.svg')"
                width="24"
                height="24"
              />
            </v-btn>
          </template>
          <span>Start Video Record</span>
        </v-tooltip>
        <v-tooltip top v-if="recordVideoStarted">
          <template v-slot:activator="{ on }">
            <v-btn
              id="btn_stop_record_video"
              class="control-btn mx-1"
              fab
              outlined
              small
              color="default"
              v-on="on"
              :disabled="status === 'pause'"
              @click="stopRecordVideo()"
            >
              <v-icon> mdi-video-off </v-icon>
            </v-btn>
          </template>
          <span>Stop Video Record</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              id="btn_screenshot"
              class="control-btn mx-1"
              fab
              outlined
              small
              color="default"
              :disabled="status === 'pause'"
              v-on="on"
              @click="screenshot()"
            >
              <img
                :src="require('../assets/icon/camera.svg')"
                width="24"
                height="24"
              />
            </v-btn>
          </template>
          <span>Screenshot</span>
        </v-tooltip>
        <v-tooltip top v-if="!recordAudioStarted">
          <template v-slot:activator="{ on }">
            <v-btn
              id="btn_start_record_audio"
              class="control-btn mx-1"
              fab
              outlined
              small
              color="default"
              v-on="on"
              :disabled="status === 'pause'"
              @click="startRecordAudio()"
            >
              <img
                :src="require('../assets/icon/microphone.svg')"
                width="24"
                height="24"
              />
            </v-btn>
          </template>
          <span>Start Audio Record</span>
        </v-tooltip>
        <v-tooltip top v-if="recordAudioStarted">
          <template v-slot:activator="{ on }">
            <v-btn
              id="btn_stop_record_audio"
              class="control-btn mx-1"
              fab
              outlined
              small
              color="default"
              v-on="on"
              :disabled="status === 'pause'"
              @click="stopRecordAudio()"
            >
              <v-icon> mdi-microphone-off </v-icon>
            </v-btn>
          </template>
          <span>Stop Audio Record</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              id="btn_note"
              class="control-btn mx-1"
              fab
              outlined
              small
              color="default"
              :disabled="status === 'pause'"
              v-on="on"
              @click="showNoteDialog"
            >
              <img
                :src="require('../assets/icon/pencil.svg')"
                width="24"
                height="24"
              />
            </v-btn>
          </template>
          <span>Note</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              class="control-btn mx-1"
              fab
              outlined
              small
              color="default"
              :disabled="status === 'pause'"
              v-on="on"
              @click="mindMap"
            >
              <img
                :src="require('../assets/icon/connect.svg')"
                width="24"
                height="24"
              />
            </v-btn>
          </template>
          <span>Mind Map</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <SourcePickerDialog
      v-model="sourcePickerDialog"
      :sources="sources"
      :sourceId="sourceId"
      :loaded="loaded"
      @submit-source="startSession"
    />
    <NoteDialog v-model="noteDialog" @submit-note="addNote" />
    <DeleteConfirmDialog
      v-model="deleteConfirmDialog"
      title="Confirm delete"
      :text="`Are you sure you want to delete?`"
      @confirm="deleteItems"
      @cancel="deleteConfirmDialog = false"
    />
    <ResetConfirmDialog
      v-model="resetConfirmDialog"
      title="Confirm Reset"
      :text="`Are you sure you want to reset?`"
      @confirm="reset"
      @cancel="resetConfirmDialog = false"
    />
    <NewSessionDialog
      v-model="newSessionDialog"
      title="Save Current Progress"
      :text="`Do you want save current progress?`"
      @save="saveSession"
      @discard="discardSession"
      @cancel="newSessionDialog = false"
    />
    <DurationConfirmDialog
      v-model="durationConfirmDialog"
      title="Session Time"
      :text="`Do you want to proceed with testing or end the test session?`"
      @end="end"
      @proceed="proceed"
    />
    <AudioErrorDialog
      v-model="audioErrorDialog"
      title="Error Recording Audio"
      :text="`An error occurred while recording the audio.`"
      @cancel="audioErrorDialog = false"
    />
    <EndSessionDialog
      v-model="endSessionDialog"
      @proceed="
        () => {
          endSessionDialog = false;
          endSessionProcess();
        }
      "
      :post-session-data="postSessionData"
    />
  </v-container>
</template>

<script>
import { VContainer, VRow, VCol, VBtn, VIcon } from "vuetify/lib/components";
import dayjs from "dayjs";
import SourcePickerDialog from "./dialogs/SourcePickerDialog.vue";
import NoteDialog from "./dialogs/NoteDialog.vue";
import DeleteConfirmDialog from "./dialogs/DeleteConfirmDialog.vue";
import ResetConfirmDialog from "./dialogs/ResetConfirmDialog.vue";
import NewSessionDialog from "./dialogs/NewSessionDialog.vue";
import DurationConfirmDialog from "./dialogs/DurationConfirmDialog.vue";
import AudioErrorDialog from "./dialogs/AudioErrorDialog.vue";
import EndSessionDialog from "./dialogs/EndSessionDialog.vue";

import {
  IPC_HANDLERS,
  IPC_FUNCTIONS,
  SESSION_STATUSES,
  MAP_NODES,
  MAP_CONNECTIONS,
} from "../modules/constants";

let mediaRecorder;

export default {
  name: "ControlPanel",
  components: {
    VContainer,
    VRow,
    VCol,
    VBtn,
    VIcon,
    SourcePickerDialog,
    NoteDialog,
    DeleteConfirmDialog,
    ResetConfirmDialog,
    NewSessionDialog,
    DurationConfirmDialog,
    AudioErrorDialog,
    EndSessionDialog,
  },
  props: {
    selectedItems: {
      type: Array,
      default: () => [],
    },
    checkedStatusOfPreSessionTask: {
      type: Boolean,
      default: () => false,
    },
    postSessionData: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    selectedItems: function (newValue) {
      this.selected = newValue;
    },
  },
  data() {
    return {
      sourcePickerDialog: false,
      noteDialog: false,

      deleteConfirmDialog: false,
      resetConfirmDialog: false,
      newSessionDialog: false,
      durationConfirmDialog: false,
      audioErrorDialog: false,
      endSessionDialog: false,

      sources: [],
      sourceId: "",
      audioDevices: [],
      loaded: false,
      status: this.$store.state.status,
      recordVideoStarted: false,
      recordAudioStarted: false,

      interval: null,
      timer: 0,
      duration: 0,
      isDuration: false,
      started: "",
      ended: "",

      selected: [],
    };
  },
  mounted() {
    this.$root.$on("close-sourcepickerdialog", this.hideSourcePickerDialog);
    this.$root.$on("close-notedialog", this.hideNoteDialog);
  },
  beforeDestroy() {
    this.$root.$off("close-sourcepickerdialog", this.hideSourcePickerDialog);
    this.$root.$on("close-notedialog", this.hideNoteDialog);

    // clear timer
    clearInterval(this.interval);
    this.timer = 0;
  },
  methods: {
    showSourcePickerDialog() {
      if (!this.checkedStatusOfPreSessionTask) {
        this.$emit("handle-pressesion-task-error", true);
        return;
      }

      this.$emit("handle-pressesion-task-error", false);
      this.sourcePickerDialog = true;
      this.getSourceList();
    },
    hideSourcePickerDialog() {
      this.sourcePickerDialog = false;
    },
    showNoteDialog() {
      this.noteDialog = true;
    },
    hideNoteDialog() {
      this.noteDialog = false;
    },
    startInterval() {
      this.interval = setInterval(() => {
        this.timer += 1;
        if (this.duration > 0) {
          this.duration -= 1;
        }

        this.updateStoreSession();
        if (this.isDuration && this.duration === 0) {
          this.durationConfirmDialog = true;
          this.isDuration = false;
          this.stopInterval();
        }
      }, 1000);
    },
    stopInterval() {
      clearInterval(this.interval);
      this.updateStoreSession();
    },
    updateStoreSession() {
      console.log(`
        status: ${this.status}, timer: ${this.timer}, duration: ${this.duration}
        `);
      this.$store.commit("updateSession", {
        status: this.status,
        timer: this.timer,
        duration: this.duration,
      });
    },
    startSession(id) {
      this.sourceId = id;
      this.sourcePickerDialog = false;
      this.status = SESSION_STATUSES.START;
      this.timer = this.$store.state.timer;
      this.duration = this.$store.state.duration;
      if (this.duration > 0) {
        this.isDuration = true;
      }
      this.started = this.getCurrentDateTime();
      this.$store.commit("setStarted", this.started);

      this.startInterval();

      const currentPath = this.$router.history.current.path;
      if (currentPath !== "/main/timeline") {
        this.$router.push({ path: "/main/timeline" });
      }
    },
    pauseSession() {
      this.status = SESSION_STATUSES.PAUSE;
      this.stopInterval();
    },
    resumeSession() {
      this.status = SESSION_STATUSES.RESUME;
      this.timer = this.$store.state.timer;
      this.startInterval();
    },
    endSession() {
      if (this.postSessionData.status) {
        // this.postsession = this.postSessionData;
        this.endSessionDialog = true;
        return;
      }

      this.endSessionProcess();
    },
    endSessionProcess() {
      this.sourceId = "";

      this.ended = this.getCurrentDateTime();
      this.$store.commit("setEnded", this.ended);

      this.status = SESSION_STATUSES.END;
      this.stopInterval();

      if (window.ipc) {
        window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
          func: IPC_FUNCTIONS.SET_WINDOW_SIZE,
          data: {
            width: 1440,
            height: 900,
            minWidth: 1440,
            minHeight: 900,
          },
        });
      }

      this.$router.push({ path: "/result" });
    },
    resume() {
      this.status = SESSION_STATUSES.PAUSE;
      this.timer = this.$store.state.timer;
      this.updateStoreSession();
      this.$router.push({ path: "/main/timeline" });
    },

    reset() {
      this.resetConfirmDialog = false;
      this.status = SESSION_STATUSES.PENDING;
      this.$store.commit("resetState");

      try {
        // reset database
        window.ipc.invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.INITIALIZE_SESSION,
        });
      } catch (e) {
        console.log(e);
      }

      this.stopInterval();
      this.$router.push({ path: "/main" });
    },

    end() {
      this.durationConfirmDialog = false;
      this.endSession();
    },
    proceed() {
      this.durationConfirmDialog = false;
      this.status = SESSION_STATUSES.PROCEED;
      this.startInterval();
    },

    updateStatus(value) {
      this.status = value;
      this.$store.commit("setStatus", this.status);
    },
    async getSourceList() {
      try {
        await window.ipc
          .invoke(IPC_HANDLERS.CAPTURE, {
            func: IPC_FUNCTIONS.GET_MEDIA_SOURCE,
          })
          .then((data) => {
            this.loaded = true;
            this.sources = data;
          });
      } catch (e) {
        console.log(e);
      }
    },
    async screenshot() {
      this.handleStream = (stream) => {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.onloadedmetadata = async () => {
          const _this = video;
          video.play();
          const canvas = document.createElement("canvas");
          canvas.width = _this.videoWidth;
          canvas.height = _this.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          video.remove();
          const imgURI = canvas.toDataURL("image/png");
          if (window.ipc) {
            await window.ipc
              .invoke(IPC_HANDLERS.CAPTURE, {
                func: IPC_FUNCTIONS.CREATE_IMAGE,
                data: { url: imgURI },
              })
              .then(({ fileName, filePath }) => {
                const data = {
                  sessionType: "screenshot",
                  fileType: "image",
                  fileName: fileName,
                  filePath: filePath,
                  time: this.timer,
                };
                this.openAddWindow(data);
              });
          }
        };
      };

      this.handleError = (error) => {
        console.log(error);
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: this.sourceId,
              minWidth: 1280,
              maxWidth: 10000,
              minHeight: 720,
              maxHeight: 4000,
            },
          },
        });
        this.handleStream(stream);
      } catch (e) {
        this.handleError(e);
      }
    },
    async startRecordVideo() {
      this.handleStream = (stream) => {
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=h264",
        });

        let poster;
        let frames = [];

        mediaRecorder.onstart = () => {
          this.recordVideoStarted = true;
          const video = document.createElement("video");
          video.srcObject = stream;
          video.onloadedmetadata = async () => {
            video.play();
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            video.remove();
            const imgURI = canvas.toDataURL("image/png");
            await window.ipc
              .invoke(IPC_HANDLERS.CAPTURE, {
                func: IPC_FUNCTIONS.CREATE_IMAGE,
                data: { url: imgURI },
              })
              .then(({ filePath }) => {
                poster = filePath;
              });
          };
        };

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            frames.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          this.recordVideoStarted = false;
          const blob = new Blob(frames, { type: "video/webm;codecs=h264" });
          const buffer = await blob.arrayBuffer();
          if (window.ipc) {
            await window.ipc
              .invoke(IPC_HANDLERS.CAPTURE, {
                func: IPC_FUNCTIONS.CREATE_VIDEO,
                data: { buffer: buffer },
              })
              .then(({ fileName, filePath }) => {
                const data = {
                  sessionType: "video",
                  fileType: "video",
                  fileName: fileName,
                  filePath: filePath,
                  poster: poster,
                  time: this.timer,
                };
                this.openAddWindow(data);
              });
          }
        };

        frames = [];

        mediaRecorder.start(1000);
      };

      this.handleError = (error) => {
        console.log(error);
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: this.sourceId,
              minWidth: 640,
              maxWidth: 1920,
              minHeight: 480,
              maxHeight: 1080,
            },
          },
        });

        stream.getVideoTracks()[0].applyConstraints({ frameRate: 30 });
        this.handleStream(stream);
      } catch (e) {
        console.log(e);
      }
    },
    stopRecordVideo() {
      try {
        mediaRecorder.stop();
      } catch (error) {
        console.log(error);
      }
    },
    async startRecordAudio() {
      this.setAudioSource = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId: this.audioDevices[0].deviceId,
              autoGainControl: false,
              latency: 0.0,
            },
          });

          this.handleStream(stream);
        } catch (e) {
          this.handleError(e);
        }
      };

      this.handleStream = (stream) => {
        let recordedChunks = [];

        const option = {
          mimeType: "audio/webm",
        };

        mediaRecorder = new MediaRecorder(stream, option);

        mediaRecorder.onstart = () => {
          this.recordAudioStarted = true;
        };

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          this.recordAudioStarted = false;
          const blob = new Blob(recordedChunks, {
            type: "audio/mpeg-3",
          });
          const buffer = await blob.arrayBuffer();
          const fileName = dayjs().format("YYYY-MM-DD_HH-mm-ss-ms") + ".mp3";
          if (window.ipc) {
            await window.ipc
              .invoke(IPC_HANDLERS.CAPTURE, {
                func: IPC_FUNCTIONS.CREATE_TEMP_USER_MEDIA,
                data: { buffer: buffer, fileName: fileName },
              })
              .then((filePath) => {
                const data = {
                  sessionType: "audio",
                  fileType: "audio",
                  fileName: fileName,
                  filePath: filePath,
                  time: this.timer,
                };

                this.openAddWindow(data);
              });
          }
          recordedChunks = [];
        };

        mediaRecorder.start(1000);
      };

      this.handleError = (error) => {
        console.log("Error:", error);
      };

      await navigator.mediaDevices.enumerateDevices().then((devices) => {
        this.audioDevices = devices.filter(
          (d) =>
            d.kind === "audioinput" &&
            d.deviceId != "communications" &&
            d.deviceId != "default"
        );
        console.log("audio devices:", this.audioDevices);
        if (!this.audioDevices.length) {
          this.audioErrorDialog = true;
          return;
        }

        this.setAudioSource();
      });
    },
    stopRecordAudio() {
      try {
        mediaRecorder.stop();
      } catch (error) {
        console.log(error);
      }
    },
    async openAddWindow(data) {
      await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
        func: IPC_FUNCTIONS.OPEN_ADD_WINDOW,
        data: { width: 700, height: 800, data: data },
      });
    },
    async addNote(comment) {
      const date = dayjs().format("MM/DD/YYYY HH:mm:ss");
      const fileName = dayjs().format("YYYY-MM-DD_HH-mm-ss-ms") + ".txt";

      if (window.ipc) {
        // Save Note
        await window.ipc
          .invoke(IPC_HANDLERS.CAPTURE, {
            func: IPC_FUNCTIONS.SAVE_NOTE,
            data: { fileName: fileName, comment: comment },
          })
          .then((filePath) => {
            let newItem = {
              id: Date.now(),
              sessionType: "note",
              fileType: "text",
              fileName: fileName,
              filePath: filePath,
              comment: comment,
              time: this.timer,
              createdAt: date,
            };
            this.$emit("add-item", newItem);
          });
      }

      this.noteDialog = false;
    },
    mindMap() {
      const data = {
        sessionType: "mindmap",
        fileType: "mindmap",
        fileName: "",
        filePath: "",
        content: {
          nodes: MAP_NODES,
          connections: MAP_CONNECTIONS,
        },
        time: this.timer,
      };
      this.openAddWindow(data);
    },
    async deleteItems() {
      if (window.ipc) {
        await window.ipc.invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.DELETE_ITEMS,
          data: this.selected,
        });
      }

      this.selected = [];
      this.$root.$emit("update-selected", this.selected);
      this.deleteConfirmDialog = false;
    },
    async exportItems() {
      if (window.ipc) {
        await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
          func: IPC_FUNCTIONS.EXPORT_ITEMS,
          data: this.selected,
        });
      }

      this.selected = [];
      this.$root.$emit("update-selected", this.selected);
    },
    async saveSession() {
      this.newSessionDialog = false;
      const data = {
        title: this.$store.state.title,
        charter: this.$store.state.charter,
        precondition: this.$store.state.precondition,
        duration: this.$store.state.duration,
        status: this.$store.state.status,
        timer: this.$store.state.timer,
        started: this.$store.state.started,
        ended: this.$store.state.ended,
        path: this.$route.path,
      };
      await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
        func: IPC_FUNCTIONS.SAVE_SESSION,
        data: data,
      });
    },
    discardSession() {
      this.$store.commit("resetState");
      clearInterval(this.interval);
      this.$router.push({ path: "/" });
    },
    getCurrentDateTime() {
      const now = new Date();
      const currentDateTime =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0") +
        " | " +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0") +
        "-" +
        now.getFullYear();

      return currentDateTime;
    },
  },
};
</script>

<style scoped>
.control-btn-wrapper {
  background: #f3f4f6;
}
.v-btn--disabled img {
  opacity: 0.5;
}
</style>

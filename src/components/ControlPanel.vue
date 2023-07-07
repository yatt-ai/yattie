<template>
  <v-container>
    <div class="mini-ctrl-wrapper" v-if="viewMode === 'mini'">
      <MinimizeControlWrapper
        :p-elapsed-time="elapsedTime"
        :p-status="status"
        @pause-session="pauseSession()"
        @resume-session="resumeSession()"
        @end-session="endSession()"
        @start-record-video="startRecordVideo()"
        @stop-record-video="stopRecordVideo()"
        @screenshot="screenshot()"
        @start-record-audio="startRecordAudio()"
        @stop-record-audio="stopRecordAudio()"
        @show-note-dialog="showNoteDialog()"
        @show-mindmap-dialog="mindMap()"
        @show-source-picker="showSourcePickerDialog()"
      />
    </div>
    <div className="nml-ctrl-wrapper" v-if="viewMode === 'normal'">
      <v-row class="text-center" v-if="status === 'pending'">
        <v-col cols="12" class="">
          <v-btn
            v-if="$store.state.quickTest"
            id="btn_new_quick_test"
            class="text-capitalize font-weight-regular"
            fill
            small
            block
            :color="currentTheme.primary"
            :style="{ color: currentTheme.white }"
            :height="30"
            @click="showSourcePickerDialog()"
          >
            {{ $tc("caption.start_quick_test", 1) }}
          </v-btn>
          <v-btn
            v-else
            id="btn_new_session"
            class="text-capitalize font-weight-regular"
            fill
            small
            block
            :color="currentTheme.primary"
            :style="{ color: currentTheme.white }"
            :height="30"
            @click="startNewSession()"
          >
            {{ $tc("caption.start_session", 1) }}
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
            :color="currentTheme.primary"
            :style="{ color: currentTheme.white }"
            @click="deleteConfirmDialog = true"
          >
            <v-icon left>mdi-delete</v-icon> {{ $tc("caption.delete", 1) }}
          </v-btn>
        </v-col>
        <v-col cols="6" class="pa-1">
          <v-menu
            top
            :offset-y="true"
            :close-on-content-click="false"
            v-model="evidenceExportDestinationMenu"
          >
            <template v-slot:activator="{ on: evidenceExportDestinationMenu }">
              <v-tooltip top>
                <template v-slot:activator="{ on: onTooltip }">
                  <v-btn
                    id="btn_download"
                    fill
                    small
                    block
                    color="white"
                    :style="{ color: currentTheme.black }"
                    v-on="{ ...evidenceExportDestinationMenu, ...onTooltip }"
                  >
                    <v-icon left>mdi-download</v-icon>
                    {{ $tc("caption.export", 1) }}
                  </v-btn>
                </template>
                <span>{{ $tc("caption.export", 1) }}</span>
              </v-tooltip>
            </template>
            <v-card tile>
              <v-list dense>
                <v-list-item @click="exportItems">
                  <v-list-item-icon class="mr-4">
                    <v-icon>mdi-download</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $tc("caption.save_as", 1) }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <div
                  v-if="
                    this.credentials.jira && this.credentials.jira.length > 0
                  "
                >
                  <jira-export-session
                    :title="$tc(`caption.export_to_jira`, 1)"
                    :credential-items="credentials.jira"
                    :items="items"
                    :selected="selected"
                    @close-menu="() => (evidenceExportDestinationMenu = false)"
                  />
                </div>
                <div
                  v-if="
                    this.credentials.testrail &&
                    this.credentials.testrail.length > 0
                  "
                >
                  <test-rail-export-session
                    :title="$tc(`caption.export_to_testrail`, 1)"
                    :credential-items="credentials.testrail"
                    :items="items"
                    :selected="selected"
                  />
                </div>
              </v-list>
            </v-card>
          </v-menu>
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
                <v-icon v-if="$vuetify.theme.dark === false">
                  mdi-play-circle
                </v-icon>
                <v-icon color="#D1D5DB" v-else>mdi-play-circle</v-icon>
              </v-btn>
            </template>
            <span>{{ $tc("caption.resume_session", 1) }}</span>
          </v-tooltip>

          <v-tooltip top v-if="status !== 'pause'">
            <template v-slot:activator="{ on }">
              <v-btn
                id="btn_save"
                class="control-btn mx-1"
                fab
                outlined
                small
                color="default"
                v-on="on"
                @click="newSessionDialog = true"
              >
                <v-icon v-if="$vuetify.theme.dark === false">
                  mdi-content-save
                </v-icon>
                <v-icon color="#D1D5DB" v-else>mdi-content-save</v-icon>
              </v-btn>
            </template>
            <span>{{ $tc("caption.save_session") }}</span>
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
                <v-icon v-if="$vuetify.theme.dark === false">
                  mdi-close-circle
                </v-icon>
                <v-icon color="#D1D5DB" v-else>mdi-close-circle</v-icon>
              </v-btn>
            </template>
            <span>{{ $tc("caption.clear_session", 1) }}</span>
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
                  v-if="$vuetify.theme.dark === false"
                  :src="require('../assets/icon/pause.svg')"
                  width="24"
                  height="24"
                />
                <img
                  v-else
                  :src="require('../assets/icon/pause-gray.svg')"
                  width="24"
                  height="24"
                />
              </v-btn>
            </template>
            <span>{{ $tc("caption.pause_session", 1) }}</span>
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
                  v-if="$vuetify.theme.dark === false"
                  :src="require('../assets/icon/play.svg')"
                  width="24"
                  height="24"
                />
                <img
                  v-else
                  :src="require('../assets/icon/play-gray.svg')"
                  width="24"
                  height="24"
                />
              </v-btn>
            </template>
            <span>{{ $tc("caption.resume_session", 1) }}</span>
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
                  v-if="$vuetify.theme.dark === false"
                  :src="require('../assets/icon/stop.svg')"
                  width="24"
                  height="24"
                />
                <img
                  v-else
                  :src="require('../assets/icon/stop-gray.svg')"
                  width="24"
                  height="24"
                />
              </v-btn>
            </template>
            <span>{{ $tc("caption.end_session", 1) }}</span>
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
                  v-if="$vuetify.theme.dark === false"
                  :src="require('../assets/icon/video-solid.svg')"
                  width="24"
                  height="24"
                />
                <img
                  v-else
                  :src="require('../assets/icon/video-solid-gray.svg')"
                  width="24"
                  height="24"
                />
              </v-btn>
            </template>
            <span>{{ $tc("caption.start_video_record", 1) }}</span>
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
                <img
                  v-if="$vuetify.theme.dark === false"
                  :src="require('../assets/icon/video-slash-solid.svg')"
                  width="24"
                  height="24"
                />
                <img
                  v-else
                  :src="require('../assets/icon/video-slash-solid-gray.svg')"
                  width="24"
                  height="24"
                />
              </v-btn>
            </template>
            <span>{{ $tc("caption.stop_video_record", 1) }}</span>
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
                  v-if="$vuetify.theme.dark === false"
                  :src="require('../assets/icon/camera.svg')"
                  width="24"
                  height="24"
                />
                <img
                  v-else
                  :src="require('../assets/icon/camera-gray.svg')"
                  width="24"
                  height="24"
                />
              </v-btn>
            </template>
            <span>{{ $tc("caption.screenshot", 1) }}</span>
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
                  v-if="$vuetify.theme.dark === false"
                  :src="require('../assets/icon/microphone-solid.svg')"
                  width="28"
                  height="28"
                />
                <img
                  v-else
                  :src="require('../assets/icon/microphone-solid-gray.svg')"
                  width="28"
                  height="28"
                />
              </v-btn>
            </template>
            <span>{{ $tc("caption.start_audio_record", 1) }}</span>
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
                <img
                  v-if="$vuetify.theme.dark === false"
                  :src="require('../assets/icon/microphone-slash-solid.svg')"
                  width="28"
                  height="28"
                />
                <img
                  v-else
                  :src="
                    require('../assets/icon/microphone-slash-solid-gray.svg')
                  "
                  width="28"
                  height="28"
                />
              </v-btn>
            </template>
            <span>{{ $tc("caption.stop_audio_record", 1) }}</span>
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
                  v-if="$vuetify.theme.dark === false"
                  :src="require('../assets/icon/pencil.svg')"
                  width="24"
                  height="24"
                />
                <img
                  v-else
                  :src="require('../assets/icon/pencil-gray.svg')"
                  width="24"
                  height="24"
                />
              </v-btn>
            </template>
            <span>{{ $tc("caption.note", 1) }}</span>
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
                  v-if="$vuetify.theme.dark === false"
                  :src="require('../assets/icon/connect.svg')"
                  width="24"
                  height="24"
                />
                <img
                  v-else
                  :src="require('../assets/icon/connect-gray.svg')"
                  width="24"
                  height="24"
                />
              </v-btn>
            </template>
            <span>{{ $tc("caption.mind_map", 1) }}</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                class="control-btn mx-1"
                fab
                outlined
                small
                color="default"
                v-on="on"
                @click="minimize"
              >
                <img
                  v-if="$vuetify.theme.dark === false"
                  :src="require('../assets/icon/union.svg')"
                  width="24"
                  height="24"
                />
                <img
                  v-else
                  :src="require('../assets/icon/union-gray.svg')"
                  width="24"
                  height="24"
                />
              </v-btn>
            </template>
            <span>{{ $tc("caption.minimize", 1) }}</span>
          </v-tooltip>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                id="btn_change_source"
                class="control-btn mx-1"
                fab
                outlined
                small
                color="default"
                v-on="on"
                v-bind="attrs"
              >
                <v-icon v-if="$vuetify.theme.dark === false">
                  mdi-dots-vertical
                </v-icon>
                <v-icon color="#D1D5DB" v-else>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                @click="showSourcePickerDialog"
                :disabled="
                  status === 'pause' || recordVideoStarted || recordAudioStarted
                "
              >
                <v-list-item-title>
                  {{ $tc("caption.change_recording_target", 1) }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col
          cols="12"
          class="d-flex justify-center px-0 pt-0"
          v-if="this.credentials.jira && this.credentials.jira.length > 0"
        >
          <v-menu
            top
            :offset-y="true"
            :close-on-content-click="false"
            v-model="issueCreateDestinationMenu"
          >
            <template v-slot:activator="{ on: issueCreateDestinationMenu }">
              <v-tooltip top>
                <template v-slot:activator="{ on: onTooltip }">
                  <v-btn
                    id="btn__bug"
                    class="control-btn mx-1"
                    fab
                    outlined
                    small
                    color="default"
                    v-on="{ ...issueCreateDestinationMenu, ...onTooltip }"
                  >
                    <img
                      v-if="$vuetify.theme.dark === false"
                      :src="require('../assets/icon/bug.svg')"
                      width="24"
                      height="24"
                    />
                    <img
                      v-else
                      :src="require('../assets/icon/bug-gray.svg')"
                      width="24"
                      height="24"
                    />
                  </v-btn>
                </template>

                <span>{{ $tc("caption.create_new_issue", 1) }}</span>
              </v-tooltip>
            </template>
            <v-card class="mx-auto" width="150" tile>
              <v-list dense>
                <jira-add-issue
                  :credential-items="credentials.jira"
                  :items="items"
                  :selected="selected"
                  @close-menu="() => (issueCreateDestinationMenu = false)"
                />
              </v-list>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
      <SourcePickerDialog
        v-model="sourcePickerDialog"
        :sources="sources"
        :sourceId="sourceId"
        :loaded="loaded"
        @submit-source="startSession"
      />
      <NoteDialog
        v-model="noteDialog"
        @submit-note="addNote"
        :configItem="config"
      />
      <SummaryDialog
        v-model="summaryDialog"
        @submit-summary="addSummary"
        :configItem="config"
        :summary="summary"
      />
      <DeleteConfirmDialog
        v-model="deleteConfirmDialog"
        :text="$t('message.confirm_delete')"
        @confirm="deleteItems"
        @cancel="deleteConfirmDialog = false"
      />
      <ResetConfirmDialog
        v-model="resetConfirmDialog"
        :text="$t('message.confirm_reset')"
        @confirm="resetSession"
        @cancel="resetConfirmDialog = false"
      />
      <SaveConfirmDialog
        v-model="saveConfirmDialog"
        :text="$t('message.confirm_session_saved')"
        @confirm="saveConfirmDialog = false"
      />
      <NewSessionDialog
        v-model="newSessionDialog"
        :text="$t('message.confirm_save_progress')"
        @save="saveSession(callback)"
        @discard="discardSession(callback)"
      />
      <DurationConfirmDialog
        v-model="durationConfirmDialog"
        :text="$t('message.confirm_proceed_session_time')"
        @end="end"
        @proceed="proceed"
      />
      <AudioErrorDialog
        v-model="audioErrorDialog"
        :text="$t('message.error_recording_audio')"
        @cancel="audioErrorDialog = false"
      />
      <EndSessionDialog
        v-model="endSessionDialog"
        @proceed="closeEndSessionDialog"
        :post-session-data="postSessionData"
      />
    </div>
  </v-container>
</template>

<script>
import { VContainer, VRow, VCol, VBtn, VIcon } from "vuetify/lib/components";
import uuidv4 from "uuid";

import SourcePickerDialog from "./dialogs/SourcePickerDialog.vue";
import NoteDialog from "./dialogs/NoteDialog.vue";
import SummaryDialog from "./dialogs/SummaryDialog.vue";
import DeleteConfirmDialog from "./dialogs/DeleteConfirmDialog.vue";
import ResetConfirmDialog from "./dialogs/ResetConfirmDialog.vue";
import SaveConfirmDialog from "./dialogs/SaveConfirmDialog.vue";
import NewSessionDialog from "./dialogs/NewSessionDialog.vue";
import DurationConfirmDialog from "./dialogs/DurationConfirmDialog.vue";
import AudioErrorDialog from "./dialogs/AudioErrorDialog.vue";
import EndSessionDialog from "./dialogs/EndSessionDialog.vue";
import MinimizeControlWrapper from "../components/MinimizeControlWrapper.vue";

import JiraExportSession from "./jira/JiraExportSession";
import TestRailExportSession from "./testrail/TestRailExportSession";

import JiraAddIssue from "./jira/JiraAddIssue";

import {
  IPC_HANDLERS,
  IPC_FUNCTIONS,
  IPC_BIND_KEYS,
  SESSION_STATUSES,
  VIDEO_RESOLUTION,
  STATUSES,
} from "../modules/constants";
import {
  DEFAULT_MAP_NODES,
  DEFAULT_MAP_CONNECTIONS,
} from "../modules/constants";
let mediaRecorder;
let audioContext;
let dest;
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
    SummaryDialog,
    DeleteConfirmDialog,
    ResetConfirmDialog,
    SaveConfirmDialog,
    NewSessionDialog,
    DurationConfirmDialog,
    AudioErrorDialog,
    EndSessionDialog,
    MinimizeControlWrapper,
    JiraExportSession,
    TestRailExportSession,
    JiraAddIssue,
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
    configItem: {
      type: Object,
      default: () => {},
    },
    credentialItems: {
      type: Object,
      default: () => {},
    },
    checkedStatusOfPreSessionTask: {
      type: Boolean,
      default: () => false,
    },
    viewMode: {
      type: String,
      default: () => "normal",
    },
    srcId: {
      type: String,
      default: () => "",
    },
  },
  created() {
    try {
      audioContext = new AudioContext();
      dest = audioContext.createMediaStreamDestination();
    } catch (e) {
      console.log(e);
    }
  },
  watch: {
    items: function (newValue) {
      this.itemLists = newValue;
    },
    selectedItems: function (newValue) {
      this.selected = newValue;
    },
    configItem: function (newValue) {
      this.config = newValue;
    },
    credentialItems: function (newValue) {
      this.credentials = newValue;
    },
    "$store.state.status": {
      deep: true,
      handler(newValue) {
        this.status = newValue;
        if (
          this.status === SESSION_STATUSES.START ||
          this.status === SESSION_STATUSES.RESUME ||
          this.status === SESSION_STATUSES.PROCEED
        ) {
          this.startInterval();
        } else {
          this.stopInterval();
        }
      },
    },
    "$store.state.timer": {
      deep: true,
      handler(newValue) {
        this.timer = newValue;
      },
    },
    "$store.state.duration": {
      deep: true,
      handler(newValue) {
        this.duration = newValue;
      },
    },
  },
  computed: {
    postSessionData() {
      if (this.config.checklist) return this.config.checklist.postsession;
      else return {};
    },
    elapsedTime() {
      const timer = this.timer;
      const date = new Date(null);
      date.setSeconds(timer);
      const result = date.toISOString().substr(11, 8);
      return result;
    },
    currentTheme() {
      if (this.$vuetify.theme.dark) {
        return this.$vuetify.theme.themes.dark;
      } else {
        return this.$vuetify.theme.themes.light;
      }
    },
    summary() {
      let summary = {};
      this.items.map((item) => {
        if (item.sessionType === "Summary") {
          summary = item;
        }
      });
      return summary;
    },
  },
  data() {
    return {
      sourcePickerDialog: false,
      noteDialog: false,
      summaryDialog: false,
      deleteConfirmDialog: false,
      resetConfirmDialog: false,
      saveConfirmDialog: false,
      newSessionDialog: false,
      durationConfirmDialog: false,
      audioErrorDialog: false,
      endSessionDialog: false,
      sources: [],
      sourceId: this.srcId,
      itemLists: this.items,
      config: this.configItem,
      credentials: this.credentialItems,
      audioDevices: [],
      loaded: false,
      status: this.$store.state.status,
      recordVideoStarted: false,
      recordAudioStarted: false,
      interval: null,
      timer: this.$store.state.timer,
      duration: this.$store.state.duration,
      isDuration: false,
      started: "",
      ended: "",
      selected: [],
      callback: null,
      evidenceExportDestinationMenu: false,
      issueCreateDestinationMenu: false,
    };
  },
  mounted() {
    // new session
    window.ipc.on("NEW_SESSION", () => {
      this.callback = () => this.clearSession();
      this.newSessionDialog = true;
    });

    // save session
    window.ipc.on("SAVE_SESSION", () => {
      this.saveSession(() => (this.saveConfirmDialog = true));
    });

    // reset session
    window.ipc.on("RESET_SESSION", () => {
      this.resetConfirmDialog = true;
    });

    this.$root.$on("close-sourcepickerdialog", this.hideSourcePickerDialog);
    this.$root.$on("close-notedialog", this.hideNoteDialog);
    this.$root.$on("close-summarydialog", () => {
      this.summaryDialog = false;
    });

    if (
      this.$store.state.status === SESSION_STATUSES.START ||
      this.$store.state.status === SESSION_STATUSES.PROCEED ||
      this.$store.state.status === SESSION_STATUSES.RESUME
    ) {
      this.status = this.$store.state.status;
      this.timer = this.$store.state.timer;
      this.duration = this.$store.state.duration;
      if (this.$store.state.status === SESSION_STATUSES.START) {
        this.startSession(this.sourceId);
      }
      this.startInterval();
    }

    if (
      this.$store.state.quickTest &&
      this.$store.state.status === SESSION_STATUSES.PENDING
    ) {
      this.showSourcePickerDialog();
    }
    this.bindIPCEvent();
  },
  beforeDestroy() {
    this.$root.$off("close-sourcepickerdialog", this.hideSourcePickerDialog);
    this.$root.$on("close-notedialog", this.hideNoteDialog);
    // clear timer
    clearInterval(this.interval);
    this.timer = 0;
  },
  methods: {
    bindIPCEvent() {
      if (!window.ipc) return;

      window.ipc.on(IPC_BIND_KEYS.CLOSED_NOTE_DIALOG, (data) => {
        this.addNote(data);
      });
      window.ipc.on(IPC_BIND_KEYS.CLOSED_SUMMARY_DIALOG, (data) => {
        window.ipc.invoke(IPC_HANDLERS.WINDOW, {
          func: IPC_FUNCTIONS.CLOSE_SESSION_AND_MINIIMIZED_WINDOW,
          data: {
            data: {
              status: this.status,
              timer: this.timer,
              duration: this.duration,
              sourceId: this.sourceId,
              summary: data,
            },
            bindKey: IPC_BIND_KEYS.END_SESSION,
          },
        });
      });
      window.ipc.on(IPC_BIND_KEYS.CLOSED_ENDSESSION_DIALOG, (data) => {
        if (data.passed) {
          this.showSummaryDialog();
        }
      });
      window.ipc.on(IPC_BIND_KEYS.CLOSED_SOURCEPICKER_DIALOG, (data) => {
        if (data.sourceId) {
          this.sourceId = data.sourceId;
          this.$root.$emit("source-id-changed", this.sourceId);
        }
      });
      window.ipc.on(IPC_BIND_KEYS.END_SESSION, (data) => {
        if (data) {
          this.timer = data.timer;
          this.status = data.status;
          this.duration = data.duration;
          this.sourceId = data.sourceId;
          this.updateStoreSession();
          if (data.summary) {
            this.addSummary(data.summary);
          } else {
            this.endSessionProcess();
          }
        } else {
          this.endSessionProcess();
        }
      });
      window.ipc.on(IPC_BIND_KEYS.CLOSED_MINIMIZE_WINDOW, (data) => {
        this.status = data.status;
        this.duration = data.duration;
        this.timer = data.timer;
        this.sourceId = data.sourceId;

        if (
          this.status !== data.status &&
          data.status === SESSION_STATUSES.START
        ) {
          this.startSession(this.sourceId);
        } else if (data.status === SESSION_STATUSES.PAUSE) {
          this.pauseSession();
        }
      });
    },
    startNewSession() {
      this.$root.$emit("start-new-session");
      if (!this.checkedStatusOfPreSessionTask) {
        return;
      }
      this.$store.commit("setQuickTest", false);
      this.showSourcePickerDialog();
    },
    fetchSources() {
      return new Promise(function (resolver, reject) {
        if (!window.ipc) return reject();
        window.ipc
          .invoke(IPC_HANDLERS.CAPTURE, {
            func: IPC_FUNCTIONS.GET_MEDIA_SOURCE,
          })
          .then((data) => {
            return resolver(data);
          });
      });
    },
    showSourcePickerDialog() {
      this.fetchSources().then((data) => {
        this.loaded = true;
        this.sources = data.filter((source) => source.name !== "yattie");
        if (this.viewMode === "normal") {
          this.sourcePickerDialog = true;
        } else {
          window.ipc.invoke(IPC_HANDLERS.WINDOW, {
            func: IPC_FUNCTIONS.OPEN_MODAL_WINDOW,
            data: {
              path: "sourcepicker",
              size: {
                width: 600,
                height: 500,
              },
              data: this.sources,
            },
          });
        }
      });
    },
    hideSourcePickerDialog() {
      this.sourcePickerDialog = false;
    },
    showNoteDialog() {
      if (this.viewMode === "normal") {
        this.noteDialog = true;
      } else {
        if (!window.ipc) return;
        window.ipc.invoke(IPC_HANDLERS.WINDOW, {
          func: IPC_FUNCTIONS.OPEN_MODAL_WINDOW,
          data: {
            path: "noteEditor",
            size: {
              width: 500,
              height: 550,
            },
            data: this.config,
          },
        });
      }
    },
    hideNoteDialog() {
      this.noteDialog = false;
    },
    startInterval() {
      console.log("start interval");
      if (!this.interval) {
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
      }
    },
    stopInterval() {
      clearInterval(this.interval);
      this.interval = null;
      this.updateStoreSession();
    },
    updateStoreSession() {
      this.$store.commit("updateSession", {
        status: this.status,
        timer: this.timer,
        duration: this.duration,
      });
    },
    startSession(id) {
      this.sourceId = id;
      this.sourcePickerDialog = false;

      this.timer = this.$store.state.timer;
      this.duration = this.$store.state.duration;
      if (this.duration > 0) {
        this.isDuration = true;
      }

      if (this.started === "") {
        this.started = this.getCurrentDateTime();
        this.$store.commit("setStarted", this.started);
      }

      if (this.status !== SESSION_STATUSES.START) {
        console.log("start interval-2");
        this.status = SESSION_STATUSES.START;
        this.startInterval();
        this.changeSessionStatus(SESSION_STATUSES.START);
      }

      if (this.viewMode === "normal") {
        const currentPath = this.$router.history.current.path;
        if (currentPath !== "/main/workspace") {
          this.$router.push({ path: "/main/workspace" });
        }
      }
    },
    pauseSession() {
      this.status = SESSION_STATUSES.PAUSE;
      this.changeSessionStatus(SESSION_STATUSES.PAUSE);
      this.stopInterval();
    },
    resumeSession() {
      this.fetchSources().then((data) => {
        const list = data.filter((v) => v.id === this.sourceId);
        if (list.length === 0) {
          this.showSourcePickerDialog();
        } else {
          this.status = SESSION_STATUSES.START;
          this.timer = this.$store.state.timer;
          console.log("start interval-3");
          this.startInterval();
        }
      });
    },
    endSession() {
      if (this.postSessionData.status) {
        this.showEndSessionDialog();
        return;
      } else {
        this.showSummaryDialog();
        return;
      }
    },
    async endSessionProcess() {
      this.sourceId = "";
      this.ended = this.getCurrentDateTime();
      this.$store.commit("setEnded", this.ended);
      this.status = SESSION_STATUSES.END;
      this.changeSessionStatus(SESSION_STATUSES.END);
      this.stopInterval();
      if (window.ipc) {
        window.ipc.invoke(IPC_HANDLERS.WINDOW, {
          func: IPC_FUNCTIONS.SET_WINDOW_SIZE,
          data: {
            width: 1440,
            height: 900,
          },
        });
      }
      this.$router.push({ path: "/result" }).catch(() => {});
    },
    showSummaryDialog() {
      if (this.viewMode === "normal") {
        this.summaryDialog = true;
      } else {
        if (!window.ipc) return;
        window.ipc.invoke(IPC_HANDLERS.WINDOW, {
          func: IPC_FUNCTIONS.OPEN_MODAL_WINDOW,
          data: {
            path: "summaryEditor",
            size: {
              width: 500,
              height: 500,
            },
            data: this.config,
          },
        });
      }
    },
    showEndSessionDialog() {
      if (this.viewMode === "normal") {
        this.endSessionDialog = true;
      } else {
        if (!window.ipc) return;
        window.ipc.invoke(IPC_HANDLERS.WINDOW, {
          func: IPC_FUNCTIONS.OPEN_MODAL_WINDOW,
          data: {
            path: "endsession",
            size: {
              width: 450,
              height: 500,
            },
            data: this.config,
          },
        });
      }
    },
    closeEndSessionDialog(status) {
      this.endSessionDialog = false;
      if (status) {
        this.summaryDialog = true;
      }
    },
    resume() {
      this.pauseSession();
      this.timer = this.$store.state.timer;
      this.updateStoreSession();
      const currentPath = this.$router.history.current.path;
      if (currentPath !== "/main/workspace") {
        this.$router.push({ path: "/main/workspace" });
      }
      if (window.ipc) {
        window.ipc.invoke(IPC_HANDLERS.WINDOW, {
          func: IPC_FUNCTIONS.SET_WINDOW_SIZE,
          data: {
            width: 800,
            height: 600,
          },
        });
      }
    },
    end() {
      this.durationConfirmDialog = false;
      this.endSession();
    },
    proceed() {
      this.durationConfirmDialog = false;
      this.status = SESSION_STATUSES.PROCEED;
      this.changeSessionStatus(SESSION_STATUSES.PROCEED);
      this.startInterval();
    },
    updateStatus(value) {
      this.status = value;
      this.changeSessionStatus(this.status);
      this.$store.commit("setStatus", this.status);
    },
    screenshot() {
      this.fetchSources().then((data) => {
        const list = data.filter((v) => v.id === this.sourceId);
        if (list.length === 0) {
          this.showSourcePickerDialog();
        } else {
          this.screenshotProcess();
        }
      });
    },
    async screenshotProcess() {
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
              .then(({ id, fileName, filePath }) => {
                const data = {
                  id,
                  sessionType: "Screenshot",
                  fileType: "image",
                  fileName,
                  filePath,
                  timer_mark: this.timer,
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
    startRecordVideo() {
      this.fetchSources().then((data) => {
        const list = data.filter((v) => v.id === this.sourceId);
        if (list.length === 0) {
          this.showSourcePickerDialog();
        } else {
          this.videoRecordProcess();
        }
      });
    },
    async videoRecordProcess() {
      this.handleStream = (stream) => {
        if (this.config.audioCapture && this.audioDevices.length > 0) {
          stream.addTrack(dest.stream.getAudioTracks()[0]);
        }
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
                data: { url: imgURI, poster: true },
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
              .then(({ id, fileName, filePath }) => {
                const data = {
                  id,
                  sessionType: "Video",
                  fileType: "video",
                  fileName,
                  filePath,
                  poster: poster,
                  timer_mark: this.timer,
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
        const videoQuality = this.config.videoQuality;
        let resolution;
        VIDEO_RESOLUTION.map((item) => {
          let temp = Object.assign({}, item);
          if (temp.type === videoQuality) {
            resolution = temp;
          }
        });
        const constraints = {
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: this.sourceId,
              minWidth: resolution.width,
              maxWidth: resolution.width,
              minHeight: resolution.height,
              maxHeight: resolution.height,
            },
          },
        };
        if (this.config.audioCapture) {
          this.audioDevices = await this.getAudioSources();
          if (this.audioDevices.length > 0) {
            await this.setAudio(this.audioDevices);
          }
        }
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
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
    async getAudioSources() {
      return await navigator.mediaDevices.enumerateDevices().then((devices) => {
        const audioDevices = devices.filter(
          (d) =>
            d.kind === "audioinput" &&
            d.deviceId != "communications" &&
            d.deviceId != "default"
        );
        return audioDevices;
      });
    },
    async setAudio(source) {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: source.deviceId,
          autoGainControl: false,
          latency: 0.0,
        },
      });
      let audioIn_01 = audioContext.createMediaStreamSource(audioStream);
      audioIn_01.connect(dest);
      return audioIn_01;
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
          if (window.ipc) {
            await window.ipc
              .invoke(IPC_HANDLERS.CAPTURE, {
                func: IPC_FUNCTIONS.CREATE_AUDIO,
                data: { buffer: buffer },
              })
              .then(({ id, fileName, filePath }) => {
                const data = {
                  id,
                  sessionType: "Audio",
                  fileType: "audio",
                  fileName,
                  filePath,
                  timer_mark: this.timer,
                  poster: "",
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
      // try {
      //   this.audioDevices = await this.getAudioSources();
      //   if (!this.audioDevices.length) {
      //     this.audioErrorDialog = true;
      //     return;
      //   }
      //   const stream = this.setAudio(this.audioDevices);
      //   this.handleStream(stream);
      // } catch (e) {
      //   console.log(e);
      // }
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
      if (!window.ipc) return;
      await window.ipc.invoke(IPC_HANDLERS.WINDOW, {
        func: IPC_FUNCTIONS.OPEN_ADD_WINDOW,
        data: { width: 700, height: 800, data: data },
      });
    },
    async addNote(data) {
      if (!window.ipc) return;
      // Save Note
      const result = await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
        func: IPC_FUNCTIONS.SAVE_NOTE,
        data: data.comment,
      });

      let newItem = {
        id: result.id,
        sessionType: "Note",
        fileType: "text",
        fileName: result.fileName,
        filePath: result.filePath,
        comment: data.comment,
        tags: data.tags,
        emoji: data.emoji,
        followUp: data.followUp,
        timer_mark: this.timer,
        createdAt: Date.now(),
      };

      this.$emit("add-item", newItem);
      this.noteDialog = false;
    },
    async addSummary(value) {
      // TODO - handle summary like a regular note and allow additional metadata
      const data = {
        id: uuidv4(),
        sessionType: "Summary",
        comment: value,
        timer_mark: this.timer,
        createdAt: Date.now(),
      };
      if (Object.keys(this.summary).length) {
        const items = this.items.map((item) => {
          let temp = Object.assign({}, item);
          if (temp.sessionType === "Summary") {
            temp = data;
          }
          return temp;
        });
        this.$root.$emit("save-session", items);
      } else {
        this.$emit("add-item", data);
      }
      this.summaryDialog = false;
      this.endSessionProcess();
    },
    mindMap() {
      const data = {
        id: uuidv4(),
        sessionType: "Mindmap",
        fileType: "mindmap",
        fileName: "",
        filePath: "",
        content: {
          nodes: DEFAULT_MAP_NODES,
          connections: DEFAULT_MAP_CONNECTIONS,
        },
        timer_mark: this.timer,
      };
      this.openAddWindow(data);
    },
    async minimize() {
      const data = {
        status: this.status,
        timer: this.timer,
        duration: this.duration,
        sourceId: this.sourceId,
      };
      localStorage.setItem("state-data", JSON.stringify(data));
      if (!window.ipc) return;
      await window.ipc.invoke(IPC_HANDLERS.WINDOW, {
        func: IPC_FUNCTIONS.OPEN_MINIMIZE_WINDOW,
        data: { width: 400, height: 84 },
      });
    },
    async deleteItems() {
      if (!window.ipc) return;
      await window.ipc.invoke(IPC_HANDLERS.DATABASE, {
        func: IPC_FUNCTIONS.DELETE_ITEMS,
        data: this.selected,
      });
      await window.ipc.invoke(IPC_HANDLERS.DATABASE, {
        func: IPC_FUNCTIONS.DELETE_NOTES,
        data: this.selected,
      });
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
    async saveSession(callback = null) {
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
        quickTest: this.$store.state.quickTest,
        path: this.$route.path,
      };
      if (!window.ipc) return;
      const { status } = await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
        func: IPC_FUNCTIONS.SAVE_SESSION,
        data: data,
      });
      if (status === STATUSES.SUCCESS && callback) {
        callback();
      }
    },
    discardSession(callback = null) {
      this.newSessionDialog = false;
      if (callback) {
        callback();
      }
    },
    async clearSession() {
      this.$root.$emit("new-session");

      this.status = SESSION_STATUSES.PENDING;
      this.changeSessionStatus(SESSION_STATUSES.PENDING);

      this.timer = 0;
      this.isDuration = false;
      this.duration = 0;

      this.sourcePickerDialog = false;
      this.noteDialog = false;
      this.summaryDialog = false;
      this.deleteConfirmDialog = false;
      this.resetConfirmDialog = false;
      this.saveConfirmDialog = false;
      this.newSessionDialog = false;
      this.durationConfirmDialog = false;
      this.audioErrorDialog = false;
      this.endSessionDialog = false;

      this.$store.commit("clearState");

      if (!window.ipc) return;
      await window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.RESET_DATA,
        })
        .then(() => {
          window.ipc.invoke(IPC_HANDLERS.WINDOW, {
            func: IPC_FUNCTIONS.SET_WINDOW_SIZE,
            data: {
              width: 800,
              height: 600,
            },
          });
          this.stopInterval();
          const currentPath = this.$router.history.current.path;
          if (currentPath !== "/main") {
            this.$router.push({ path: "/main" });
          }
        });
    },
    async resetSession() {
      if (this.resetConfirmDialog) {
        this.resetConfirmDialog = false;
      }

      this.$root.$emit("reset-duration");

      this.status = SESSION_STATUSES.PENDING;
      this.changeSessionStatus(SESSION_STATUSES.PENDING);

      this.timer = 0;
      this.isDuration = false;
      this.duration = 0;

      this.$store.commit("resetState");

      if (!window.ipc) return;
      await window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.RESET_DATA,
        })
        .then(() => {
          window.ipc.invoke(IPC_HANDLERS.WINDOW, {
            func: IPC_FUNCTIONS.SET_WINDOW_SIZE,
            data: {
              width: 800,
              height: 600,
            },
          });
          this.stopInterval();
          const currentPath = this.$router.history.current.path;
          if (currentPath !== "/main") {
            this.$router.push({ path: "/main" });
          }
        });
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
    changeSessionStatus(status) {
      if (!window.ipc) return;
      window.ipc.invoke(IPC_HANDLERS.MENU, {
        func: IPC_FUNCTIONS.CHANGE_MENUITEM_STATUS,
        data: { sessionStatus: status },
      });
    },
    async showNotePanel() {
      if (!window.ipc) return;
      await window.ipc.invoke(IPC_HANDLERS.WINDOW, {
        func: IPC_FUNCTIONS.OPEN_NOTES_WINDOW,
        data: { width: 700, height: 800 },
      });
    },
  },
};
</script>

<style scoped>
.mini-ctrl-wrapper {
  display: flex;
  flex-direction: column;
  column-gap: 5px;
  width: 100%;
}
.nml-ctrl-wrapper .control-btn-wrapper {
  background: #f3f4f6;
}
.v-btn--disabled img {
  opacity: 0.5;
}
.theme--dark .control-btn-wrapper {
  background-color: #374151;
}
.theme--dark .control-btn {
  background-color: #4b5563;
  border-color: #4b5563;
}
</style>

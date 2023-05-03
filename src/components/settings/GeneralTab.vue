<template>
  <v-container class="content-wrapper">
    <v-row>
      <v-col cols="12" class="pa-4">
        <p class="body-1">{{ $tc("caption.app_settings", 1) }}</p>
        <v-btn
          class="text-capitalize font-weight-regular"
          fill
          small
          color="primary"
          :height="30"
          @click="openConfigFile"
        >
          {{ $tc("caption.select_file", 1) }}
        </v-btn>
        <span class="subtitle-1 ml-2 mt-2 mb-0">
          {{ meta.configPath }}
        </span>
        <p class="note-caption mt-3 mb-0">
          {{ $tc("caption.share_config", 1) }}
        </p>
      </v-col>
      <v-col cols="12" class="border-bottom pa-4">
        <v-btn
          class="text-capitalize font-weight-regular"
          fill
          small
          color="primary"
          :height="30"
          @click="openCredentialsFile"
        >
          {{ $tc("caption.select_file", 1) }}
        </v-btn>
        <span class="subtitle-1 ml-2 mt-2 mb-0">
          {{ meta.credentialsPath }}
        </span>
        <p class="note-caption mt-3 mb-0">
          {{ $tc("caption.split_credentials", 1) }}
          <a href="#" @click="showOAuthDialog">
            {{ $tc("caption.here", 1) }}
          </a>
        </p>
      </v-col>
      <v-col cols="12" class="border-bottom pa-4 theme-mode-section">
        <p class="body-1" :style="{ color: currentTheme.default }">
          {{ $tc("caption.apperance", 1) }}
        </p>
        <v-radio-group
          v-model="setting.apperance"
          row
          class="ma-0 pa-0 radio-control"
          dense
          hide-details
          @change="handleConfig"
        >
          <v-radio
            :label="$tc('caption.light_mode', 1)"
            :style="{ color: currentTheme.secondary }"
            value="light"
          ></v-radio>
          <v-radio
            :label="$tc('caption.dark_mode', 1)"
            color="secondary"
            value="dark"
          ></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="12" class="border-bottom pa-4 screen-recording-section">
        <p class="body-1" :style="{ color: currentTheme.default }">
          {{ $tc("caption.screen_recording", 1) }}
        </p>
        <div class="d-flex align-start">
          <div class="flex-grow-1">
            <p class="subtitle-1 mb-2">
              {{ $tc("caption.audio_on_screen_capture", 1) }}
            </p>
            <p class="caption mb-0" :style="{ color: currentTheme.default }">
              {{ $t("message.capture_audio") }}.
            </p>
          </div>
          <div class="flex-grow-0">
            <v-switch
              v-model="setting.audioCapture"
              inset
              hide-details
              dense
              class="mt-0 pt-0 switch-control"
              @change="handleConfig"
            ></v-switch>
          </div>
        </div>
        <br />
        <p class="subtitle-1 mb-2" :style="{ color: currentTheme.secondary }">
          {{ $tc("caption.video_capture_quality", 1) }}
        </p>
        <v-radio-group
          v-model="setting.videoQuality"
          class="ma-0 pa-0 radio-control"
          dense
          hide-details
          @change="handleConfig"
        >
          <div class="d-flex align-start mb-4">
            <div class="flex-grow-1">
              <p class="caption mb-0" :style="{ color: currentTheme.default }">
                {{ $tc("caption.high_quality_video", 1) }}
              </p>
            </div>
            <div class="flex-grow-0">
              <v-radio value="high"></v-radio>
            </div>
          </div>
          <div class="d-flex align-start mb-4">
            <div class="flex-grow-1">
              <p class="caption mb-0" :style="{ color: currentTheme.default }">
                {{ $tc("caption.standard_quality_video", 1) }}
              </p>
            </div>
            <div class="flex-grow-0">
              <v-radio value="standard"></v-radio>
            </div>
          </div>
          <div class="d-flex align-start">
            <div class="flex-grow-1">
              <p class="caption mb-0" :style="{ color: currentTheme.default }">
                {{ $tc("caption.low_quality_video", 1) }}
              </p>
            </div>
            <div class="flex-grow-0">
              <v-radio value="low"></v-radio>
            </div>
          </div>
        </v-radio-group>
      </v-col>
      <v-col cols="12" class="border-bottom pa-4 screenshot-section">
        <p class="body-1" :style="{ color: currentTheme.default }">
          {{ $tc("caption.screenshot") }}
        </p>
        <div class="d-flex align-start">
          <div class="flex-grow-1">
            <p class="subtitle-1 mb-2">
              {{ $t("message.select_default_color") }}
            </p>
            <p class="caption mb-0" :style="{ color: currentTheme.default }">
              {{ $t("message.default_color_description") }}.
            </p>
          </div>
          <div class="flex-grow-0 color-picker-wrapper">
            <v-text-field
              v-model="showColor"
              hide-details
              class="ma-0 pa-0"
              solo
            >
              <template v-slot:append>
                <v-menu
                  v-model="menu"
                  top
                  nudge-bottom="105"
                  nudge-left="16"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on }">
                    <div :style="swatchStyle" v-on="on" />
                  </template>
                  <v-card>
                    <v-card-text class="pa-0">
                      <v-color-picker v-model="color" flat />
                    </v-card-text>
                  </v-card>
                </v-menu>
              </template>
            </v-text-field>
          </div>
        </div>
      </v-col>
      <v-col cols="12" class="border-bottom pa-4 note-section">
        <p class="body-1">{{ $tc("caption.note", 2) }}</p>
        <p class="subtitle-1 mb-2">
          {{ $t("message.select_default_comment_type") }}
        </p>
        <v-select
          :items="commentTypes"
          color="secondary"
          v-model="setting.commentType"
          :placeholder="$tc('caption.comment_type')"
          solo
          dense
          hide-details="true"
          @change="handleConfig"
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  IPC_HANDLERS,
  IPC_FUNCTIONS,
  TEXT_TYPES,
  STATUSES,
} from "../../modules/constants";
export default {
  name: "GeneralTab",
  components: {},
  props: {
    metaData: {
      type: Object,
      default: () => {},
    },
    config: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    metaData: function (newValue) {
      this.meta = newValue;
    },
    config: function (newValue) {
      this.setting = newValue;
    },
    color: function (newValue, oldValue) {
      if (newValue === oldValue) return;

      this.setting.defaultColor = newValue.hexa;
      this.handleConfig();
    },
  },
  computed: {
    showColor() {
      return this.config.defaultColor ? this.config.defaultColor : "#000000";
    },
    swatchStyle() {
      const { menu } = this;
      return {
        backgroundColor: this.config.defaultColor
          ? this.config.defaultColor
          : "#000000",
        cursor: "pointer",
        height: "30px",
        width: "30px",
        borderRadius: menu ? "50%" : "4px",
        transition: "border-radius 200ms ease-in-out",
      };
    },
    currentTheme() {
      if (this.$vuetify.theme.dark) {
        return this.$vuetify.theme.themes.dark;
      } else {
        return this.$vuetify.theme.themes.light;
      }
    },
  },
  data() {
    return {
      meta: this.metaData,
      setting: this.config,
      comment: {
        type: "Comment",
        content: "",
        text: "",
      },
      menu: false,
      color: this.config.defaultColor,
      commentTypes: Object.keys(TEXT_TYPES).filter(
        (item) => item !== "Summary"
      ),
    };
  },
  methods: {
    handleConfig() {
      this.$emit("submit-config", this.setting);
    },
    async openConfigFile() {
      const { status, message } = await window.ipc.invoke(
        IPC_HANDLERS.FILE_SYSTEM,
        {
          func: IPC_FUNCTIONS.OPEN_CONFIG_FILE,
        }
      );
      console.log(status, message);
      if (status === STATUSES.SUCCESS) {
        this.$root.$emit("change-meta");
      }
    },
    async openCredentialsFile() {
      const { status, message } = await window.ipc.invoke(
        IPC_HANDLERS.FILE_SYSTEM,
        {
          func: IPC_FUNCTIONS.OPEN_CREDENTIALS_FILE,
        }
      );
      console.log(status, message);
      if (status === STATUSES.SUCCESS) {
        this.$root.$emit("change-meta");
      }
    },
    showOAuthDialog() {
      if (!window.ipc) return;

      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.GET_CREDENTIALS,
        })
        .then((credentials) => {
          window.ipc.invoke(IPC_HANDLERS.WINDOW, {
            func: IPC_FUNCTIONS.OPEN_MODAL_WINDOW,
            data: {
              path: "shareOAuth",
              size: {
                width: 400,
                height: 550,
              },
              data: credentials,
            },
          });
        });
    },
  },
};
</script>
<style scoped>
.content-wrapper {
  height: 100vh;
  width: 100%;
  overflow-y: auto;
}
.body-1 {
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 12px !important;
  line-height: 16px !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
}
.subtitle-1 {
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 20px !important;
}
.note-caption {
  font-style: italic !important;
  font-weight: 500 !important;
  font-size: 13px !important;
  line-height: 16px !important;
  color: #6b7280;
}
.caption {
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 13px !important;
  line-height: 16px !important;
}
.v-radio .v-label {
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 20px !important;
}
.border-bottom {
  border-bottom: 1px solid #e5e7eb;
}
.theme--dark .border-bottom {
  border-color: #374151;
}
.theme--light .border-bottom {
  border-color: #e5e7eb;
}
</style>

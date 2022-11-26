<template>
  <v-container class="content-wrapper">
    <v-row>
      <v-col cols="12" class="border-bottom pa-4">
        <p class="body-1">Apperance</p>
        <v-radio-group
          v-model="setting.apperance"
          row
          class="ma-0 pa-0"
          dense
          hide-details
          @change="handleApperance"
        >
          <v-radio label="Light mode" value="light"></v-radio>
          <v-radio label="Dark mode" value="dark"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="12" class="border-bottom pa-4">
        <p class="body-1">Screenshots</p>
        <div class="d-flex align-start">
          <div class="flex-grow-1">
            <p class="subtitle-1 mb-2">Select the default annotation color</p>
            <p class="caption mb-0">
              This will change the default color of the image annotation tools.
            </p>
          </div>
          <div class="flex-grow-0">
            <v-switch
              v-model="setting.defaultColor"
              inset
              hide-details
              dense
              class="mt-0 pt-0"
              @change="handleConfig"
            ></v-switch>
          </div>
        </div>
      </v-col>
      <v-col cols="12" class="border-bottom pa-4">
        <p class="body-1">Screen Recording</p>
        <div class="d-flex align-start"></div>
      </v-col>
      <v-col cols="12" class="pa-4">
        <p class="body-1">Notes</p>
        <div class="d-flex align-start">
          <div class="flex-grow-1">
            <p class="subtitle-1 mb-2">Select Default note/comment type</p>
          </div>
          <v-select
            :items="commentTypes"
            v-model="setting.commentType"
            placeholder="Comment Type"
            solo
            dense
            hide-details="true"
            @change="handleConfig"
          ></v-select>
        </div>
      </v-col>
      <v-col cols="12" class="border-bottom pa-4">
        <p class="subtitle-1 mb-2">Select Default note/comment type</p>
        <v-select
          :items="commentTypes"
          v-model="setting.commentType"
          placeholder="Comment Type"
          solo
          dense
          hide-details="true"
          @change="handleConfig"
        ></v-select>
      </v-col>
      <v-col cols="12" class="border-bottom pa-4">
        <p class="subtitle-1 mb-4">Screen Recording</p>
        <p class="body-1">Audio on video recording</p>
        <div class="d-flex align-start">
          <div class="flex-grow-1">
            <p class="subtitle-1 mb-2">Audio on screen capture</p>
            <p class="caption mb-0">Catpure audio with screen recordings.</p>
          </div>
          <div class="flex-grow-0">
            <v-switch
              v-model="setting.audioCapture"
              inset
              hide-details
              dense
              class="mt-0 pt-0"
              @change="handleConfig"
            ></v-switch>
          </div>
        </div>
      </v-col>
      <v-col cols="12" class="pa-4">
        <p class="body-1">Video capture quality</p>
        <v-radio-group
          v-model="setting.videoQuality"
          class="ma-0 pa-0"
          dense
          hide-details
          @change="handleConfig"
        >
          <div class="d-flex align-start mb-4">
            <div class="flex-grow-1">
              <p class="subtitle-1 mb-2">High quality Video</p>
              <p class="caption mb-0">
                This will change the default color of the image annotation
                tools.
              </p>
            </div>
            <div class="flex-grow-0">
              <v-radio value="high"></v-radio>
            </div>
          </div>
          <div class="d-flex align-start mb-4">
            <div class="flex-grow-1">
              <p class="subtitle-1 mb-2">Standard quality video</p>
              <p class="caption mb-0">
                This will change the default color of the image annotation
                tools.
              </p>
            </div>
            <div class="flex-grow-0">
              <v-radio value="standard"></v-radio>
            </div>
          </div>
          <div class="d-flex align-start">
            <div class="flex-grow-1">
              <p class="subtitle-1 mb-2">Low quality video</p>
              <p class="caption mb-0">
                This will change the default color of the image annotation
                tools.
              </p>
            </div>
            <div class="flex-grow-0">
              <v-radio value="low"></v-radio>
            </div>
          </div>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  IPC_HANDLERS,
  IPC_FUNCTIONS,
  TEXT_TYPES,
} from "../../modules/constants";
export default {
  name: "GeneralTab",
  components: {},
  props: {
    config: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    config: function (newValue) {
      this.setting = newValue;
    },
  },
  data() {
    return {
      setting: this.config,
      comment: {
        type: "Comment",
        content: "",
        text: "",
      },
      commentTypes: TEXT_TYPES,
    };
  },
  methods: {
    handleConfig() {
      this.$emit("submit-config", this.setting);
    },
    handleApperance() {
      const isDarkMode = this.setting.apperance === "dark" ? true : false;
      this.$vuetify.theme.dark = isDarkMode;
      localStorage.setItem("isDarkMode", isDarkMode);
      window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
        func: IPC_FUNCTIONS.SET_APPERANCE,
        data: { apperance: this.config.apperance },
      });
      this.$emit("submit-config", this.setting);
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
  color: #6b7280 !important;
}
.subtitle-1 {
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 20px !important;
  color: #111827 !important;
}
.caption {
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 13px !important;
  line-height: 16px !important;
  color: #6b7280;
}
.v-radio .v-label {
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 20px !important;
  color: #111827 !important;
}
.border-bottom {
  border-bottom: 1px solid #e5e7eb;
}
</style>

<template>
  <v-container class="content-wrapper">
    <div>
      <div class="pa-4" :style="{ color: currentTheme.default }">
        <p class="body-1">
          {{ $tc("caption.session_summary", 1) }}
        </p>
        <div class="d-flex align-start">
          <div class="flex-grow-1">
            <p
              class="subtitle-1 mb-2"
              :style="{ color: currentTheme.secondary }"
            >
              {{ $tc("caption.mandatory_session_summary", 1) }}
            </p>
            <p class="caption mb-0">
              {{ $t("message.make_written_summary") }}.
            </p>
          </div>
          <div class="flex-grow-0">
            <v-switch
              v-model="config.summaryRequired"
              inset
              hide-details
              dense
              class="mt-0 pt-0"
              @change="handleConfig"
            ></v-switch>
          </div>
        </div>
        <div class="d-flex align-start mt-4">
          <div class="flex-grow-1">
            <p
              class="subtitle-1 mb-2"
              :style="{ color: currentTheme.secondary }"
            >
              {{ $tc("caption.add_org_logo_in_pdf", 1) }}
            </p>
            <p class="caption mb-0">
              {{ $t("message.add_organization_logo") }}.
            </p>
          </div>
          <div class="flex-grow-0">
            <v-switch
              v-model="config.reportLogo"
              inset
              hide-details
              dense
              class="mt-0 pt-0"
              @change="handleConfig"
            ></v-switch>
          </div>
        </div>
      </div>
      <v-card
        class="mx-2 my-2 d-flex flex-column align-center selected"
        max-width="200"
        max-height="300"
        theme="dark"
        title="Card title"
        :disabled="!config.reportLogo"
        link
        hover
        @click.stop="openImage"
      >
        <v-img
          :aspect-ratio="1"
          :src="require('../../assets/icon/plus.png')"
          class="bg-white"
          width="80px"
          cover
        ></v-img>
        <v-divider class="" width="200px"></v-divider>
        <v-img
          class="bg-white"
          :src="`file://${config.logoPath}`"
          width="100%"
          height="100%"
          cover
        >
        </v-img>
      </v-card>
    </div>
  </v-container>
</template>
<script>
import { STATUSES } from "../../modules/constants";

export default {
  name: "ReportsTab",
  components: {},
  props: {
    configItem: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    configItem: function (newValue) {
      this.config = newValue;
    },
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
  data() {
    return {
      config: this.configItem,
    };
  },
  methods: {
    handleConfig() {
      this.$emit("submit-config", this.config);
    },

    async openImage() {
      if (this.$isElectron) {
        const { status, message, path } =
          await this.$electronService.openImage();

        if (status === STATUSES.ERROR) {
          this.$root.$emit("set-snackbar", message);
        } else {
          this.config.logoPath = path;
          this.$emit("submit-config", this.config);
        }
      } else {
        // todo Add web version handler
      }
    },
  },
};
</script>
<style scoped>
.content-wrapper {
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
.caption {
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 13px !important;
  line-height: 16px !important;
  color: #6b7280;
}
.logo-wrapper {
  display: flex;
  column-gap: 5px;
  flex-wrap: wrap;
}
.selected {
  border: solid;
  border-color: lightpink;
}
</style>

<template>
  <v-container fluid style="min-height: 100vh" class="d-flex">
    <v-row>
      <v-col cols="auto" class="pa-0">
        <v-tabs
          class="settings-menu"
          color="primary"
          background-color="transparent"
          v-model="activeTab"
          vertical
        >
          <v-tab
            v-for="tab of tabs"
            :key="tab.id"
            :to="tab.route"
            :style="{ color: currentTheme.secondary }"
            exact
          >
            {{ tab.name }}
          </v-tab>
        </v-tabs>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols class="content pa-0">
        <v-tabs-items v-model="activeTab">
          <v-tab-item
            v-for="tab of tabs"
            :key="tab.id"
            :value="tab.route"
            :transition="false"
          >
            <router-view
              :meta-data="metadata"
              :config="config"
              @submit-config="updateConfig"
            ></router-view>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";
export default {
  name: "SettingView",
  components: {},
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
      activeTab: "/settings",
      tabs: [
        { id: 1, name: this.$tc("caption.general", 1), route: `/settings` },
        {
          id: 2,
          name: this.$tc("caption.connection", 1),
          route: `/settings/connections`,
        },
        {
          id: 3,
          name: this.$tc("caption.template", 1),
          route: `/settings/template`,
        },
        {
          id: 4,
          name: this.$tc("caption.checklist", 1),
          route: `/settings/checklist`,
        },
        {
          id: 5,
          name: this.$tc("caption.report", 1),
          route: `/settings/reports`,
        },
        // { id: 6, name: this.$tc("caption.support", 1), route: `/settings/support` },
      ],
      metadata: {},
      config: {},
      credentials: {},
    };
  },
  created() {
    this.getMetaData();
    this.getConfig();
    this.getCredentials();
  },
  mounted() {
    this.$root.$on("change-meta", () => {
      this.getMetaData();
      this.getConfig().then(() => this.updateConfig(this.config));
      this.getCredentials().then(() =>
        this.updateCredentials(this.credentials)
      );
    });
  },
  methods: {
    async getMetaData() {
      if (!window.ipc) return;

      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.GET_METADATA,
        })
        .then((result) => {
          this.metadata = result;
        });
    },
    async getConfig() {
      if (!window.ipc) return;

      await window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.GET_CONFIG,
        })
        .then((result) => {
          this.config = result;
        });
    },
    updateConfig(value) {
      this.config = value;
      if (!window.ipc) return;

      window.ipc.invoke(IPC_HANDLERS.DATABASE, {
        func: IPC_FUNCTIONS.UPDATE_CONFIG,
        data: this.config,
      });

      const isDarkMode = this.config.apperance === "dark" ? true : false;
      this.$vuetify.theme.dark = isDarkMode;
      localStorage.setItem("isDarkMode", isDarkMode);
      window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
        func: IPC_FUNCTIONS.SET_APPERANCE,
        data: { apperance: this.config.apperance },
      });
    },
    async getCredentials() {
      if (!window.ipc) return;

      await window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.GET_CREDENTIALS,
        })
        .then((result) => {
          this.credentials = result;
        });
    },
    updateCredentials(value) {
      this.credentials = value;
      if (!window.ipc) return;

      window.ipc.invoke(IPC_HANDLERS.DATABASE, {
        func: IPC_FUNCTIONS.UPDATE_CREDENTIALS,
        data: this.credentials,
      });
    },
  },
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow-y: auto;
}
.v-tab {
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  text-transform: capitalize;
  padding: 10px 35px;
  justify-content: flex-start;
}
</style>

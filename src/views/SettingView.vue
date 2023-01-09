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
          <v-tab v-for="tab of tabs" :key="tab.id" :to="tab.route" exact>
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
    };
  },
  created() {
    this.getMetaData();
    this.getConfig();
  },
  mounted() {
    this.$root.$on("change-meta", () => {
      this.getMetaData();
      this.getConfig();
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

      window.ipc
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
  color: #000 !important;
  text-transform: capitalize;
  padding: 10px 35px;
  justify-content: flex-start;
}
</style>

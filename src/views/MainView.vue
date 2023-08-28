<template>
  <v-container class="wrapper pa-0">
    <div class="top" v-if="this.status === 'pending' || $store.state.quickTest">
      <v-btn
        class="text-capitalize pa-0 back-btn"
        plain
        rounded
        solid
        v-shortkey="backHotkey"
        @shortkey="back()"
        @click="back()"
      >
        <v-icon class="ma-0">mdi-chevron-left</v-icon>
        {{ $tc("caption.back", 1) }}
      </v-btn>
    </div>
    <div class="header">
      <div class="tabs">
        <v-tabs
          class="tabs"
          centered
          v-model="activeTab"
          color="primary"
          background-color="transparent"
          :height="26"
          hide-slider
        >
          <v-tab class="test-tab" to="/main" exact>
            {{ $tc("caption.test", 1) }}
          </v-tab>
          <v-tab
            class="workspace-tab"
            :disabled="this.status === 'pending'"
            to="/main/workspace"
          >
            {{ $tc("caption.workspace", 1) }}
          </v-tab>
        </v-tabs>
      </div>
      <div class="avatar">
        <div v-if="checkAuth">
          <MenuPopover :credential-items="credentials" />
        </div>
        <div v-else>
          <v-menu :nudge-width="100" bottom z-index="99999" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                small
                color="primary"
                height="32"
                width="32"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon dark> mdi-account </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item link to="/authentication/signin">
                <v-list-item-title>Log In</v-list-item-title>
              </v-list-item>
              <!--<v-list-item link to="/authentication/signupMain">
                <v-list-item-title>Register</v-list-item-title>
              </v-list-item>-->
            </v-list>
          </v-menu>
        </div>
      </div>
    </div>
    <v-divider style="z-index: 100" />
    <div class="content">
      <v-tabs-items v-model="activeTab">
        <v-tab-item value="/main" :transition="false">
          <TestWrapper :config-item="config" :credential-items="credentials" />
          <CheckTaskWrapper
            v-if="showCheckList"
            :config-item="config"
            :tasks="presession.tasks"
            type="preseesion"
          />
        </v-tab-item>
        <v-tab-item value="/main/workspace" :transition="false">
          <WorkspaceWrapper
            :items="items"
            :selectedItems="selected"
            event-type="dblclick"
            @submit-session="updateActiveSession"
          />
        </v-tab-item>
      </v-tabs-items>
    </div>
    <div class="footer">
      <ControlPanel
        :items="items"
        @add-item="addItem"
        :config-item="config"
        :credential-items="credentials"
        :selectedItems="selected"
        :checkedStatusOfPreSessionTask="checkedStatusOfPreSessionTask"
        view-mode="normal"
      />
      <TimeCounter v-if="$store.state.status !== 'pending'" />
    </div>
  </v-container>
</template>

<script>
import {
  VContainer,
  VTabs,
  VTab,
  VTabsItems,
  VTabItem,
} from "vuetify/lib/components";
import TestWrapper from "../components/TestWrapper.vue";
import WorkspaceWrapper from "../components/WorkspaceWrapper.vue";
import ControlPanel from "../components/ControlPanel.vue";
import TimeCounter from "../components/TimeCounter.vue";
import CheckTaskWrapper from "@/components/CheckTaskWrapper.vue";
import MenuPopover from "@/components/MenuPopover.vue";

import {
  IPC_HANDLERS,
  IPC_FUNCTIONS,
  SESSION_STATUSES,
} from "../modules/constants";

export default {
  name: "MainView",
  components: {
    VContainer,
    VTabs,
    VTab,
    VTabsItems,
    VTabItem,
    TestWrapper,
    WorkspaceWrapper,
    ControlPanel,
    TimeCounter,
    CheckTaskWrapper,
    MenuPopover,
  },
  props: {
    isAuthenticated: {
      type: Boolean,
      default: () => false,
    },
  },
  watch: {
    isAuthenticated: function (newValue) {
      this.checkAuth = newValue;
    },
    presession: {
      handler: function () {
        this.checkStatusOfPreSessionTask();
      },
      deep: true,
    },
  },
  data() {
    return {
      activeTab: "/main",
      items: [],
      selected: [],
      activeSession: {},
      config: {},
      credentials: {},
      checkAuth: this.isAuthenticated,
      presession: {},
      postsession: {},
      checkedStatusOfPreSessionTask: false,
      showTaskError: false,
      showMenu: false,
    };
  },
  created() {
    this.fetchItems();
    this.getConfig();
    this.getCredentials();
  },
  mounted() {
    this.$root.$on("update-selected", this.updateSelected);
    this.$root.$on("save-session", this.saveSession);
    this.$root.$on("new-session", () => {
      this.presession.tasks = this.presession.tasks.map((item) => {
        let temp = Object.assign({}, item);
        temp.checked = false;
        return temp;
      });
    });
    if (!window.ipc) return;

    window.ipc.on("DATA_CHANGE", () => {
      this.fetchItems();
    });
    window.ipc.on("CONFIG_CHANGE", () => {
      this.getConfig();
    });
    window.ipc.on("CREDENTIAL_CHANGE", () => {
      this.getCredentials();
    });
    window.ipc.on("META_CHANGE", () => {
      this.fetchItems();
      this.getConfig();
      this.getCredentials();
    });
  },
  computed: {
    backHotkey() {
      return this.$hotkeyHelpers.findBinding(
        "workspace.back",
        this.config.hotkeys
      );
    },
    status() {
      return this.$store.state.status;
    },
    showCheckList() {
      return (
        this.$store.state.status === SESSION_STATUSES.PENDING &&
        this.presession.status
      );
    },
  },
  methods: {
    navigate(link) {
      if (this.$route.path === link || this.status === SESSION_STATUSES.PENDING)
        return;

      this.$router.push({ path: link });
    },
    checkStatusOfPreSessionTask() {
      if (!this.presession.status) {
        this.checkedStatusOfPreSessionTask = true;
        return;
      }

      const uncheckedTasks = this.presession.tasks.filter(
        (task) => !task.checked && task.required
      );
      this.checkedStatusOfPreSessionTask = uncheckedTasks.length === 0;
    },
    getConfig() {
      if (!window.ipc) return;

      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, { func: IPC_FUNCTIONS.GET_CONFIG })
        .then((result) => {
          this.config = result;
          this.presession = {
            status: this.config.checklist.presession.status,
            tasks: this.config.checklist.presession.tasks.map((task) => {
              return { ...task, checked: false };
            }),
          };

          this.checkStatusOfPreSessionTask();

          this.postsession = {
            status: this.config.checklist.postsession.status,
            tasks: this.config.checklist.postsession.tasks.map((task) => {
              return { ...task, checked: false };
            }),
          };
        });
    },
    getCredentials() {
      if (!window.ipc) return;

      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, { func: IPC_FUNCTIONS.GET_CREDENTIALS })
        .then((result) => {
          this.credentials = result;
        });
    },
    fetchItems() {
      if (!window.ipc) return;

      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, { func: IPC_FUNCTIONS.GET_ITEMS })
        .then((result) => {
          this.items = result;
        });
    },
    addItem(newItem) {
      this.items.push(newItem);
      this.saveSession(this.items);
    },
    updateItems() {
      this.items = this.items.map((item) => {
        let temp = Object.assign({}, item);
        if (temp.id === this.activeItem.id) {
          temp = this.activeItem;
        }
        return temp;
      });
      this.saveSession(this.items);
    },
    saveSession(items) {
      if (!window.ipc) return;

      window.ipc.invoke(IPC_HANDLERS.DATABASE, {
        func: IPC_FUNCTIONS.UPDATE_ITEMS,
        data: items,
      });
    },
    updateSelected(value) {
      this.selected = value;
    },
    updateActiveSession(value) {
      this.activeSession = value;
      this.openEditWindow(this.activeSession);
      // this.updateItems();
    },
    openEditWindow(data) {
      window.ipc.invoke(IPC_HANDLERS.WINDOW, {
        func: IPC_FUNCTIONS.OPEN_EDIT_WINDOW,
        data: data,
      });
    },
    back() {
      this.$store.commit("resetState");
      this.$router.push("/");
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
  max-width: 600px;
  overflow-y: auto;
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
.header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 15px;
  padding: 15px;
}
.header .tabs {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header .avatar {
  flex-grow: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  flex-grow: 1;
  overflow: auto;
  padding: 0 5px;
}
.footer {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.v-tabs {
  width: auto !important;
  flex: none !important;
}
.v-tab {
  background: #fff;
  border: 1px solid #d1d5db;
  text-transform: capitalize;
  color: #374151;
  min-width: 170px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
}
.v-tab.v-tab--active {
  background: #6d28d9;
  border: 1px solid #6d28d9;
  color: #fff;
}
.v-tab.test-tab {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.v-tab.timeline-tab {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.theme--light.v-tabs .v-tabs-bar .v-tab--disabled,
.theme--light.v-tabs .v-tabs-bar .v-tab:not(.v-tab--active) {
  color: #6d28d9;
  border: 1px solid #6d28d9;
}
.theme--dark.v-tabs .v-tabs-bar .v-tab--disabled,
.theme--dark.v-tabs .v-tabs-bar .v-tab:not(.v-tab--active) {
  border-color: #4b5563;
  background-color: #374151;
  color: #ffffff;
}
</style>

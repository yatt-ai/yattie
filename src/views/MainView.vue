<template>
  <v-container class="wrapper pa-0">
    <div class="header">
      <v-tabs
        class="tabs"
        centered
        v-model="activeTab"
        color="primary"
        background-color="transparent"
        :height="26"
        hide-slider
      >
        <v-tab class="test-tab" to="/main" exact> Test </v-tab>
        <v-tab class="timeline-tab" to="/main/timeline" exact> Timeline </v-tab>
      </v-tabs>
    </div>
    <v-divider />
    <div class="content">
      <v-tabs-items v-model="activeTab">
        <v-tab-item value="/main" :transition="false">
          <TestWrapper />
          <CheckTaskWrapper
            v-if="showCheckList"
            :tasks="presession.tasks"
            :showError="showTaskError"
            type="preseesion"
          />
        </v-tab-item>
        <v-tab-item value="/main/timeline" :transition="false">
          <TimelineWrapper
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
        @add-item="addItem"
        @handle-pressesion-task-error="
          (status) => {
            showTaskError = status;
          }
        "
        :selectedItems="selected"
        :checkedStatusOfPreSessionTask="checkedStatusOfPreSessionTask"
        :postSessionData="postsession"
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
import TimelineWrapper from "../components/TimelineWrapper.vue";
import ControlPanel from "../components/ControlPanel.vue";
import TimeCounter from "../components/TimeCounter.vue";
import CheckTaskWrapper from "@/components/CheckTaskWrapper.vue";
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
    TimelineWrapper,
    ControlPanel,
    TimeCounter,
    CheckTaskWrapper,
  },
  watch: {
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
      presession: {},
      postsession: {},
      checkedStatusOfPreSessionTask: false,
      showTaskError: false,
    };
  },
  created() {
    this.fetchItems();
    this.getConfig();
  },
  mounted() {
    this.$root.$on("update-selected", this.updateSelected);
    window.ipc.on("DATA_CHANGE", () => {
      this.fetchItems();
    });
    window.ipc.on("CLOSE_SETTING_WINDOW", () => {
      console.log("child window closed");
      this.getConfig();
    });
  },
  computed: {
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
      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, { func: IPC_FUNCTIONS.GET_CONFIG })
        .then((result) => {
          this.presession = {
            status: result.config.checklist.presession.status,
            tasks: result.config.checklist.presession.tasks.map((task) => {
              return { ...task, checked: false };
            }),
          };

          this.checkStatusOfPreSessionTask();

          this.postsession = {
            status: result.config.checklist.postsession.status,
            tasks: result.config.checklist.postsession.tasks.map((task) => {
              return { ...task, checked: false };
            }),
          };
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

      if (!window.ipc) return;

      window.ipc.invoke(IPC_HANDLERS.DATABASE, {
        func: IPC_FUNCTIONS.UPDATE_ITEMS,
        data: this.items,
      });
    },
    updateItems() {
      this.items = this.items.map((item) => {
        let temp = Object.assign({}, item);
        if (temp.id === this.activeItem.id) {
          temp = this.activeItem;
        }
        return temp;
      });

      if (!window.ipc) return;

      window.ipc.invoke(IPC_HANDLERS.DATABASE, {
        func: IPC_FUNCTIONS.UPDATE_ITEMS,
        data: this.items,
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
      window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
        func: IPC_FUNCTIONS.OPEN_EDIT_WINDOW,
        data: data,
      });
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
}
.header {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 15px 0;
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
  padding: 0 5px;
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
</style>

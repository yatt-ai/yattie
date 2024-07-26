<template>
  <v-container class="wrapper" fluid>
    <div class="header">
      <div class="logo mb-4">
        <LogoWrapper :height="34" :width="120" />
      </div>
      <div class="avatar">
        <div v-if="isAuthenticated">
          <MenuPopover />
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
    <div class="content">
      <div class="test-wrapper box-shadow3">
        <v-btn class="text-capitalize back-btn" plain @click="back()">
          <v-icon>mdi-chevron-left</v-icon>
          {{ $tc("caption.back", 1) }}
        </v-btn>
        <h1>Scripted Tests</h1>
        <div class="form-group">
          <div>
            <label>TCM tool</label>
            <v-select
              placeholder="Select TCM tool"
              :items="tcmTools"
              :item-text="(item) => item[0].toUpperCase() + item.slice(1)"
              v-model="tcmTool"
              :disabled="defaultTcmTool"
              @change="selectTcmTool"
            ></v-select>
          </div>
          <div>
            <label>Project</label>
            <v-select
              placeholder="Select Project"
              :disabled="!tcmTool || defaultProject"
              v-model="selectedProject"
              :items="projects"
              :item-text="(item) => item.name"
              :item-value="(item) => item.id"
              @change="selectProject"
            ></v-select>
          </div>
          <div>
            <label>Test Run</label>
            <v-select
              placeholder="Select test run"
              :disabled="!selectedProject || defaultRun"
              v-model="selectedRun"
              :items="runs"
              :item-text="(item) => item.name"
              :item-value="(item) => item.id"
              @change="selectTestRun"
            ></v-select>
          </div>
        </div>
        <template>
          <v-card class="mb-4">
            <v-card-title>
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                placeholder="Search"
                single-line
                hide-details
              ></v-text-field>
              <v-btn
                class="my-4 text-capitalize secondary-btn"
                fill
                plain
                medium
                color="secondary"
                >Filter</v-btn
              >
              <v-spacer></v-spacer>
              <LogoWrapper :height="34" :width="120" />
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="searchTestsList"
              :items-per-page="5"
              class="elevation-1"
              v-model="selectedTests"
              show-select
              item-key="id"
              selection-color="#0C2FF3"
            >
              <template v-slot:[`item.name`]="{ item }">
                {{ item.title }}
              </template>

              <template v-slot:[`item.assigned_to`]="{ item }">
                {{ item.assignedto_id }}
              </template>

              <template v-slot:[`item.priority`]="{ item }">
                <v-chip
                  color="white"
                  :text-color="getPriorityColor(item.priority_id)"
                  small
                >
                  {{ getPriorityFromPriorityId(item.priority_id) }}
                </v-chip>
              </template>

              <template v-slot:[`item.status`]="{ item }">
                <v-chip
                  :color="getStatusColor(item.status_id)"
                  text-color="white"
                  small
                >
                  {{ getStatusText(item.status_id) }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card>
        </template>
        <div class="form-group">
          <div>
            <label>Session name</label>
            <v-text-field
              placeholder="Session name"
              v-model="sessionName"
            ></v-text-field>
          </div>
          <div>
            <label>Privacy</label>
            <v-select
              placeholder="Select Privacy"
              :items="privacy_modes"
              v-model="privacy"
            ></v-select>
          </div>
          <div>
            <v-radio-group v-model="invitation">
              <v-radio label="General" value="general"></v-radio>
              <v-radio label="Invite Only" value="inviteOnly"></v-radio>
            </v-radio-group>
          </div>
          <div>
            <label>Invitation link</label>
            <v-text-field
              v-model="invitationLink"
              outlined
              readonly
              dense
              hide-details
              class="invitation-link"
            >
              <template v-slot:append>
                <v-btn text small @click="copyToClipboard" class="copy-button">
                  <v-icon left small>mdi-content-copy</v-icon>
                  Copy
                </v-btn>
              </template>
            </v-text-field>
          </div>
          <div>
            <label>Time limit (Optional)</label>
            <v-text-field
              placeholder="00:00"
              v-model="timeLimit"
            ></v-text-field>
          </div>
        </div>
        <div>
          <v-btn
            class="text-capitalize submit-btn"
            color="primary"
            block
            @click="startSession"
            :disabled="
              !selectedTests.length || !sessionName || !privacy || !invitation
            "
          >
            Start Session
          </v-btn>
        </div>
      </div>
    </div>
  </v-container>
</template>
<script>
import { VContainer, VBtn } from "vuetify/lib/components";
import LogoWrapper from "../components/LogoWrapper.vue";
import MenuPopover from "../components/MenuPopover.vue";
import testrailIntegrationHelper from "../integrations/TestRailIntegrationHelpers";
import { mapGetters } from "vuex";

export default {
  name: "HomeView",
  components: {
    VContainer,
    VBtn,
    LogoWrapper,
    MenuPopover,
  },
  data() {
    return {
      tcmTools: [], // This is populated by the number of logged in integrations (loggedInServices)
      tcmTool: null,
      defaultTcmTool: false,
      projects: [],
      selectedProject: null,
      defaultProject: false,
      runs: [],
      selectedRun: null,
      defaultRun: false,
      headers: [
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Assigned to", value: "assigned_to" },
        { text: "Priority", value: "priority" },
        { text: "Status", value: "status" },
      ],
      tests: [],
      selectedTests: [],
      sessionName: "",
      privacy_modes: ["Private", "Public"],
      privacy: "Public",
      invitation: "general",
      timeLimit: null,
      statuses: [],
      search: "",
      invitationLink: "https://pinata.com/sdflksdfnsldfvbnsfd...",
    };
  },
  computed: {
    ...mapGetters({
      hotkeys: "config/hotkeys",
      checklistPresessionTasks: "config/checklistPresessionTasks",
      checklistPostsessionTasks: "config/checklistPostsessionTasks",
      credentials: "auth/credentials",
      isAuthenticated: "auth/isAuthenticated",
      loggedInServices: "auth/loggedInServices",
    }),
    quickTestHotkey() {
      return this.$hotkeyHelpers.findBinding("home.quickTest", this.hotkeys);
    },
    newExploratoryHotkey() {
      return this.$hotkeyHelpers.findBinding(
        "home.newExploratorySession",
        this.hotkeys
      );
    },
    openExploratoryHotkey() {
      return this.$hotkeyHelpers.findBinding(
        "home.openExploratorySession",
        this.hotkeys
      );
    },
    searchTestsList() {
      if (this.tests.length && this.search && this.search !== "") {
        return this.tests.filter((item) => {
          return (
            item.title.toUpperCase().includes(this.search.toUpperCase()) ||
            item.custom_expected
              ?.toUpperCase()
              .includes(this.search.toUpperCase()) ||
            item.custom_goals
              ?.toUpperCase()
              .includes(this.search.toUpperCase()) ||
            item.custom_mission
              ?.toUpperCase()
              .includes(this.search.toUpperCase()) ||
            item.custom_preconds
              ?.toUpperCase()
              .includes(this.search.toUpperCase()) ||
            item.custom_steps
              ?.toUpperCase()
              .includes(this.search.toUpperCase()) ||
            item.id.toString().includes(this.search)
          );
        });
      } else {
        return this.tests;
      }
    },
  },
  mounted() {
    if (this.$isElectron) {
      // handle electron menu -> New Session
      this.$electronService.onNewSession(this.newSession);
      this.$electronService.onConfigChange(() => {
        this.getConfig();
      });
    }

    this.loadTcmTools();
  },
  methods: {
    loadTcmTools() {
      let tcmTools = [];

      for (let key in this.loggedInServices) {
        tcmTools.push(key);
      }

      this.tcmTools = tcmTools;

      if (tcmTools.length === 1) {
        this.tcmTool = tcmTools[0];
        this.defaultTcmTool = true;

        if (this.tcmTool === "testrail") {
          this.getTestRailProjects();
          this.getTestRailStatuses();
        }
      }
    },
    async getTestRailStatuses() {
      this.statuses = await testrailIntegrationHelper.getTestStatuses(
        this.credentials["testrail"][0]
      );
    },
    async getTestRailProjects() {
      this.projects = await testrailIntegrationHelper.fetchProjects(
        this.credentials
      );

      if (this.projects.length === 1) {
        this.selectedProject = this.projects[0].id;
        this.defaultProject = true;
        await this.getTestRailTestRuns();
      }
    },
    async getTestRailTestRuns() {
      this.runs = await testrailIntegrationHelper.fetchRuns(
        this.credentials["testrail"][0],
        this.selectedProject,
        "testrail"
      );

      if (this.runs.length === 1) {
        this.selectedRun = this.runs[0].id;
        this.defaultRun = true;
      }
    },
    async getTestRailTests() {
      this.tests = await testrailIntegrationHelper.fetchTests(
        this.credentials["testrail"][0],
        this.selectedRun,
        "testrail"
      );
    },
    selectTcmTool() {
      if (this.tcmTool === "testrail") {
        this.getTestRailProjects();
      }
    },
    selectProject() {
      if (this.tcmTool === "testrail") {
        this.getTestRailTestRuns();
      }
    },
    selectTestRun() {
      this.getTestRailTests();
    },
    getPriorityFromPriorityId(priorityId) {
      switch (priorityId) {
        case 1:
          return "Low";
        case 2:
          return "Medium";
        default:
          return "High";
      }
    },
    getPriorityColor(priorityId) {
      switch (priorityId) {
        case 4:
          return "red";
        case 3:
          return "orange";
        case 2:
          return "yellow";
        default:
          return "green";
      }
    },
    getStatusColor(statusId) {
      let status = this.statuses.find((status) => status.id === statusId);

      return `#${status.color_bright}`;
    },
    getStatusText(statusId) {
      let status = this.statuses.find((status) => status.id === statusId);

      return status.label;
    },
    copyToClipboard() {
      navigator.clipboard
        .writeText(this.invitationLink)
        .then(() => {
          console.log("Link copied to clipboard successfully!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    },
    startSession() {
      this.$store.commit("startQuickTest", "/run/scripted/workspace");
      this.$store.commit("startSessionPlan", this.selectedTests);
      this.$router.push("/run/scripted/workspace");
    },
    async getConfig() {
      const config = await this.$storageService.getConfig();
      this.$store.commit("config/setFullConfig", config);
    },
    async newSession() {
      console.log("newSession");
      this.$store.commit("clearState");
      this.$store.commit("setSessionQuickTest", false);
      if (this.$router.history.current.path === "/") {
        await this.$router.push("/main");
      }
    },
    back() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #f2f4f7;
  justify-content: flex-start;
}

.header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 15px;
  padding: 15px;
  background-color: #ffffff;
  box-shadow: 0px 4px 34px 0px rgba(0, 0, 0, 0.16);
  border-radius: 15px;
}

.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 50px;
}

.test-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #ffffff;
  padding: 25px;
  min-width: 70%;
  box-shadow: -10px 12px 34px 0px rgba(48, 98, 254, 0.15);
  border-radius: 15px;
}

.back-btn {
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  width: 10px;
}

.form-group {
  max-width: 50%;
}

.secondary-btn {
  background: #f2f4f7;
  font-weight: 700;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.invitation-link ::v-deep .v-input__slot {
  padding-right: 8px !important;
}
.invitation-link ::v-deep .v-text-field__slot input {
  text-overflow: ellipsis;
}
.copy-button {
  text-transform: none !important;
}
</style>

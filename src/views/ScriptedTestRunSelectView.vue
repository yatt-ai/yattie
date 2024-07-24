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
        <div>
          <label>TCM tool</label>
          <v-select
            label="Select TCM tool"
            :items="tcmTools"
            :item-text="(item) => item[0].toUpperCase() + item.slice(1)"
            v-model="tcmTool"
            :disabled="defaultTcmTool"
          ></v-select>
        </div>
        <div>
          <label>Project</label>
          <v-select
            label="Select Project"
            :disabled="!tcmTool || defaultProject"
            v-model="selectedProject"
            :items="projects"
            :item-text="(item) => item.name"
            :item-value="(item) => item.id"
          ></v-select>
        </div>
        <div>
          <label>Test Run</label>
          <v-select
            label="Select test run"
            :disabled="!selectedProject || defaultRun"
            v-model="selectedRun"
            :items="runs"
            :item-text="(item) => item.name"
            :item-value="(item) => item.id"
          ></v-select>
        </div>
        <!--        Todo: Implement search component-->
        <div style="max-width: 50%">
          <div>
            <label>Session name</label>
            <v-text-field
              label="Session name"
              v-model="sessionName"
            ></v-text-field>
          </div>
          <div>
            <label>Privacy</label>
            <v-select
              label="Select Privacy"
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
            <v-text-field append-icon="mdi-link"></v-text-field>
            <v-btn class="text-capitalize" plain>
              <v-icon>mdi-link</v-icon> Copy
            </v-btn>
          </div>
        </div>
        <div>
          <label>Time limit (Optional)</label>
          <v-text-field placeholder="00:00" v-model="timeLimit"></v-text-field>
        </div>
        <div>
          <v-btn
            class="text-capitalize"
            color="primary"
            block
            @click="startSession"
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
      tests: [],
      selectedTest: new Set(),
      sessionName: "",
      privacy_modes: ["Private", "Public"],
      privacy: "Public",
      invitation: "general",
      timeLimit: 0,
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
        }
      }
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
    startSession() {
      // Do validations (if neccessary)
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
  height: 100vh;
  width: 100%;
  overflow-y: hidden;
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
</style>

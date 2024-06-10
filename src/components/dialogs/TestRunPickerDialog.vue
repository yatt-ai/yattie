<template>
  <div class="open-section">
    <div v-if="isAuthenticated && isLoggedInToTestrail">
      <v-btn
        class="my-4 text-capitalize"
        fill
        block
        small
        color="primary"
        v-shortkey="scriptedTestSessionHotkey"
        @shortkey="handleScriptedTestSession()"
        @click="handleScriptedTestSession()"
      >
        {{ $tc("caption.scripted_test_session", 1) }}
      </v-btn>
    </div>
    <v-dialog
      v-bind="$attrs"
      v-on="$listeners"
      persistent
      width="100%"
      max-width="600px"
      v-model="testRunPickerDialog"
    >
      <v-sheet rounded :style="{ backgroundColor: currentTheme.background }">
        <div class="wrapper">
          <div class="header">
            <span :style="{ color: currentTheme.secondary }">
              {{ $tc("message.select_tests_to_execute_in_session", 1) }}
            </span>
          </div>
          <div class="content">
            <div class="pa-2">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    placeholder="Search"
                    outlined
                    dense
                    v-model="search"
                    hide-details="true"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
            <v-divider></v-divider>
            <v-row v-if="!selectedProject">
              <v-col cols="12">
                <div class="loading-wrapper" v-if="projectsLoading">
                  <v-progress-circular
                    :size="70"
                    :width="7"
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </div>
                <div class="issue-wrapper" v-else>
                  <div class="issue-list">
                    <span class="issue-header"
                      >{{ searchProjectsList.length }}
                      {{ $tc("caption.projects", 1) }}</span
                    >
                    <div
                      v-for="item in searchProjectsList"
                      :key="item.id"
                      :class="
                        selectedItem && item.id === selectedItem.id
                          ? 'issue-item active'
                          : 'issue-item'
                      "
                      @click="handleSelectProject(item)"
                    >
                      <v-icon class="issue-icon">mdi-flag</v-icon>
                      <div class="issue-desc">
                        <span
                          class="issue-summary subtitle-1"
                          v-text="item.name"
                        ></span>
                        <span class="issue-key caption" v-text="item.id"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
          <div class="footer">
            <v-btn
              class="text-capitalize"
              small
              :color="currentTheme.background"
              :style="{ color: currentTheme.secondary }"
              v-shortkey="cancelHotkey"
              @shortkey="handleClose()"
              @click="handleClose()"
            >
              {{ $tc("caption.cancel", 1) }}
            </v-btn>
            <v-btn
              class="text-capitalize"
              small
              :color="currentTheme.primary"
              :style="{ color: currentTheme.white }"
              v-shortkey="confirmHotkey"
              @shortkey="handleSelect()"
              @click="handleSelect()"
            >
              {{ $tc("caption.select", 1) }}
            </v-btn>
          </div>
        </div>
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import testrailIntegrationHelper from "../../integrations/TestRailIntegrationHelpers";

export default {
  name: "TestRunPickerDialog",
  props: {
    isAuthenticated: {
      type: Boolean,
      default: true,
    },
    isLoggedInToTestrail: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      testRunPickerDialog: false,
      search: "",
      projects: [],
      projectsLoading: true,
      selectedItem: null,
      selectedProject: null,
    };
  },
  watch: {},
  computed: {
    ...mapGetters({
      hotkeys: "config/hotkeys",
      credentials: "auth/credentials",
    }),
    confirmHotkey() {
      return this.$hotkeyHelpers.findBinding("general.save", this.hotkeys);
    },
    cancelHotkey() {
      return this.$hotkeyHelpers.findBinding("general.cancel", this.hotkeys);
    },
    scriptedTestSessionHotkey() {
      return this.$hotkeyHelpers.findBinding(
        "home.scriptedTestSession",
        this.hotkeys
      );
    },
    currentTheme() {
      if (this.$vuetify.theme.dark) {
        return this.$vuetify.theme.themes.dark;
      } else {
        return this.$vuetify.theme.themes.light;
      }
    },
    searchProjectsList() {
      if (this.projects.length && this.search && this.search !== "") {
        return this.projects.filter((item) => {
          return (
            item.name.toUpperCase().includes(this.search.toUpperCase()) ||
            item.id.toString().includes(this.search)
          );
        });
      } else {
        return this.projects;
      }
    },
  },
  methods: {
    handleClose() {
      this.hideTestRunPickerDialog();
    },
    handleSelect() {},
    handleScriptedTestSession() {
      this.showTestRunPickerDialog();
    },
    async showTestRunPickerDialog() {
      try {
        this.testRunPickerDialog = true;

        this.projects = await testrailIntegrationHelper.fetchProjects(
          this.credentials
        );

        this.projectsLoading = false;
      } catch (error) {
        console.log(error);
        this.$root.$emit("set-snackbar", error.message);
      }
    },
    hideTestRunPickerDialog() {
      this.testRunPickerDialog = false;
    },
    handleSelectProject(item) {
      // Todo: fix this
      this.selectedItem = item;
    },
  },
  mounted() {},
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 400px;
  width: 100%;
  overflow-y: auto;
}

.header {
  width: 100%;
  padding: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.theme--dark .header {
  border-color: #374151;
}

.header span {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #111827;
}

.content {
  flex-grow: 1;
  overflow: auto;
  padding: 15px;
}

.footer {
  width: 100%;
  padding: 15px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: 12px;
}

.theme--dark .footer {
  border-color: #374151;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 250px;
}

.issue-wrapper {
  min-height: 250px;
  max-height: 250px;
  overflow-y: auto;
}

.issue-wrapper .issue-list {
  display: flex;
  flex-direction: column;
}

.issue-wrapper .issue-list .issue-header {
  font-size: 13px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  padding: 10px;
}

.issue-wrapper .issue-list .issue-item {
  display: flex;
  align-items: flex-start;
  column-gap: 20px;
  padding: 10px;
  cursor: pointer;
}

.issue-wrapper .issue-list .issue-item:hover {
  background: #ddd;
}

.issue-wrapper .issue-list .issue-item.active {
  background: #eee6fb;
}

.issue-wrapper .issue-list .issue-item.active .issue-icon {
  color: #6d28d9;
}

.issue-wrapper .issue-list .issue-item.active .issue-desc .issue-summary {
  color: #6d28d9 !important;
}

.issue-wrapper .issue-list .issue-item .issue-desc {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.issue-wrapper .issue-list .result-wrapper {
  margin: 0 5px;
}

.issue-desc .issue-summary {
  font-size: 13px !important;
  font-weight: 500;
  line-height: 16px !important;
  color: #000 !important;
}

.issue-desc .issue-key {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}
</style>

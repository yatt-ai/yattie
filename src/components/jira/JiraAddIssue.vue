<template>
  <v-list-item @click="showDialog()">
    <v-list-item-icon class="mr-4">
      <v-avatar size="24">
        <img
          :src="require('../../assets/icon/jira.png')"
          width="24"
          alt="avatar"
        />
      </v-avatar>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{ $tc("caption.jira", 1) }}</v-list-item-title>
    </v-list-item-content>

    <v-dialog v-model="dialog" persistent width="450">
      <v-sheet outlined color="accent" rounded>
        <v-card>
          <v-card-title
            class="dialog-title"
            :style="{ color: currentTheme.secondary }"
          >
            {{ $tc("caption.create_new_jira_issue", 1) }}
          </v-card-title>
          <v-divider></v-divider>
          <div class="pa-2">
            <JiraAddIssueForm
              :credential-items="credentialItems"
              :items="items"
              :trigger-save="triggerJiraSaveTicket"
              @issueAdded="dialog = false"
            />
          </div>
          <v-divider></v-divider>
          <v-card-actions>
            <v-row class="action-wrapper">
              <v-col cols="6 pr-1">
                <v-btn
                  class="btn"
                  small
                  block
                  color="white"
                  :style="{ color: currentTheme.black }"
                  :disabled="loading"
                  @click="handleDiscard()"
                >
                  {{ $tc("caption.discard", 1) }}
                </v-btn>
              </v-col>
              <v-col cols="6 pl-1">
                <v-btn
                  class="btn"
                  small
                  block
                  color="primary"
                  :disabled="loading"
                  @click="handleSave()"
                >
                  {{ $tc("caption.export", 1) }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-dialog>
  </v-list-item>
</template>

<script>
import jiraIntegrationHelper from "../../integrations/JiraIntegrationHelpers";
import JiraAddIssueForm from "@/components/jira/JiraAddIssueForm.vue";

export default {
  name: "JiraAddIssue",
  components: { JiraAddIssueForm },
  props: {
    credentialItems: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    credentialItems: function (newValue) {
      this.credentials = newValue;
    },
    items: function (newValue) {
      this.itemLists = newValue;
    },
    selected: function (newValue) {
      this.selectedIds = newValue;
    },
  },
  data() {
    return {
      triggerJiraSaveTicket: false,
      credentials: this.credentialItems,
      itemLists: this.items,
      selectedIds: this.selected ? this.selected : [],
      dialog: false,
      loading: false,
      userLoading: false,
      issueLoading: false,
      projects: [],
      project: null,
      projectId: null,
      issueTypeId: null,
      issueFields: [],
      users: null,
      issues: null,
      newIssue: {
        fields: {},
      },
      blankIssue: {
        fields: {},
      },
      valid: true,
      rules: [(v) => !!v || "This field is required"],
      dateMenu: false,
      issueConfirmDialog: false,
      fieldMappings: {
        description: {
          type: "text",
        },
      },
    };
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
  mounted() {},
  destroyed() {
    this.handleClear();
  },
  methods: {
    handleDiscard() {
      this.handleClear();
      this.dialog = false;
    },
    handleClear(leaveProject = true) {
      if (!leaveProject) {
        this.project = null;
        this.projectId = null;
      }
      this.issueTypeId = null;
      this.issueFields = [];
      this.newIssue = {
        fields: {},
      };
      this.blankIssue = {
        fields: {},
      };
    },
    async handleSave() {
      this.triggerJiraSaveTicket = !this.triggerJiraSaveTicket;
    },
    async showDialog() {
      this.$emit("close-menu");
      this.dialog = true;
      this.loading = true;
      let response = await jiraIntegrationHelper.getAllProjects(
        this.credentials
      );

      this.projects = response.projects;
      this.loading = false;
      if (response?.error) {
        this.dialog = false;
        let message = response.error.message
          ? response.error.message
          : this.$tc("message.api_error", 1);
        message += " " + this.$tc("message.please_try_again", 1);
        this.$root.$emit("set-snackbar", message);
        if (response.error?.checkAuth) {
          this.$root.$emit("update-auth", []);
        }
      }
    },
    async handleProject() {
      this.loading = true;
      let foundProject = this.projects.find(
        (project) => project.id === this.projectId
      );

      let response = await jiraIntegrationHelper.getProject(
        this.credentials[foundProject.credentialIndex],
        this.projectId
      );
      response.project.credentialIndex = foundProject.credentialIndex;
      this.project = response.project;

      this.loading = false;
      if (response?.error) {
        let message = response.error.message
          ? response.error.message
          : this.$tc("message.api_error", 1);
        this.$root.$emit("set-snackbar", message);
        if (response.error?.checkAuth) {
          this.$root.$emit("update-auth", []);
        }
      }
    },
    async handleIssueType() {
      this.loading = true;
      let response = await jiraIntegrationHelper.getIssueTypeData(
        this.credentials[this.project.credentialIndex],
        this.projectId,
        this.issueTypeId
      );
      this.blankIssue.fields = Object.assign({}, response.blankIssue.fields);
      this.newIssue = Object.assign({}, response.blankIssue);
      this.issueFields = response.fieldData;

      this.loading = false;
      if (response?.error) {
        let message = response.error.message
          ? response.error.message
          : this.$tc("message.api_error", 1);
        this.$root.$emit("set-snackbar", message);
        if (response.error?.checkAuth) {
          this.$root.$emit("update-auth", []);
        }
      }
    },
    async searchUser(url) {
      this.userLoading = true;
      let response = await jiraIntegrationHelper.getProvidedURL(
        this.credentials[this.project.credentialIndex],
        url
      );
      this.users = response.items;

      this.userLoading = false;
      if (response?.error) {
        let message = response.error.message
          ? response.error.message
          : this.$tc("message.api_error", 1);
        this.$root.$emit("set-snackbar", message);
        if (response.error?.checkAuth) {
          this.$root.$emit("update-auth", []);
        }
      }
    },
    async searchIssue() {
      this.issueLoading = true;
      let response = await jiraIntegrationHelper.searchIssues(
        this.credentials[this.project.credentialIndex],
        { project: this.projectId }
      );
      this.issues = response.issues;

      this.issueLoading = false;
      if (response?.error) {
        let message = response.error.message
          ? response.error.message
          : this.$tc("message.api_error", 1);
        this.$root.$emit("set-snackbar", message);
        if (response.error?.checkAuth) {
          this.$root.$emit("update-auth", []);
        }
      }
    },
    updateDescription({ content, text }) {
      this.description.content = content;
      this.description.text = text;
    },
  },
};
</script>
<style scoped>
.dialog-title {
  /* border-bottom: 1px solid #e5e7eb; */
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  color: #111827;
  padding: 12px;
}
.dialog-content {
  max-height: 300px;
  overflow-y: auto;
}
.v-card__actions {
  padding: 12px;
}
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
}
.issue-wrapper {
  min-height: 300px;
  max-height: 300px;
  overflow-y: auto;
}
.project-item,
.issue-item,
.user-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 5px;
}
</style>

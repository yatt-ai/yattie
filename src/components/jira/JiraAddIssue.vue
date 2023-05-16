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
      <!-- CTODO - theming -->
      <v-sheet outlined color="accent" rounded>
        <v-card>
          <v-card-title class="dialog-title">
            {{ $tc("caption.create_new_jira_issue", 1) }}
          </v-card-title>
          <v-divider></v-divider>
          <div class="pa-2">
            <v-row>
              <v-col cols="12">
                <div class="loading-wrapper" v-if="loading">
                  <v-progress-circular
                    :size="70"
                    :width="7"
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </div>
                <div class="issue-wrapper" v-else>
                  <v-form lazy-validation v-model="valid" ref="form">
                    <v-container v-if="projects.length > 0">
                      <v-row>
                        <v-col cols="6">
                          <!-- CTODO - i18n -->
                          <v-select
                            v-model="projectId"
                            :items="projects"
                            class="project-select"
                            label="Select a Project"
                            item-text="name"
                            item-value="id"
                            hide-details="true"
                            @change="handleProject"
                          >
                            <template v-slot:selection="{ attr, on, item }">
                              <div class="project-item" v-bind="attr" v-on="on">
                                <v-avatar size="20">
                                  <img
                                    :src="item.avatarUrls['24x24']"
                                    width="24"
                                    alt="avatar"
                                  />
                                </v-avatar>
                                {{ item.name }}
                              </div>
                            </template>
                            <template v-slot:item="{ item }">
                              <div class="project-item">
                                <v-avatar size="24">
                                  <img
                                    :src="item.avatarUrls['24x24']"
                                    width="24"
                                    alt="avatar"
                                  />
                                </v-avatar>
                                {{ item.name }}
                              </div>
                            </template>
                          </v-select>
                        </v-col>
                        <v-col cols="6" v-if="project">
                          <v-select
                            v-model="issueTypeId"
                            :items="project.issueTypes"
                            label="Select a Issue Type"
                            item-text="name"
                            item-value="id"
                            hide-details="true"
                            @change="handleIssue"
                          >
                            <template v-slot:selection="{ attr, on, item }">
                              <div class="issue-item" v-bind="attr" v-on="on">
                                <v-avatar size="20">
                                  <img
                                    :src="item.iconUrl"
                                    width="24"
                                    alt="avatar"
                                  />
                                </v-avatar>
                                {{ item.name }}
                              </div>
                            </template>
                            <template v-slot:item="{ item }">
                              <div class="issue-item">
                                <v-avatar size="24">
                                  <img
                                    :src="item.iconUrl"
                                    width="24"
                                    alt="avatar"
                                  />
                                </v-avatar>
                                {{ item.name }}
                              </div>
                            </template>
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row
                        v-if="issueTypeId !== null && issueFields !== null"
                      >
                        <v-col cols="12">
                          <template v-for="item in issueFields">
                            <div
                              class="field-item mb-2"
                              :key="item.key"
                              v-if="
                                item.key !== 'issuetype' &&
                                item.key !== 'project'
                              "
                            >
                              <div
                                v-if="
                                  fieldMappings?.[item.key]?.type === 'text'
                                "
                              >
                                <div class="subtitle-2 label-text">
                                  {{ item.name }}
                                </div>
                                <v-tiptap
                                  v-model="issue.fields[item.key]"
                                  :placeholder="$t('message.insert_note')"
                                  ref="issue.fields[item.key]"
                                  :toolbar="[
                                    'headings',
                                    '|',
                                    'bold',
                                    'italic',
                                    'underline',
                                    '|',
                                    'color',
                                    '|',
                                    'bulletList',
                                    'orderedList',
                                    '|',
                                    'link',
                                    'emoji',
                                    'blockquote',
                                  ]"
                                >
                                </v-tiptap>
                              </div>
                              <div v-else-if="item.schema.type === 'string'">
                                <div class="subtitle-2 label-text">
                                  {{ item.name }}
                                </div>
                                <v-text-field
                                  outlined
                                  dense
                                  :height="35"
                                  v-model="issue.fields[item.key]"
                                  :required="item.required"
                                  :rules="item.required ? rules : []"
                                ></v-text-field>
                              </div>
                              <div v-else-if="item.schema.type === 'number'">
                                <div class="subtitle-2 label-text">
                                  {{ item.name }}
                                </div>
                                <v-text-field
                                  outlined
                                  dense
                                  :height="35"
                                  type="number"
                                  v-model="issue.fields[item.key]"
                                  :required="item.required"
                                  :rules="item.required ? rules : []"
                                ></v-text-field>
                              </div>
                              <div v-else-if="item.schema.type === 'option'">
                                <div class="subtitle-2 label-text">
                                  {{ item.name }}
                                </div>
                                <v-select
                                  dense
                                  outlined
                                  placeholder="Select a Item"
                                  :items="item.allowedValues"
                                  item-value="id"
                                  item-text="value"
                                  v-model="issue.fields[item.key]"
                                  :required="item.required"
                                  :rules="item.required ? rules : []"
                                ></v-select>
                              </div>
                              <div
                                v-else-if="
                                  item.schema.type === 'array' &&
                                  item.schema.system !== 'issuelinks' &&
                                  item.schema.system !== 'attachment'
                                "
                              >
                                <div class="subtitle-2 label-text">
                                  {{ item.name }}
                                </div>
                                <v-row class="mx-1 mb-1" justify="start">
                                  <v-checkbox
                                    v-for="(
                                      arrayItem, index
                                    ) in item.allowedValues"
                                    :key="index"
                                    light
                                    :label="arrayItem.value"
                                    class="mr-3"
                                    color="primary"
                                    v-model="issue.fields[item.key].selected"
                                  >
                                  </v-checkbox>
                                </v-row>
                              </div>
                              <div
                                v-else-if="
                                  item.schema.type === 'user' &&
                                  item.key !== 'reporter'
                                "
                              >
                                <div class="subtitle-2 label-text">
                                  {{ item.name }}
                                </div>
                                <v-autocomplete
                                  outlined
                                  dense
                                  clearable
                                  :height="35"
                                  :loading="userLoading"
                                  :items="users"
                                  item-text="displayName"
                                  item-value="accountId"
                                  :required="item.required"
                                  :rules="item.required ? rules : []"
                                  v-model="issue.fields[item.key].id"
                                  @focus="searchUser(item.autoCompleteUrl)"
                                >
                                  <template
                                    v-slot:selection="{ attr, on, item }"
                                  >
                                    <div
                                      class="user-item"
                                      v-bind="attr"
                                      v-on="on"
                                    >
                                      <v-avatar size="20">
                                        <img
                                          :src="item.avatarUrls['24x24']"
                                          width="24"
                                          alt="avatar"
                                        />
                                      </v-avatar>
                                      {{ item.displayName }}
                                    </div>
                                  </template>
                                  <template v-slot:item="{ item }">
                                    <div class="user-item">
                                      <v-avatar size="24">
                                        <img
                                          :src="item.avatarUrls['24x24']"
                                          width="24"
                                          alt="avatar"
                                        />
                                      </v-avatar>
                                      {{ item.displayName }}
                                    </div>
                                  </template>
                                </v-autocomplete>
                              </div>
                              <div v-else-if="item.schema.type === 'issuelink'">
                                <div class="subtitle-2 label-text">
                                  {{ item.name }}
                                </div>
                                <v-autocomplete
                                  outlined
                                  dense
                                  clearable
                                  :height="35"
                                  :loading="issueLoading"
                                  :items="issues"
                                  item-text="key"
                                  item-value="id"
                                  :required="item.required"
                                  :rules="item.required ? rules : []"
                                  v-model="issue.fields[item.key].id"
                                  @focus="searchIssue"
                                >
                                </v-autocomplete>
                              </div>
                            </div>
                          </template>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </div>
              </v-col>
            </v-row>
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
    <v-snackbar v-model="snackBar.enabled" timeout="3000">
      {{ snackBar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          @click="snackBar.enabled = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-list-item>
</template>

<script>
import axios from "axios";

import jiraIntegrationHelper from "../../integrations/JiraIntegrationHelpers";
export default {
  name: "JiraAddIssue",
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
      issue: {
        fields: {},
      },
      valid: true,
      rules: [(v) => !!v || "This field is required"],
      dateMenu: false,
      issueConfirmDialog: false,
      snackBar: {
        enabled: false,
        message: "",
      },
      fieldMappings: {
        description: {
          type: "text",
        },
      }, // CTODO
    };
  },
  computed: {},
  mounted() {},
  destroyed() {
    this.handleClear();
  },
  methods: {
    handleDiscard() {
      this.handleClear();
      this.dialog = false;
    },
    handleClear() {
      this.project = null;
      this.projectId = null;
      this.issueTypeId = null;
      this.issueFields = [];
      this.issue = {
        fields: {},
      };
    },
    async handleSave() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        const project = {
          id: this.projectId,
        };
        const issueType = {
          id: this.issueTypeId,
        };
        this.$set(this.issue.fields, "project", project);
        this.$set(this.issue.fields, "issuetype", issueType);
        this.loading = true; // CTODO - Handle which creds to use and move
        //         headers building to the helper
        const url = `https://api.atlassian.com/ex/jira/${this.credentials[0].orgs[0].id}/rest/api/3/issue`;
        const headers = {
          headers: {
            Authorization: `Bearer ${this.credentials[0].accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        let issueBody = { fields: {} };
        await Object.keys(this.issue.fields).forEach((k) => {
          if (this.issue.fields[k]?.id !== "") {
            issueBody.fields[k] = this.issue.fields[k];
          }
          if (this.fieldMappings?.[k]?.type === "text") {
            issueBody.fields[k] = jiraIntegrationHelper.htmlToADF(
              "doc",
              new DOMParser().parseFromString(this.issue.fields[k], "text/html")
                .body
            );
          }
        });
        await axios
          .post(url, issueBody, headers)
          .then((response) => {
            console.log(response); // CTODO - remove
            this.handleClear();
            this.dialog = false;
            this.loading = false; // CTODO - snack bar successful
          })
          .catch((error) => {
            this.loading = false;
            this.snackBar.enabled = true;
            this.snackBar.message = error.message ? error.message : "API Error";
            // CTODO - fix and promulgate this to other errors as well
            // if (
            //   credential.type === "oauth" &&
            //   dayjs(credential.lastRefreshed) < dayjs().subtract(4, "minute") &&
            //   [401, 403].includes(error.status)
            // ) {
            this.$root.$emit("update-auth", []);
            // }
          });
        // CTODO - test the below
        this.$refs.form.resetValidation();
      } else {
        this.snackBar.enabled = true;
        this.snackBar.message = "Please fill out all required field!";
      }
    },
    async showDialog() {
      this.$emit("close-menu");
      this.dialog = true;
      this.loading = true;
      let tempProjects = [];
      for (const [i, credential] of Object.entries(this.credentials)) {
        let url, authHeader;
        // CTODO - build headers in an IntegrationsHelper function
        if (credential.type === "basic") {
          url = `https://${credential.url}/rest/api/3/search`;
          authHeader = `Basic ${credential.accessToken}`;
        } else if (credential.type === "oauth") {
          if (!credential.url) {
            // TODO - Allow selecting of the org.
            url = `https://api.atlassian.com/ex/jira/${credential.orgs[0].id}/rest/api/3/project`;
          } else {
            url = `https://${credential.url}/rest/api/2/search`;
          }
          authHeader = `Bearer ${credential.accessToken}`;
        }
        const headers = {
          headers: {
            Authorization: authHeader,
            Accept: "application/json",
          },
        };

        console.log(i); // CTODO - remove
        await axios
          .get(url, headers)
          .then((response) => {
            if (response.status === 200) {
              tempProjects.push(...response.data);
            } // Use 'i' to save the index for later and change this.projects to map
            this.loading = false; // CTODO - handle since this is in a loop
          })
          .catch((error) => {
            this.loading = false;
            this.snackBar.enabled = true;
            this.snackBar.message = error.message ? error.message : "API Error";
          });
      }
      this.projects = tempProjects;
    },
    async handleProject() {
      this.loading = true;
      // CTODO - Fix this after
      //       understanding how to tie to
      //       multiple credentials
      const url = `https://api.atlassian.com/ex/jira/${this.credentials[0].orgs[0].id}/rest/api/3/project/${this.projectId}`;
      const headers = {
        headers: {
          Authorization: `Bearer ${this.credentials[0].accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      await axios
        .get(url, headers)
        .then((response) => {
          if (response.status === 200) {
            this.project = response.data;
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.snackBar.enabled = true;
          this.snackBar.message = error.message ? error.message : "API Error";
        });
    },
    async handleIssue() {
      this.issueFields = []; // CTODO - Missing fields like description
      this.issue = {
        fields: {},
      }; // CTODO - Attachments aren't attached
      this.loading = true;
      const url = `https://api.atlassian.com/ex/jira/${this.credentials[0].orgs[0].id}/rest/api/3/issue/createmeta?projectIds=${this.projectId}&issuetypeIds=${this.issueTypeId}&expand=projects.issuetypes.fields`;
      const headers = {
        headers: {
          Authorization: `Bearer ${this.credentials[0].accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      await axios
        .get(url, headers)
        .then((response) => {
          this.loading = false;
          if (response.status === 200) {
            const fields = response.data.projects[0].issuetypes[0].fields;
            Object.keys(fields).forEach((key) => {
              const item = fields[key];
              if (
                item &&
                item.key !== "issuetype" &&
                item.key !== "project" &&
                item.schema.type !== "any" &&
                !["attachment", "issuelinks"].includes(item.schema.system)
              ) {
                this.issueFields.push(item);
                if (item.key === "reporter") {
                  const reporter = {
                    id: this.credentials[0].user.id,
                  };
                  this.$set(this.issue.fields, item.key, reporter);
                } else if (item.key === "parent") {
                  const parent = {
                    id: "",
                  };
                  this.$set(this.issue.fields, item.key, parent);
                } else if (item.schema.type === "array") {
                  this.$set(this.issue.fields, item.key, []);
                } else {
                  this.$set(this.issue.fields, item.key, "");
                }
              }
            });
          }
        })
        .catch((error) => {
          this.loading = false;
          this.snackBar.enabled = true;
          this.snackBar.message = error.message ? error.message : "API Error";
        });
    },
    async searchUser(url) {
      this.userLoading = true;
      const headers = {
        headers: {
          Authorization: `Bearer ${this.credentials[0].accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      await axios
        .get(url, headers)
        .then((response) => {
          this.userLoading = false;
          if (response.status === 200) {
            this.users = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
          this.userLoading = false;
        });
    },
    async searchIssue() {
      this.issueLoading = true;
      const url = `https://api.atlassian.com/ex/jira/${this.credentials[0].orgs[0].id}/rest/api/3/search?jql=project%20%3D%20${this.projectId}`;
      const headers = {
        headers: {
          Authorization: `Bearer ${this.credentials[0].accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      await axios
        .get(url, headers)
        .then((response) => {
          this.issueLoading = false;
          if (response.status === 200) {
            this.issues = response.data.issues;
          }
        })
        .catch((error) => {
          console.log(error);
          this.issueLoading = false;
        });
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

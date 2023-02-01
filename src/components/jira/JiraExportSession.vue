<template>
  <div>
    <v-btn
      fill
      small
      block
      color="white"
      class="text-capitalize"
      @click="showDialog"
    >
      {{ title }}
    </v-btn>
    <v-dialog v-model="dialog" persistent width="350" eager>
      <v-sheet outlined color="accent" rounded>
        <v-card>
          <v-card-title class="dialog-title">
            {{ $tc("caption.export_item_to_jira", 1) }}
          </v-card-title>
          <v-divider></v-divider>
          <div class="pa-2">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  placeholder="Search Issue"
                  outlined
                  dense
                  v-model="search"
                  hide-details="true"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
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
                  <div class="issue-list">
                    <span class="issue-header"
                      >{{ searchIssueList.length }}
                      {{ $tc("caption.issues", 1) }}</span
                    >
                    <div
                      v-for="item in searchIssueList"
                      :key="item.id"
                      :class="
                        selectedItem && item.id === selectedItem.id
                          ? 'issue-item active'
                          : 'issue-item'
                      "
                      @click="handleSelectedItem(item)"
                    >
                      <v-icon class="issue-icon">mdi-flag</v-icon>
                      <div class="issue-desc">
                        <span
                          class="issue-summary subtitle-1"
                          v-text="item.fields.summary"
                        ></span>
                        <span
                          class="issue-key caption"
                          v-text="item.key"
                        ></span>
                      </div>
                    </div>
                  </div>
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
                  @click="dialog = false"
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
                  :disabled="loading || !selectedItem"
                  @click="handleExport"
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
        <v-btn color="primary" text v-bind="attrs" @click="handleDiscard">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
//import fetch from "node-fetch";
// import { IPC_HANDLERS, IPC_FUNCTIONS } from "../../modules/constants";
export default {
  name: "JiraExportSession",
  components: {},
  props: {
    title: {
      type: String,
      default: () => "",
    },
    credentialItem: {
      type: Object,
      default: () => {},
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
    credentialItem: function (newValue) {
      this.credential = newValue;
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
      loading: false,
      dialog: false,
      credential: this.credentialItem,
      itemLists: this.items,
      selectedIds: this.selected ? this.selected : [],
      search: "",
      issues: [],
      selectedItem: null,
      snackBar: {
        enabled: false,
        message: "",
      },
    };
  },
  computed: {
    searchIssueList() {
      let temp = this.issues;
      if (this.search !== "" && this.search) {
        temp = temp.filter((item) => {
          return (
            item.key.toUpperCase().includes(this.search.toUpperCase()) ||
            item.fields.summary
              .toUpperCase()
              .includes(this.search.toUpperCase()) ||
            item.id.includes(this.search)
          );
        });
      }
      return temp;
    },
  },
  mounted() {},
  methods: {
    async showDialog() {
      this.dialog = true;
      this.loading = true;
      const type = this.credential.type;
      const url = `https://api.atlassian.com/ex/jira/${this.credential[type].resource.id}/rest/api/3/search`;
      const headers = {
        headers: {
          Authorization: `Bearer ${this.credential[type].access_token}`,
          Accept: "application/json",
        },
      };

      await axios
        .get(url, headers)
        .then((response) => {
          if (response.status === 200) {
            this.issues = response.data.issues;
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.snackBar.enabled = true;
          this.snackBar.message = error.message ? error.message : "API Error";
        });
    },
    handleSelectedItem(item) {
      this.selectedItem = item;
    },
    handleExport() {
      this.uploadFile = async (data) => {
        const type = this.credential.type;
        const url = `https://api.atlassian.com/ex/jira/${this.credential[type].resource.id}/rest/api/3/issue/${this.selectedItem.key}/attachments`;
        const access_token = await this.$integrationHelpers.getAccessToken(
          this.credential
        );
        const headers = {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "application/json",
            "X-Atlassian-Token": "no-check",
          },
        };
        axios
          .post(url, data, headers)
          .then((response) => {
            if (response.status === 200) {
              this.loading = false;
              this.dialog = false;
              this.$root.$emit("update-selected", []);
            }
          })
          .catch((error) => {
            this.loading = false;
            this.snackBar.enabled = true;
            this.snackBar.message = error.message ? error.message : "API Error";
          });
      };

      const formData = new FormData();
      this.loading = true;

      if (this.selectedIds.length === 0) {
        this.itemLists.map((item) => {
          if (item.sessionType !== "Summary") {
            this.selectedIds.push(item.id);
          }
        });
      }

      this.selectedIds.map(async (id, i) => {
        const item = this.itemLists.find((item) => item.id === id);
        const response = await fetch(`file:${item.filePath}`);
        const file = new File([await response.blob()], item.fileName);
        formData.append("file", file);
        if (i === this.selectedIds.length - 1) {
          this.uploadFile(formData);
        }
      });
    },
    handleDiscard() {
      this.dialog = false;
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
  max-height: 250px;
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
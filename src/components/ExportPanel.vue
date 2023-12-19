<template>
  <v-container>
    <v-row class="pa-2">
      <v-col cols="12" class="pa-1">
        <v-menu
          top
          :offset-y="true"
          :close-on-content-click="false"
          v-model="evidenceExportDestinationMenu"
        >
          <template v-slot:activator="{ on: evidenceExportDestinationMenu }">
            <v-tooltip top>
              <template v-slot:activator="{ on: onTooltip }">
                <v-btn
                  fill
                  small
                  block
                  color="primary"
                  v-on="{ ...evidenceExportDestinationMenu, ...onTooltip }"
                >
                  <v-icon left>mdi-download</v-icon>
                  {{ $tc("caption.export_session_report", 1) }}
                </v-btn>
              </template>
              <span>{{ $tc("caption.export_session_report", 1) }}</span>
            </v-tooltip>
          </template>
          <v-card tile>
            <v-list dense>
              <v-list-item @click="exportSession">
                <v-list-item-icon class="mr-4">
                  <v-icon>mdi-download</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $tc("caption.save_as", 1) }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <!-- TODO - What does it look like to export an entire session to a 3rd party service?
              <div
                v-if="this.credentials.jira && this.credentials.jira.length > 0"
              >
                <jira-export-session
                  :title="$tc(`caption.export_to_jira`, 1)"
                  :credential-items="credentials.jira"
                  :selected="[]"
                  :items="itemLists"
                  @close-menu="() => (evidenceExportDestinationMenu = false)"
                />
              </div>
              <div
                v-if="
                  this.credentials.testrail &&
                  this.credentials.testrail.length > 0
                "
              >
                <test-rail-export-session
                  :title="$tc(`caption.export_to_testrail`, 1)"
                  :credential-items="credentials.testrail"
                  :selected="[]"
                  :items="itemLists"
                  @close-menu="() => (evidenceExportDestinationMenu = false)"
                />
              </div>
              -->
            </v-list>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";

//import JiraExportSession from "./jira/JiraExportSession";
//import TestRailExportSession from "./testrail/TestRailExportSession";

export default {
  name: "ExportPanel",
  components: {
    //JiraExportSession,
    //TestRailExportSession,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    configItem: {
      type: Object,
      default: () => {},
    },
    credentialItems: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    items: function (newValue) {
      this.itemLists = newValue;
    },
    configItem: function (newValue) {
      this.config = newValue;
    },
    credentialItems: function (newValue) {
      this.credentials = newValue;
    },
  },
  data() {
    return {
      exportSessionDialog: false,
      itemLists: this.items,
      config: this.configItem,
      credentials: this.credentialItems,
      evidenceExportDestinationMenu: false,
    };
  },
  mounted() {
    this.$root.$on("close-exportsessiondialog", () => {
      this.exportSessionDialog = false;
    });
  },
  methods: {
    async exportSession() {
      const data = {
        id: this.$store.state.id,
        title: this.$store.state.title,
        charter: this.$store.state.charter,
        preconditions: this.$store.state.preconditions,
        duration: this.$store.state.duration,
        timer: this.$store.state.timer,
        started: this.$store.state.started,
        ended: this.$store.state.ended,
      };

      console.log(data);

      if (!window.ipc) return;

      await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
        func: IPC_FUNCTIONS.EXPORT_SESSION,
        data: data,
      });
    },
  },
};
</script>

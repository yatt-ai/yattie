<template>
  <v-container>
    <v-row class="pa-2">
      <v-col cols="12" class="pa-1">
        <v-btn
          fill
          small
          block
          color="primary"
          class="text-capitalize"
          @click="exportSession()"
        >
          {{ $tc("caption.export_session_report", 1) }}
        </v-btn>
      </v-col>
      <v-col cols="12" class="pa-1" v-if="checkAuth">
        <jira-export-session
          :title="$tc(`caption.export_session_report_to_jira`, 1)"
          :credential-item="credential"
          :selected="[]"
          :items="itemLists"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import JiraExportSession from "./jira/JiraExportSession";
import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";

export default {
  name: "ExportPanel",
  components: {
    JiraExportSession,
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
    credentialItem: {
      type: Object,
      default: () => {},
    },
    isAuthenticated: {
      type: Boolean,
      default: () => false,
    },
  },
  watch: {
    items: function (newValue) {
      this.itemLists = newValue;
    },
    configItem: function (newValue) {
      this.config = newValue;
    },
    credentialItem: function (newValue) {
      this.credential = newValue;
    },
    isAuthenticated: function (newValue) {
      this.checkAuth = newValue;
    },
  },
  data() {
    return {
      exportSessionDialog: false,
      itemLists: this.items,
      config: this.configItem,
      credential: this.credentialItem,
      checkAuth: this.isAuthenticated,
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
        title: this.$store.state.title,
        charter: this.$store.state.charter,
        precondition: this.$store.state.precondition,
        duration: this.$store.state.duration,
        timer: this.$store.state.timer,
        started: this.$store.state.started,
        ended: this.$store.state.ended,
      };

      if (!window.ipc) return;

      await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
        func: IPC_FUNCTIONS.EXPORT_SESSION,
        data: data,
      });
    },
  },
};
</script>

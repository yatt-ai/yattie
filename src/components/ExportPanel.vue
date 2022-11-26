<template>
  <v-container>
    <v-row class="pa-2">
      <v-col cols="12" class="pa-1">
        <v-btn fill small block color="primary" @click="exportSession()">
          Export Session Report
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";

export default {
  name: "ExportPanel",
  components: {},
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {},
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
      // this.$router.push("print");
    },
  },
};
</script>

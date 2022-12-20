<template>
  <v-container class="wrapper">
    <div class="content">
      <div class="logo mb-4">
        <LogoWrapper :height="34" :width="120" />
      </div>
      <div class="new-section">
        <v-btn
          class="my-4 text-capitalize"
          fill
          block
          small
          color="primary"
          to="main"
        >
          {{ $tc("caption.new_session", 1) }}
        </v-btn>
        <!-- <v-btn
          class="my-4 text-capitalize"
          fill
          small
          block
          color="white"
          to="main"
        >
          New session for existing charter
        </v-btn> -->
      </div>
      <div class="open-section">
        <v-btn
          block
          plain
          color="primary"
          small
          class="text-capitalize open-btn"
          @click="openSession"
        >
          {{ $tc("caption.open_session", 1) }}
        </v-btn>
      </div>
    </div>
  </v-container>
</template>
<script>
import { VContainer, VBtn } from "vuetify/lib/components";
import LogoWrapper from "../components/LogoWrapper.vue";
import {
  IPC_HANDLERS,
  IPC_FUNCTIONS,
  STATUSES,
  // SESSION_STATUSES,
} from "../modules/constants";
export default {
  name: "HomeView",
  components: {
    VContainer,
    VBtn,
    LogoWrapper,
  },
  data() {
    return {};
  },
  methods: {
    async openSession() {
      if (!window.ipc) return;

      const { status, message, metadata } = await window.ipc.invoke(
        IPC_HANDLERS.FILE_SYSTEM,
        {
          func: IPC_FUNCTIONS.OPEN_SESSION,
        }
      );
      if (status === STATUSES.ERROR) {
        console.log(message);
      } else {
        // restore vuex state
        this.$store.commit("restoreState", metadata);
        this.$router.push({ path: metadata.path });
      }
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow-y: hidden;
  /* align-items: center; */
  justify-content: center;
  max-width: 320px;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 100px;
}
.new-section {
  width: 100%;
  padding: 0;
}
.open-section {
  width: 100%;
  padding: 20px 0;
  border-top: 1px solid #e5e7eb;
}
.open-section .open-btn {
  background: #ede9fe;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
</style>

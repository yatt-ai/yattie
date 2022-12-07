<template>
  <v-container class="wrapper">
    <div class="content">
      <div class="logo mb-10">
        <LogoWrapper :height="34" :width="120" />
      </div>
      <div class="new-section">
        <div class="subtitle-1 signup-title text-center">
          Sign up to test apps
        </div>
        <v-btn
          class="my-4 text-capitalize"
          fill
          block
          small
          color="primary"
          to="/authentication/signup2"
        >
          Sign UP
        </v-btn>
        <v-btn
          class="my-4 text-capitalize"
          fill
          small
          block
          color="white"
          to="/authentication/signin"
        >
          Sign In
        </v-btn>
      </div>
    </div>
    <div class="footer">
      <v-alert class="terms-alert" dark>
        By signing up, you agree to our
        <span style="color: #000; font-weight: 500">Terms, Data Policy</span>
        and <span style="color: #000; font-weight: 500">Cookies Policy</span>.
      </v-alert>
    </div>
  </v-container>
</template>

<script>
import { VContainer, VBtn } from "vuetify/lib/components";
import LogoWrapper from "../LogoWrapper.vue";
import {
  IPC_HANDLERS,
  IPC_FUNCTIONS,
  STATUSES,
  // SESSION_STATUSES,
} from "../../modules/constants";
export default {
  name: "Signup1Wrapper",
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
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow-y: hidden;
  /* align-items: center; */
  max-width: 450px;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  padding-top: 30px;
}
.new-section {
  width: 100%;
  padding: 0;
}
.signup-title {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #111827;
  text-align: center;
}
.footer {
  flex-grow: 0;
}
.terms-alert {
  background-color: #f3f4f6;
  border-radius: 6px;
  padding: 16px 40px;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: #6b7280;
  letter-spacing: 1px;
}
</style>

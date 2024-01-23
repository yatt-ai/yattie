<template>
  <div class="app-wrapper">
    <component :is="layout">
      <router-view />
    </component>
    <ResetSessionDialog
      v-if="renderRestoreSessionDialog"
      :text="$t('message.confirm_reset_session')"
      v-model="showRestoreSessionDialog"
      @confirm="restoreSession"
      @cancel="clearSession"
    />
  </div>
</template>

<script>
import ResetSessionDialog from "@/components/dialogs/ResetSessionDialog.vue";
import ResetConfirmDialog from "@/components/dialogs/ResetConfirmDialog.vue";

const default_layout = "default";

export default {
  name: "App",
  components: { ResetConfirmDialog, ResetSessionDialog },
  data() {
    return {
      showRestoreSessionDialog: false,
      renderRestoreSessionDialog: false,
      stateToRestore: {},
    };
  },
  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + "-layout";
    },
  },
  async created() {
    if (this.$router.history.current.path === "/") {
      this.renderRestoreSessionDialog = true;
    }

    const config = await this.$storageService.getConfig();
    this.$store.commit("config/setFullConfig", config);

    const credentials = await this.$storageService.getCredentials();
    this.$store.commit("auth/setCredentials", credentials);
    if (this.$isElectron) {
      // todo remove this check when $integrationHelpers will support REST API
      await this.updateAuth();
    }
  },
  async mounted() {
    if (this.renderRestoreSessionDialog) {
      this.stateToRestore = await this.$storageService.getState();
      if (Object.keys(this.stateToRestore).length && this.stateToRestore.id) {
        this.showRestoreSessionDialog = true;
      }
    }
  },
  methods: {
    async restoreSession() {
      await this.$store.commit("restoreState", this.stateToRestore);
      const currentPath = this.$router.history.current.path;
      if (
        this.stateToRestore.path &&
        currentPath !== this.stateToRestore.path
      ) {
        if (this.stateToRestore.path.includes("result") && this.$isElectron) {
          this.$electronService.setWindowSize({ width: 1440, height: 900 });
        }
        await this.$router.push({ path: this.stateToRestore.path });
      }
      this.showRestoreSessionDialog = false;
    },
    async clearSession() {
      this.$store.commit("clearState");
      await this.$storageService.resetData();
      if (this.$router.history.current.path !== "/") {
        await this.$router.push("/");
      }
      this.showRestoreSessionDialog = false;
    },
    async updateAuth() {
      if (
        this.$store.getters["auth/credentials"] &&
        Object.entries(this.$store.getters["auth/credentials"]).length > 0
      ) {
        let authCheckResponse = await this.$integrationHelpers.checkAuth(
          this.$store.getters["auth/credentials"]
        );
        this.$store.commit("auth/setIsAuthenticated", authCheckResponse.authed);
        if (authCheckResponse.failedAuth?.length > 0) {
          // TODO - Prompt the user if they'd like to remove the failing cred
          let message = "";
          for (const failedCred of authCheckResponse.failedAuth) {
            message += `${failedCred.credentialType} `;
          }
          message += this.$tc("message.integrations_expired", 1);
          this.setSnackBar(message);
        }
      }
    },
  },
};
</script>
<style scoped>
.app-wrapper {
  width: 100%;
  height: 100vh;
  background: transparent;
}
</style>

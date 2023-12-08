<template>
  <div class="app-wrapper">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
const default_layout = "default";

export default {
  name: "App",
  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + "-layout";
    },
  },
  async beforeCreate() {
    // Only restore state for the primary window that opens at HomeView
    if (this.$router.history.current.path === "/") {
      const state = await this.$storageService.getState();
      if (Object.keys(state).length) {
        this.$store.commit("restoreState", state);
        const currentPath = this.$router.history.current.path;
        if (state.path && currentPath !== state.path) {
          if (state.path.includes("result") && this.$isElectron) {
            this.$electronService.setWindowSize({ width: 1440, height: 900 });
          }
          await this.$router.push({ path: state.path });
        }
      }
    }
  },
  async created() {
    const config = await this.$storageService.getConfig();
    this.$store.commit("config/setFullConfig", config);

    const credentials = await this.$storageService.getCredentials();
    this.$store.commit("auth/setCredentials", credentials);
    if (this.$isElectron) {
      // todo remove this check when $integrationHelpers will support REST API
      await this.updateAuth();
    }
  },
  methods: {
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

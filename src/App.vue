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

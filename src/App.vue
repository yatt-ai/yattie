<template>
  <div class="app-wrapper">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import { IPC_HANDLERS, IPC_FUNCTIONS } from "./modules/constants";

const default_layout = "default";

export default {
  name: "App",
  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + "-layout";
    },
  },
  beforeCreate() {
    // Only restore state for the primary window that opens at HomeView
    if (this.$router.history.current.path === "/") {
      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.GET_STATE,
        })
        .then((state) => {
          if (Object.keys(state).length > 0) {
            this.$store.commit("restoreState", state);
            const currentPath = this.$router.history.current.path;
            if (state.path && currentPath !== state.path) {
              if (state.path.includes("result")) {
                window.ipc.invoke(IPC_HANDLERS.WINDOW, {
                  func: IPC_FUNCTIONS.SET_WINDOW_SIZE,
                  data: {
                    width: 1440,
                    height: 900,
                  },
                });
              }
              this.$router.push({ path: state.path });
            }
          }
        });
    }
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

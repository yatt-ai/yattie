<template>
  <v-app>
    <v-main>
      <v-overlay :absolute="true" :value="overlay"> </v-overlay>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";
export default {
  name: "DefaultLayout",

  data: () => ({
    overlay: false,
  }),
  mounted() {
    if (!window.ipc) return;

    window.ipc.on("OPEN_CHILD_WINDOW", () => {
      this.overlay = true;
      this.$forceUpdate();
    });
    window.ipc.on("CLOSE_CHILD_WINDOW", ({ data }) => {
      this.overlay = false;
      if (data === "add" || data === "edit") {
        const currentPath = this.$router.history.current.path;
        if (currentPath !== "/main/workspace") {
          this.$router.push({ path: "/main/workspace" });
        }
      }
      this.$forceUpdate();
    });
    window.ipc.on("APP_SETTING", async () => {
      await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
        func: IPC_FUNCTIONS.OPEN_SETTING_WINDOW,
      });
    });
    window.ipc.on("SET_THEME", ({ apperance }) => {
      const isDarkMode = apperance === "dark" ? true : false;
      this.$vuetify.theme.dark = isDarkMode;
      localStorage.setItem("isDarkMode", isDarkMode);
    });
  },
};
</script>

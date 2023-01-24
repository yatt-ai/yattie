<template>
  <v-app>
    <v-main>
      <v-overlay :absolute="true" :value="overlay"> </v-overlay>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { IPC_HANDLERS, IPC_FUNCTIONS, STATUSES } from "../modules/constants";
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

    // new session for existing test
    window.ipc.on("NEW_SESSION_TEST", async () => {
      console.log("new session for existing test");
    });

    // new session for existing charter
    window.ipc.on("NEW_SESSION_CHARTER", async () => {
      console.log("new session for existing charter");
    });

    // open session
    window.ipc.on("OPEN_SESSION", async () => {
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
        this.$store.commit("restoreState", metadata);

        const currentPath = this.$router.history.current.path;
        if (currentPath !== metadata.path) {
          this.$router.push({ path: metadata.path });
        }
      }
    });

    // save as charter
    window.ipc.on("SAVE_AS_CHARTER", async () => {
      console.log("save as charter");
    });

    // app setting
    window.ipc.on("APP_SETTING", async () => {
      await window.ipc.invoke(IPC_HANDLERS.WINDOW, {
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

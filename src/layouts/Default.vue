<template>
  <v-app :style="{ backgroundColor: currentTheme.background }">
    <v-main>
      <v-overlay :absolute="true" :value="overlay"> </v-overlay>
      <router-view :isAuthenticated="checkAuth" />
      <v-snackbar v-model="snackBar.enabled" timeout="3000">
        {{ snackBar.message }}
        <template v-slot:action="{ attrs }">
          <v-btn
            color="primary"
            text
            v-bind="attrs"
            @click="snackBar.enabled = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <AboutDialog v-model="aboutDialog" :version="aboutVersion" />
    </v-main>
  </v-app>
</template>

<script>
import { IPC_HANDLERS, IPC_FUNCTIONS, STATUSES } from "../modules/constants";
import AboutDialog from "../components/dialogs/AboutDialog.vue";
export default {
  name: "DefaultLayout",

  components: {
    AboutDialog,
  },

  data: () => ({
    aboutDialog: false,
    aboutVersion: null,
    overlay: false,
    config: {},
    credentials: {},
    checkAuth: false,
    snackBar: {
      enabled: false,
      message: "",
    },
  }),
  created() {
    this.getConfig();
    this.getCredentials().then(() => {
      this.updateAuth();
    });
  },
  mounted() {
    this.$root.$on("update-auth", this.updateAuth());
    this.$root.$on("overlay", (value) => {
      this.overlay = value;
    });
    this.$root.$on("close-aboutdialog", this.hideAboutDialog);

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

    window.ipc.on("CONFIG_CHANGE", () => {
      this.getConfig();
    });

    window.ipc.on("CREDENTIAL_CHANGE", () => {
      this.getCredentials();
    });

    window.ipc.on("ABOUT_DIALOG", async (version) => {
      this.aboutVersion = version;
      this.openAboutDialog();
    });
  },
  methods: {
    hideAboutDialog() {
      this.aboutDialog = false;
    },
    openAboutDialog() {
      this.aboutDialog = true;
    },
    getConfig() {
      if (!window.ipc) return;
      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, { func: IPC_FUNCTIONS.GET_CONFIG })
        .then((result) => {
          this.config = result;
        });
    },
    async updateAuth() {
      if (this.credentials && Object.entries(this.credentials).length > 0) {
        let authCheckResponse = await this.$integrationHelpers.checkAuth(
          this.credentials
        );
        this.checkAuth = authCheckResponse.authed;
        if (authCheckResponse.failedAuth?.length > 0) {
          // TODO - Prompt the user if they'd like to remove the failing cred
          let message = "";
          for (const failedCred of authCheckResponse.failedAuth) {
            message += `${failedCred.credentialType} `;
          }
          message += `integrations expired.`;
          this.snackBar.enabled = true;
          this.snackBar.message = message;
        }
      }
    },
    async getCredentials() {
      if (!window.ipc) return;
      await window.ipc
        .invoke(IPC_HANDLERS.DATABASE, { func: IPC_FUNCTIONS.GET_CREDENTIALS })
        .then((result) => {
          this.credentials = result;
        });
    },
  },
  computed: {
    currentTheme() {
      if (this.$vuetify.theme.dark) {
        return this.$vuetify.theme.themes.dark;
      } else {
        return this.$vuetify.theme.themes.light;
      }
    },
  },
};
</script>

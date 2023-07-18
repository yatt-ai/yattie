<template>
  <v-container class="wrapper">
    <div class="header">
      <div class="avatar" v-if="checkAuth">
        <MenuPopover :credential-items="credentials" />
      </div>
    </div>
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
          @click="quickTest()"
        >
          {{ $tc("caption.quick_test", 1) }}
        </v-btn>
      </div>
      <div class="open-section">
        <v-btn
          class="text-capitalize"
          fill
          block
          small
          color="primary"
          to="main"
        >
          {{ $tc("caption.new_exploratory_session", 1) }}
        </v-btn>
        <v-btn
          block
          plain
          color="primary"
          small
          class="mt-4 text-capitalize open-btn"
          @click="openSession()"
        >
          {{ $tc("caption.open_exploratory_session", 1) }}
        </v-btn>
      </div>
      <div class="open-section">
        <v-btn
          class="text-capitalize"
          fill
          small
          block
          color="primary"
          to="authentication/signin"
        >
          {{ $tc("caption.sign_in_with", 1) }}..
        </v-btn>
      </div>
      <div class="open-section social">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <button class="social-btn">
              <img
                :src="require('../assets/icon/jira.svg')"
                width="50"
                v-bind="attrs"
                v-on="on"
              />
              <div
                class="overlay"
                v-if="!loggedInServices.jira"
                v-on="on"
              ></div>
            </button>
          </template>
          <span>
            {{
              loggedInServices.jira
                ? $tc("caption.logged_in_jira", 1)
                : $tc("caption.not_logged_in_jira", 1)
            }}
          </span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <button class="social-btn">
              <img
                :src="require('../assets/icon/testrail.svg')"
                width="60"
                v-bind="attrs"
                v-on="on"
              />
              <div
                class="overlay"
                v-if="!loggedInServices.testrail"
                v-on="on"
              ></div>
            </button>
          </template>
          <span>
            {{
              loggedInServices.testrail
                ? $tc("caption.logged_in_testrail", 1)
                : $tc("caption.not_logged_in_testrail", 1)
            }}
          </span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <button class="social-btn">
              <img
                :src="require('../assets/icon/qtest.svg')"
                width="50"
                v-bind="attrs"
                v-on="on"
              />
              <div
                class="overlay"
                v-if="!loggedInServices.qtest"
                v-on="on"
              ></div>
            </button>
          </template>
          <span>
            {{
              loggedInServices.qtest
                ? $tc("caption.logged_in_qtest", 1)
                : $tc("caption.not_logged_in_qtest", 1)
            }}
          </span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <button class="social-btn">
              <img
                :src="require('../assets/icon/practitest.svg')"
                width="60"
                v-bind="attrs"
                v-on="on"
              />
              <div
                class="overlay"
                v-if="!loggedInServices.practitest"
                v-on="on"
              ></div>
            </button>
          </template>
          <span>
            {{
              loggedInServices.practitest
                ? $tc("caption.logged_in_practitest", 1)
                : $tc("caption.not_logged_in_practitest", 1)
            }}
          </span>
        </v-tooltip>
      </div>
    </div>
  </v-container>
</template>
<script>
import { VContainer, VBtn } from "vuetify/lib/components";
import LogoWrapper from "../components/LogoWrapper.vue";
import MenuPopover from "../components/MenuPopover.vue";

import { IPC_HANDLERS, IPC_FUNCTIONS, STATUSES } from "../modules/constants";
export default {
  name: "HomeView",
  components: {
    VContainer,
    VBtn,
    LogoWrapper,
    MenuPopover,
  },
  props: {
    isAuthenticated: {
      type: Boolean,
      default: () => false,
    },
  },
  watch: {
    isAuthenticated: function (newValue) {
      this.checkAuth = newValue;
    },
  },
  data() {
    return {
      config: {},
      credentials: {},
      checkAuth: this.isAuthenticated,
      loggedInServices: {},
      showMenu: false,
    };
  },
  created() {
    this.getConfig();
    this.getCredentials();
  },
  mounted() {
    if (!window.ipc) return;

    window.ipc.on("CONFIG_CHANGE", () => {
      this.getConfig();
    });

    window.ipc.on("CREDENTIAL_CHANGE", () => {
      this.getCredentials();
    });

    // New session
    window.ipc.on("NEW_SESSION", () => {
      if (this.$router.history.current.path === "/") {
        this.$router.push("/main");
      }
    });
  },
  methods: {
    getConfig() {
      if (!window.ipc) return;

      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, { func: IPC_FUNCTIONS.GET_CONFIG })
        .then((result) => {
          this.config = result;
        });
    },
    getCredentials() {
      if (!window.ipc) return;

      window.ipc
        .invoke(IPC_HANDLERS.DATABASE, { func: IPC_FUNCTIONS.GET_CREDENTIALS })
        .then((result) => {
          this.credentials = result;
          for (const credentialType of Object.keys(this.credentials)) {
            if (this.credentials[credentialType].length > 0) {
              this.loggedInServices[credentialType] = true;
            }
          }
        });
    },
    async openSession() {
      if (!window.ipc) return;

      const { status, message, state } = await window.ipc.invoke(
        IPC_HANDLERS.FILE_SYSTEM,
        {
          func: IPC_FUNCTIONS.OPEN_SESSION,
        }
      );

      if (status === STATUSES.ERROR) {
        this.$root.$emit("set-snackbar", message);
        console.log(message);
      } else {
        this.$store.commit("restoreState", state);

        const currentPath = this.$router.history.current.path;
        if (currentPath !== state.path) {
          this.$router.push({ path: state.path });
        }
      }
    },
    quickTest() {
      this.$store.commit("setQuickTest", true);
      this.$router.push("/main/workspace");
    },
  },
};
</script>

<style scoped>
.wrapper {
  height: 100vh;
  width: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: flex-start;
  max-width: 320px;
}
.header {
  width: 100%;
  flex-grow: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: 15px;
  padding: 10px 0;
}
.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 50px;
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
.theme--dark .open-section {
  border-color: rgba(255, 255, 255, 0.15);
}
.open-section.social {
  display: flex;
  align-items: center;
  column-gap: 10px;
  padding: 10px 0;
}
.open-section .open-btn {
  background: #ede9fe;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
.social-btn {
  flex: 1;
  background-color: transparent !important;
  border: 0;
  outline: 0;
  box-shadow: none;
  position: relative;
}
.social-btn::before:hover,
.social-btn:hover {
  background-color: transparent !important;
}
.social-btn.inactive .overlay {
  display: block;
}
.social-btn .overlay {
  position: absolute;
  display: block;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
}
.theme--dark .overlay {
  background-color: rgba(31, 41, 55, 0.8);
}
</style>

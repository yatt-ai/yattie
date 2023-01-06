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
            <button class="social-btn" :class="{ inactive: !loggedInWithJira }">
              <img
                :src="require('../assets/icon/jira.svg')"
                width="50"
                v-bind="attrs"
                v-on="on"
              />
              <div class="overlay" v-on="on"></div>
            </button>
          </template>
          <span>
            {{
              loggedInWithJira
                ? $tc("caption.logged_in_jira", 1)
                : $tc("caption.not_logged_in_jira", 1)
            }}
          </span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <button
              class="social-btn"
              :class="{ inactive: !loggedInWithTestRail }"
            >
              <img
                :src="require('../assets/icon/testrail.svg')"
                width="60"
                v-bind="attrs"
                v-on="on"
              />
              <div class="overlay" v-on="on"></div>
            </button>
          </template>
          <span>
            {{
              loggedInWithTestRail
                ? $tc("caption.logged_in_testrail", 1)
                : $tc("caption.not_logged_in_testrail", 1)
            }}
          </span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <button
              class="social-btn"
              :class="{ inactive: !loggedInWithQTest }"
            >
              <img
                :src="require('../assets/icon/qtest.svg')"
                width="50"
                v-bind="attrs"
                v-on="on"
              />
              <div class="overlay" v-on="on"></div>
            </button>
          </template>
          <span>
            {{
              loggedInWithQTest
                ? $tc("caption.logged_in_qtest", 1)
                : $tc("caption.not_logged_in_qtest", 1)
            }}
          </span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <button
              class="social-btn"
              :class="{ inactive: !loggedInWithPractiTest }"
            >
              <img
                :src="require('../assets/icon/practitest.svg')"
                width="60"
                v-bind="attrs"
                v-on="on"
              />
              <div class="overlay" v-on="on"></div>
            </button>
          </template>
          <span>
            {{
              loggedInWithPractiTest
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
import {
  IPC_HANDLERS,
  IPC_FUNCTIONS,
  STATUSES,
  SESSION_STATUSES,
} from "../modules/constants";
export default {
  name: "HomeView",
  components: {
    VContainer,
    VBtn,
    LogoWrapper,
  },
  data() {
    return {
      loggedInWithJira: false,
      loggedInWithTestRail: false,
      loggedInWithQTest: false,
      loggedInWithPractiTest: false,
    };
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
    quickTest() {
      this.$store.commit("updateSession", {
        status: SESSION_STATUSES.PAUSE,
        timer: 0,
        duration: 0,
      });
      this.$store.commit("setQuickTest", true);
      this.$router.push("/main/workspace");
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
</style>

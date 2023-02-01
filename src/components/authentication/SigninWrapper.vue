<template>
  <v-container class="wrapper">
    <div class="header py-4">
      <v-btn class="text-capitalize pa-0 back-btn" plain @click="back()">
        <v-icon class="ma-0">mdi-chevron-left</v-icon>
        {{ $tc("caption.back", 1) }}
      </v-btn>
      <div class="subtitle-1 signup-title text-center">
        <span>{{ $tc("caption.sign_in", 1) }}</span>
      </div>
    </div>
    <div class="content mt-2">
      <div class="loading-wrapper" v-if="loading">
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
      <v-row>
        <v-col cols="12">
          <!--<v-btn class="mb-4 outline-btn yattie" block outlined color="white">
            <img :src="require('../../assets/icon/yattie1.png')" />
            <div class="btn-text">{{ $tc("caption.signin_yattie", 1) }}</div>
          </v-btn>-->
          <v-btn
            class="mb-4 outline-btn jira"
            block
            outlined
            color="white"
            @click="callJiraAPI"
          >
            <img :src="require('../../assets/icon/jira.png')" />
            <div class="btn-text">{{ $tc("caption.signin_jira", 1) }}</div>
          </v-btn>
          <!--<v-btn class="mb-4 outline-btn" block outlined color="white">
            <img :src="require('../../assets/icon/testrail.png')" />
            <div class="btn-text">{{ $tc("caption.signin_testrail", 1) }}</div>
          </v-btn>
          <v-btn class="mb-4 outline-btn" block outlined color="white">
            <img :src="require('../../assets/icon/qtest.png')" />
            <div class="btn-text">{{ $tc("caption.signin_qtest", 1) }}</div>
          </v-btn>
          <v-btn class="mb-4 outline-btn" block outlined color="white">
            <img :src="require('../../assets/icon/practitest.png')" />
            <div class="btn-text">
              {{ $tc("caption.signin_practitest", 1) }}
            </div>
          </v-btn>-->
        </v-col>
      </v-row>
      <!-- <v-row>
        <v-col cols="12" class="divider">
          <span></span>
          <div class="divider-text">Or</div>
          <span></span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="d-flex justify-center align-center">
          <div class="text-center signup-text">Don't have an account?</div>
          <v-btn
            class="text-capitalize pa-0 signup-btn"
            color="primary"
            plain
            to="/authentication/signupMain"
          >
            {{ $tc("caption.sign_up", 1) }}
          </v-btn>
        </v-col>
      </v-row> -->
    </div>
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
  </v-container>
</template>

<script>
import axios from "axios";
import { IPC_HANDLERS, IPC_FUNCTIONS } from "../../modules/constants";
import dayjs from "dayjs";

export default {
  name: "SigninWrapper",
  components: {},
  props: {
    configItem: {
      type: Object,
      default: () => {},
    },
    credentialItem: {
      type: Object,
      default: () => {},
    },
    prevRoute: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    configItem: function (newValue) {
      this.config = newValue;
    },
    credentialItem: function (newValue) {
      this.credential = newValue;
    },
    prevRoute: function (newValue) {
      this.previousRoute = newValue;
    },
  },
  data() {
    return {
      config: this.configItem,
      credential: this.credentialItem,
      previousRoute: this.prevRoute,
      loading: false,
      snackBar: {
        enabled: false,
        message: "",
      },
    };
  },
  computed: {},
  mounted() {
    window.ipc.on("JIRA_LOGIN", (data) => {
      this.jiraLogin(data);
    });
  },
  methods: {
    back: function () {
      window.ipc.invoke(IPC_HANDLERS.SERVER, {
        func: IPC_FUNCTIONS.STOP_SERVER,
      });

      this.$router.back();
    },
    async callJiraAPI() {
      await window.ipc
        .invoke(IPC_HANDLERS.SERVER, {
          func: IPC_FUNCTIONS.START_SERVER,
        })
        .then(async () => {
          this.loading = true;
          this.$root.$emit("overlay", true);
          const url = `http://localhost:${process.env.VUE_APP_SERVER_PORT}/oauth2/atlassian`;
          await axios
            .get(url)
            .then((response) => {
              this.loading = false;
              this.$root.$emit("overlay", false);
              if (response.status !== 200) {
                this.snackBar.enabled = true;
                this.snackBar.message = response.data.message
                  ? response.data.message
                  : "API Error";
              }
            })
            .catch((error) => {
              this.loading = false;
              this.$root.$emit("overlay", false);
              this.snackBar.enabled = true;
              this.snackBar.message = error.message
                ? error.message
                : "API Error";
            });
        })
        .catch((error) => {
          this.snackBar.enabled = true;
          this.snackBar.message = error ? error : "Failed start server";
        });
    },
    async jiraLogin(data) {
      this.loading = true;
      this.$root.$emit("overlay", true);
      const header = {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          Accept: "application/json",
        },
      };

      await axios
        .get(
          "https://api.atlassian.com/oauth/token/accessible-resources",
          header
        )
        .then(async (response) => {
          await axios
            .get("https://api.atlassian.com/me", header)
            .then((user) => {
              const date = dayjs().format("MM/DD/YYYY HH:mm:ss");
              const jiraData = {
                ...data,
                loggedAt: date,
                resource: response.data[0],
                profile: user.data,
              };

              if (!this.credential) {
                this.credential = {};
              }

              this.credential.type = "jira";
              this.credential.jira = jiraData;

              window.ipc.invoke(IPC_HANDLERS.DATABASE, {
                func: IPC_FUNCTIONS.UPDATE_CREDENTIAL,
                data: this.credential,
              });

              setTimeout(() => {
                this.loading = false;
                this.$root.$emit("overlay", false);

                window.ipc.invoke(IPC_HANDLERS.SERVER, {
                  func: IPC_FUNCTIONS.STOP_SERVER,
                });

                this.$router.push({ path: this.previousRoute.path });
              }, 1000);
            })
            .catch((error) => {
              this.snackBar.enabled = true;
              this.snackBar.message = error.message
                ? error.message
                : "API Error";
            });
        })
        .catch((error) => {
          this.snackBar.enabled = true;
          this.snackBar.message = error.message ? error.message : "API Error";
        });
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
  overflow-y: auto;
  max-width: 450px;
}
.header {
  display: flex;
  align-items: center;
  padding: 12px;
}
.header .back-btn {
  flex-grow: 0;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
}
.header .signup-title {
  flex-grow: 1;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #111827;
  text-align: center;
}
.header .signup-title span {
  margin-left: -50px;
}
.content {
  position: relative;
  background-color: #fff;
  border-radius: 8px;
  padding: 32px 40px;
}
.outline-btn {
  display: flex;
  border: 1px solid #d1d5db;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  text-transform: none !important;
}
.outline-btn:hover {
  background-color: #d1d5db;
}
.outline-btn .btn-text {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #111827;
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
}
.divider {
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 5px;
}
.divider span {
  flex-grow: 1;
  height: 1px;
  background-color: #d1d5db;
}
.divider-text {
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
}
.signup-text {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  color: #6b7280;
}
.signup-btn {
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  color: #6d28d9;
}

.loading-wrapper {
  position: absolute;
  overflow: hidden;
  z-index: 9999999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

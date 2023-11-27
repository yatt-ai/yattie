<template>
  <v-container class="wrapper">
    <div class="header py-4">
      <v-btn class="text-capitalize pa-0 back-btn" plain @click="back()">
        <v-icon class="ma-0">mdi-chevron-left</v-icon>
        {{ $tc("caption.back", 1) }}
      </v-btn>
      <div
        class="subtitle-1 signup-title text-center"
        :style="{ color: currentTheme.secondary }"
      >
        <span>{{ $tc("caption.signin_jira", 1) }}</span>
      </div>
    </div>
    <div class="content mt-2">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row v-if="connectWithCloudOAuth">
          <v-col cols="12" class="d-flex justify-center pa-0">
            <img
              :src="require('../../assets/icon/github-mark.png')"
              alt="github"
              width="60"
            />
          </v-col>
          <v-col cols="12" class="pa-0">
            <v-btn
              class="mt-4 mb-4 text-capitalize btn_signup"
              color="primary"
              fill
              block
              :loading="loading"
              @click="signInWithCloud()"
            >
              {{ $tc("caption.signin_github", 1) }}
            </v-btn>

            <v-btn
              class="mt-4 mb-4 text-capitalize btn_signup"
              color="primary"
              outlined
              block
              :loading="loading"
              @click="useApiKey()"
            >
              {{ $tc("caption.login_with_api_key", 1) }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="connectWithApi">
          <v-col cols="12" class="d-flex justify-center pa-0">
            <img
              :src="require('../../assets/icon/jira.svg')"
              alt="jira"
              width="60"
            />
          </v-col>
          <v-col cols="12" class="pa-0">
            <div class="subtitle-2 label-text">
              {{ $tc("caption.user_name", 1) }}
            </div>
            <div class="timer-box-wrapper">
              <v-text-field
                placeholder="test@example.com"
                outlined
                dense
                v-model="userName"
                required
                :rules="rules.userName"
              />
            </div>
          </v-col>
          <v-col cols="12" class="pa-0">
            <div class="subtitle-2 label-text">
              {{ $tc("caption.api_key", 1) }}
            </div>
            <div class="timer-box-wrapper">
              <v-text-field
                outlined
                dense
                v-model="apiKey"
                required
                :rules="rules.apiKey"
              />
            </div>
          </v-col>
          <v-col cols="12" class="pa-0">
            <div class="subtitle-2 label-text">
              {{ $tc("caption.jira_instance_url", 1) }}
            </div>
            <div class="timer-box-wrapper">
              <v-text-field
                outlined
                dense
                v-model="instanceUrl"
                placeholder="mydomain.atlassian.net"
                required
                :rules="rules.instanceUrl"
              />
            </div>
          </v-col>
          <v-col cols="12" class="pa-0">
            <v-btn
              class="text-capitalize btn_signup"
              color="primary"
              fill
              small
              block
              :loading="loading"
              @click="signInWithApiKey()"
            >
              {{ $tc("caption.sign_in", 1) }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
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
import dayjs from "dayjs";
import uuidv4 from "uuid";
import { Buffer } from "buffer";
import { IPC_HANDLERS, IPC_FUNCTIONS } from "../../modules/constants";
import yattIntegrationHelper from "../../integrations/YattIntegrationHelpers";
import integrationHelper from "../../integrations/IntegrationHelpers";
import githubIntegrationHelper from "../../integrations/GithubHelpers";
export default {
  name: "SigninGithubWrapper",
  props: {
    configItem: {
      type: Object,
      default: () => {},
    },
    credentialItems: {
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
    credentialItems: function (newValue) {
      this.credentials = newValue;
    },
    prevRoute: function (newValue) {
      this.previousRoute = newValue;
    },
  },
  data() {
    return {
      config: this.configItem,
      credentials: this.credentialItems,
      previousRoute: this.prevRoute,
      connectWithCloudOAuth: true,
      connectWithApi: false,
      connectWithServerOAuth: false,
      clientId: "",
      clientSecret: "",
      userName: "",
      apiKey: "",
      instanceUrl: "",
      loading: false,
      valid: true,
      rules: {
        clientId: [
          (v) =>
            !!v ||
            this.$i18n.t("message.client_id") +
              this.$i18n.t("message.is_required"),
        ],
        clientSecret: [
          (v) =>
            !!v ||
            this.$i18n.t("message.client_secret") +
              this.$i18n.t("message.is_required"),
        ],
        userName: [
          (v) =>
            !!v ||
            this.$i18n.t("message.user_name") +
              this.$i18n.t("message.is_required"),
          (v) =>
            !v ||
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            "Username must be valid",
        ],
        apiKey: [
          (v) =>
            !!v ||
            this.$i18n.t("message.api_key") +
              this.$i18n.t("message.is_required"),
        ],
        instanceUrl: [
          (v) =>
            !!v ||
            this.$i18n.t("message.instance_url") +
              this.$i18n.t("message.is_required"),
        ],
      },
      snackBar: {
        enabled: false,
        message: "",
      },
    };
  },
  mounted() {
    window.ipc.on("JIRA_LOGIN", (data) => {
      this.postLogin(data);
    });
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
  methods: {
    back() {
      if (this.connectWithServerOAuth) {
        window.ipc.invoke(IPC_HANDLERS.SERVER, {
          func: IPC_FUNCTIONS.STOP_SERVER,
        });
      }

      if (this.previousRoute.path.includes("setting")) {
        this.$router.push({ path: this.previousRoute.path });
      } else {
        this.$router.back();
      }
    },
    openExternalLink(url) {
      window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
        func: IPC_FUNCTIONS.OPEN_EXTERNAL_LINK,
        data: url,
      });
    },
    useServerOAuth() {
      this.connectWithCloudOAuth = false;
      this.connectWithApi = false;
      this.connectWithServerOAuth = true;
    },
    useApiKey() {
      this.connectWithCloudOAuth = false;
      this.connectWithApi = true;
      this.connectWithServerOAuth = false;
    },
    async signInWithServer() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        this.loading = true;
        this.$root.$emit("overlay", true);
        const codeVerifier = integrationHelper.generateCodeVerifier();
        const codeChallenge =
          await integrationHelper.generateCodeChallengeFromVerifier(
            codeVerifier
          );
        await window.ipc
          .invoke(IPC_HANDLERS.SERVER, {
            func: IPC_FUNCTIONS.START_SERVER,
            data: {
              clientId: this.clientId,
              clientSecret: this.clientSecret,
              url: this.instanceUrl,
              codeVerifier: codeVerifier,
              codeChallenge: codeChallenge,
            },
          })
          .then(async () => {
            this.loading = true;
            this.$root.$emit("overlay", true);

            const url = `http://localhost:${process.env.VUE_APP_SERVER_PORT}/oauth2/atlassian`;

            await axios
              .get(url)
              .then(async (response) => {
                await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
                  func: IPC_FUNCTIONS.OPEN_EXTERNAL_LINK,
                  data: response.data,
                });
                this.loading = false;
                this.$root.$emit("overlay", false);
                if (response.status !== 200) {
                  this.snackBar.enabled = true;
                  this.snackBar.message = response.data.message
                    ? response.data.message
                    : this.$tc("message.api_error", 1);
                }
              })
              .catch((error) => {
                this.loading = false;
                this.$root.$emit("overlay", false);
                this.snackBar.enabled = true;
                this.snackBar.message = error.message
                  ? error.message
                  : this.$tc("message.api_error", 1);
              });
          })
          .catch((error) => {
            this.snackBar.enabled = true;
            this.snackBar.message = error ? error : "Failed start server";
          });
      }
    },
    async signInWithCloud() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        this.loading = true;
        this.$root.$emit("overlay", true);
        const yattURL = "http://localhost:5000"; //`${process.env.VUE_APP_YATT_API_URL}`;
        const redirectURL = `${yattURL}/v1/app/oauth/github/`;
        const scopes = "repo user gist";
        const clientId = "Iv1.c84b6b2ba3cb1b0f"; //`${process.env.OAUTH_GITHUB_CLIENT_ID}`;
        const serverURL = "https://github.com";
        const tokenId = uuidv4();
        const state = encodeURIComponent(`https://github.com;${tokenId}`);
        const url = `${serverURL}/login/oauth/authorize?client_id=${clientId}&scope=${scopes}&state=${state}&redirect_uri=${redirectURL}`;

        console.log(url);
        await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
          func: IPC_FUNCTIONS.OPEN_EXTERNAL_LINK,
          data: url,
        });

        const wait = function (period) {
          return new Promise((resolve) => {
            setTimeout(resolve, period);
          });
        };

        const pollForToken = async (creds) => {
          await wait(3500);
          const tokenURL = `${yattURL}/v1/app/oauth/github/token/${tokenId}`;
          let header = {};
          if (creds?.yatt?.length > 0 && creds?.yatt[0]?.accessToken) {
            header.headers = {
              Authorization: `Bearer ${creds.yatt[0].accessToken}`,
              Accept: "application/json",
            };
          }

          for (let count = 0; count < 30; count++) {
            let response;
            try {
              response = await axios.get(tokenURL, header);
            } catch (err) {
              response = err.response;
            }

            if (response.status === 200) {
              return response;
            }
            await wait(1500);
          }
          return { status: 500, message: "Timed out polling for token." };
        };
        let finalResponse = await pollForToken(this.credentials);
        if (finalResponse.status !== 200) {
          this.loading = false;
          this.$root.$emit("overlay", false);
          this.snackBar.enabled = true;
          this.snackBar.message = finalResponse.message
            ? finalResponse.message
            : this.$tc("caption.log_in_failed", 1);
        } else {
          if (finalResponse?.data?.github) {
            finalResponse.data.github.yattOauthTokenId = tokenId;
            finalResponse.data.github.type = "oauth";
          }
          if (finalResponse?.data?.yatt) {
            finalResponse.data.yatt.oauthTokenIds = [tokenId];
          } else {
            // If we don't get any YATT data back, then we must have used an
            //   API key for access, so just update our current creds with the
            //   new oauth token ID and pass them along to be saved.
            let tempCredentials = this.credentials;
            if (tempCredentials.yatt[0].oauthTokenIds) {
              tempCredentials.yatt[0].oauthTokenIds.push(tokenId);
            } else {
              tempCredentials.yatt[0].oauthTokenIds = [tokenId];
            }
            await window.ipc.invoke(IPC_HANDLERS.DATABASE, {
              func: IPC_FUNCTIONS.UPDATE_CREDENTIALS,
              data: tempCredentials,
            });
          }
          this.postLogin(finalResponse.data);
        }
      }
    },
    async signInWithApiKey() {
      this.postLogin({
        jira: {
          type: "basic",
          accessToken: Buffer.from(this.userName + ":" + this.apiKey).toString(
            "base64"
          ),
          url: this.instanceUrl,
        },
      });
    },
    async postLogin(data) {
      if (data.yatt) {
        const date = dayjs().format("YYYY-MM-DD HH:mm:ss");
        const yattData = {
          ...data.yatt,
          type: "bearer",
          loggedInAt: date,
        };

        this.credentials = yattIntegrationHelper.saveCredentials(
          this.credentials,
          yattData
        );
      }

      if (data.github) {
        let header = {};
        if (data.github.accessToken) {
          let authHeader = `Bearer ${data.github.accessToken}`;
          header.headers = {
            Authorization: authHeader,
            Accept: "application/json",
          };

          await axios
            .get("https://api.github.com/user", header)
            .then((user) => {
              if (user && user.data) {
                console.log(user);
                const date = dayjs().format("YYYY-MM-DD HH:mm:ss");
                const githubData = {
                  ...data.github,
                  loggedInAt: date,
                  profile: user.data,
                };

                this.credentials = githubIntegrationHelper.saveCredentials(
                  this.credentials,
                  githubData
                );

                setTimeout(() => {
                  this.loading = false;
                  this.$root.$emit("overlay", false);
                  this.$router.push({ path: this.previousRoute.path });
                }, 1000);
              }
            })
            .catch((error) => {
              this.snackBar.enabled = true;
              this.snackBar.message = error.message
                ? error.message
                : this.$i18n.t("message.api_error");
            });
        } else {
          this.snackBar.enabled = true;
          this.snackBar.message = this.$i18n.t("message.api_error");
        }
      }
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
  background-color: #fff;
  border-radius: 8px;
  padding: 32px 40px;
}
</style>

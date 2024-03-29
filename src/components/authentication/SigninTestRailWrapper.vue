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
        <span>{{ $tc("caption.signin_testrail", 1) }}</span>
      </div>
    </div>
    <div class="content mt-2">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
          <v-col cols="12" class="d-flex justify-center pa-0">
            <img
              :src="require('../../assets/icon/testrail.png')"
              alt="testrail"
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
                v-model="username"
                required
                :rules="rules.username"
              />
            </div>
          </v-col>
          <v-col cols="12" class="pa-0">
            <div class="subtitle-2 label-text">
              {{ $tc("caption.api_key", 1) }}
            </div>
            <div class="timer-box-wrapper">
              <v-text-field
                :append-icon="showEye ? 'mdi-eye' : 'mdi-eye-off'"
                outlined
                dense
                :type="showEye ? 'text' : 'password'"
                v-model="apiKey"
                required
                :rules="rules.apiKey"
                @click:append="showEye = !showEye"
              />
            </div>
          </v-col>
          <v-col cols="12" class="pa-0">
            <div class="subtitle-2 label-text">
              {{ $tc("caption.testrail_instance_url", 1) }}
            </div>
            <div class="timer-box-wrapper">
              <v-text-field
                outlined
                dense
                v-model="instanceUrl"
                placeholder="mydomain.testrail.io"
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
              @click="signIn()"
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
import testrailIntegrationHelper from "../../integrations/TestRailIntegrationHelpers";
export default {
  name: "SigninTestRailWrapper",
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
      username: "",
      apiKey: "",
      instanceUrl: "",
      showEye: false,
      loading: false,
      valid: true,
      rules: {
        username: [
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
      if (this.previousRoute.path.includes("setting")) {
        this.$router.push({ path: this.previousRoute.path });
      } else {
        this.$router.back();
      }
    },
    async signIn() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        this.postLogin({
          testrail: {
            type: "basic",
            accessToken: Buffer.from(
              this.username + ":" + this.apiKey
            ).toString("base64"),
            url: this.instanceUrl,
          },
        });
      }
    },
    async postLogin(data) {
      console.log(data); //TODO - Abstract this to helper.

      let header = {
        headers: {
          Authorization: `Basic ${data.testrail.accessToken}`,
          Accept: "application/json",
        },
      };

      await axios
        .get(
          `https://${data.testrail.url}/index.php?/api/v2/get_current_user`,
          header
        )
        .then((user) => {
          const date = dayjs().format("YYYY-MM-DD HH:mm:ss");
          const testrailData = {
            ...data.testrail,
            loggedInAt: date,
            profile: {
              account_id: user.data.id,
              email: user.data.email,
              name: user.data.name,
            }, //TODO - We format this here and in the integration helper. We
          }; //         need to simplify across all integrations.

          this.credentials = testrailIntegrationHelper.saveCredentials(
            this.credentials,
            testrailData
          );

          setTimeout(() => {
            this.loading = false;
            this.$root.$emit("overlay", false);
            this.$router.push({ path: this.previousRoute.path });
          }, 1000);
        })
        .catch((error) => {
          this.snackBar.enabled = true;
          this.snackBar.message = error.message
            ? error.message
            : this.$i18n.t("message.api_error");
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
  background-color: #fff;
  border-radius: 8px;
  padding: 32px 40px;
}
</style>

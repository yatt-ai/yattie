<template>
  <v-dialog
    v-bind="$attrs"
    v-on="$listeners"
    persistent
    width="50%"
    max-width="600px"
  >
    <v-sheet rounded :style="{ backgroundColor: currentTheme.background }">
      <v-card :style="{ backgroundColor: currentTheme.background }">
        <v-card-text class="text" :style="{ color: currentTheme.secondary }">
          <v-form
            role="profileForm"
            @submit.prevent="handleConfirm()"
            id="form"
          >
            <!--<v-text-field
              :label="$t('username')"
              name="username"
              :rules="usernameValidation"
              v-model="user.handle"
              @input="usernameInUse"
              :error-messages="error"
              id="username"
            ></v-text-field>-->
            <v-text-field
              :label="$t('firstName')"
              name="First name"
              :rules="nameValidation"
              v-model="user.first_name"
              id="firstname"
              required
            ></v-text-field>
            <v-text-field
              :label="$t('lastName')"
              name="Last name"
              :rules="nameValidation"
              v-model="user.last_name"
              id="lastname"
              required
            ></v-text-field>
            <v-text-field
              :label="$t('email')"
              name="email"
              :rules="emailValidation"
              v-model="user.email"
              id="email"
              required
            />
            <v-text-field
              v-if="!existing"
              :label="$t('password')"
              name="password"
              type="password"
              :rules="passwordValidation"
              v-model="user.password"
              id="password"
            ></v-text-field>
            <v-btn
              small
              :color="currentTheme.primary"
              class="text-capitalize btn"
              :style="{ color: currentTheme.white }"
              v-shortkey="confirmHotkey"
              @shortkey="handleConfirm()"
              @click="handleConfirm()"
            >
              {{ $t("signUp") }}
            </v-btn>
            <v-btn
              small
              :color="currentTheme.background"
              class="text-capitalize btn"
              :style="{ color: currentTheme.secondary }"
              v-shortkey="cancelHotkey"
              @shortkey="handleClose()"
              @click="handleClose()"
            >
              {{ $tc("caption.cancel", 1) }}
            </v-btn>

            <a @click="switchToLogin()">
              {{ $t("logintoyouraccount") }}
            </a>
          </v-form>
        </v-card-text>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";

import yattIntegrationHelper from "../../integrations/YattIntegrationHelpers";

export default {
  name: "YattProfileDialog",
  props: {},
  data() {
    return {
      user: {
        handle: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      },
      existing: false,
    };
  },
  async beforeMount() {
    if (!this.credentials.yatt || this.credentials?.yatt.length < 1) {
      await yattIntegrationHelper.newToken(this.credentials);
    }
    Object.keys(this.credentials.yatt[0].user).map((key) => {
      this.user[key] = this.credentials.yatt[0].user[key];
    });
    if (this.user.email) {
      this.existing = true;
    }
  },
  computed: {
    ...mapGetters({
      hotkeys: "config/hotkeys",
      config: "config/fullConfig",
      credentials: "auth/credentials",
    }),
    emailValidation() {
      return [
        (v) => !!v || this.$t("emailRequired"),
        (v) => /.+@.+\..+/.test(v) || this.$t("validEmail"),
      ];
    },
    nameValidation() {
      return [
        (v) => !!v || this.$t("inputRequired"),
        (v) => (v && v.length >= 2) || this.$t("min2Chars"),
      ];
    },
    passwordValidation() {
      return [
        (v) => !!v || this.$t("passwordRequired"),
        (v) => (v && v.length >= 6) || this.$t("min6Chars"),
      ];
    },
    //usernameValidation() {
    //  return [
    //    v => !!v || this.$t('requiredField'),
    //    v => /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(v) || this.$t('invalidUsername'),
    //  ];
    //},
    confirmHotkey() {
      return this.$hotkeyHelpers.findBinding("general.save", this.hotkeys);
    },
    cancelHotkey() {
      return this.$hotkeyHelpers.findBinding("general.cancel", this.hotkeys);
    },
    currentTheme() {
      if (this.$vuetify.theme.dark) {
        return this.$vuetify.theme.themes.dark;
      } else {
        return this.$vuetify.theme.themes.light;
      }
    },
  },
  methods: {
    switchToLogin() {
      this.$root.$emit("open-yattlogindialog");
      this.handleClose();
    },
    async handleConfirm() {
      const response = await yattIntegrationHelper.updateProfile(
        this.credentials,
        this.user
      );
      if (response.error) {
        // TODO emit snackbar message and also handle errors
      } else {
        this.handleClose();
      }
    },
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 400px;
  width: 100%;
  overflow-y: auto;
}

.header {
  width: 100%;
  padding: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.theme--dark .header {
  border-color: #374151;
}

.header span {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #111827;
}

.content {
  flex-grow: 1;
  overflow: auto;
  padding: 15px;
}

.footer {
  width: 100%;
  padding: 15px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: 12px;
}

.theme--dark .footer {
  border-color: #374151;
}

.session-list .session-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.session-list .session-item .session-img {
  border-radius: 4px;
  display: flex;
  width: 100%;
  background: #000;
  justify-content: center;
}

.session-list .session-item .session-img img {
  height: 100px;
  max-width: 100%;
  object-fit: contain;
}

.session-list .session-item .session-name {
  padding: 5px;
  padding-bottom: 0;
  text-align: center;
  display: flex;
  justify-content: center;
  width: 100%;
}
.session-list .session-item .session-name p {
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  text-align: center;
  color: #111827;
  margin-bottom: 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.v-input--selection-controls__input {
  width: 16px;
  height: 16px;
}
</style>

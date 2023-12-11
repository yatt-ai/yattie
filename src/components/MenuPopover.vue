<template>
  <v-menu
    v-model="showMenu"
    :close-on-content-click="false"
    :nudge-width="100"
    bottom
    z-index="99"
    offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon small v-bind="attrs" v-on="on"
        ><img :src="profileAvatar" width="32" alt="avatar"
      /></v-btn>
    </template>

    <v-card>
      <v-list
        v-for="(credentialList, credentialType) in credentials"
        :key="credentialType"
      >
        <div v-if="credentialList.length > 0 && credentialType !== 'yatt'">
          <v-subheader
            class="text-uppercase font-weight-medium"
            style="height: 32px"
            >{{ credentialType }} Account
          </v-subheader>
          <v-list-item
            v-for="(credential, cIndex) in credentialList"
            :key="cIndex"
          >
            <v-list-item-avatar
              min-width="32"
              min-height="32"
              width="32"
              height="32"
            >
              <img
                :src="
                  credential.user.avatar
                    ? credential.user.avatar
                    : 'https://www.gravatar.com/avatar/' + credential.user.name
                "
                alt="avatar"
                width="32"
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                {{ credential.user.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ credential.user.email }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon @click="openAccountLink(credentialType, credential)">
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </div>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item class="px-0">
          <v-btn
            block
            large
            text
            class="logout_btn px-0"
            style="border-radius: 0px"
            @click="logout"
            >Log out</v-btn
          >
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
<script>
import uuidv4 from "uuid";
import { mapGetters } from "vuex";

export default {
  name: "MenuPopover",
  components: {},
  props: {},
  data() {
    return {
      showMenu: false,
    };
  },
  computed: {
    ...mapGetters({
      credentials: "auth/credentials",
    }),
    profileAvatar() {
      for (const cList of Object.values(this.credentials)) {
        if (cList.length > 0) {
          if (cList[0].user.avatar !== null) {
            return cList[0].user.avatar;
          } else {
            return "https://www.gravatar.com/avatar/" + cList[0].user.name;
          }
        }
      }
      return "https://www.gravatar.com/avatar/" + uuidv4();
    },
  },
  methods: {
    async openAccountLink(credentialType, credential) {
      console.log(credentialType, credential);
      if (credentialType === "yatt") {
        const yattUrl = "https://app.yatt.ai/";
        if (this.$isElectron) {
          await this.$electronService.openExternalLink(yattUrl);
        } else {
          window.open(yattUrl, "_blank");
        }
        this.showMenu = false;
      } else if (credentialType === "jira") {
        const jiraUrl = credential.orgs[0].url;
        if (this.$isElectron) {
          await this.$electronService.openExternalLink(jiraUrl);
        } else {
          window.open(jiraUrl, "_blank");
        }
        this.showMenu = false;
      } else if (credentialType === "testrail") {
        const testRailUrl = `https://${credential.url}`;
        if (this.$isElectron) {
          await this.$electronService.openExternalLink(testRailUrl);
        } else {
          window.open(testRailUrl, "_blank");
        }
        this.showMenu = false;
      }
    },
    logout() {
      this.showMenu = false;
      const emptyCredentials = {};
      this.$store.commit("auth/setCredentials", emptyCredentials);
      this.$storageService.updateCredentials(emptyCredentials);
    },
  },
};
</script>

<template>
  <v-menu
    v-model="showMenu"
    :close-on-content-click="false"
    :nudge-width="100"
    bottom
    z-index="99999"
    offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon small v-bind="attrs" v-on="on"
        ><img :src="profile.picture" width="32" alt="avatar"
      /></v-btn>
    </template>

    <v-card>
      <v-list>
        <v-subheader
          class="text-uppercase font-weight-medium"
          style="height: 32px"
          >{{
            Object.keys(this.credential).length ? this.credential.type : ""
          }}
          Account</v-subheader
        >
        <v-list-item>
          <v-list-item-avatar
            min-width="32"
            min-height="32"
            width="32"
            height="32"
          >
            <img :src="profile.picture" alt="avatar" width="32" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ profile.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ profile.email }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon @click="openAccountLink">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
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
import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";

export default {
  name: "MenuPopover",
  components: {},
  props: {
    credentialItem: {
      type: Object,
      default: () => {},
    },
    isAuthenticated: {
      type: Boolean,
      default: () => false,
    },
  },
  watch: {
    credentialItem: function (newValue) {
      this.credential = newValue;
    },
    isAuthenticated: function (newValue) {
      this.checkAuth = newValue;
    },
  },
  data() {
    return {
      credential: this.credentialItem,
      checkAuth: this.isAuthenticated,
      showMenu: false,
    };
  },
  computed: {
    profile() {
      let profile = "";
      if (Object.keys(this.credential).length) {
        const authType = this.credential.type;
        if (authType) {
          switch (authType) {
            case "jira":
              profile = this.credential[authType].profile;
              break;
            default:
              profile = this.credential[authType].profile;
              break;
          }
        }
      }
      return profile;
    },
    resource() {
      let resource = "";
      if (Object.keys(this.credential).length) {
        const authType = this.credential.type;
        if (authType) {
          switch (authType) {
            case "jira":
              resource = this.credential[authType].resource;
              break;
            default:
              resource = this.credential[authType].resource;
              break;
          }
        }
      }
      return resource;
    },
  },
  methods: {
    async openAccountLink() {
      await window.ipc
        .invoke(IPC_HANDLERS.FILE_SYSTEM, {
          func: IPC_FUNCTIONS.OPEN_EXTERNAL_LINK,
          data: this.resource.url,
        })
        .then(() => {
          this.showMenu = false;
        });
    },
    logout() {
      this.showMenu = false;
      this.credential = {};
      window.ipc.invoke(IPC_HANDLERS.DATABASE, {
        func: IPC_FUNCTIONS.UPDATE_CREDENTIAL,
        data: this.credential,
      });
    },
  },
};
</script>

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
import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";
import uuidv4 from "uuid";

export default {
  name: "MenuPopover",
  components: {},
  props: {
    credentialItems: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    credentialItems: function (newValue) {
      this.credentials = newValue;
    },
  },
  data() {
    return {
      credentials: this.credentialItems,
      showMenu: false,
    };
  },
  computed: {
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
      if (credentialType === "yatt") {
        await window.ipc
          .invoke(IPC_HANDLERS.FILE_SYSTEM, {
            func: IPC_FUNCTIONS.OPEN_EXTERNAL_LINK,
            data: "https://app.yatt.ai/",
          })
          .then(() => {
            this.showMenu = false;
          });
      } else if (credentialType === "jira") {
        await window.ipc
          .invoke(IPC_HANDLERS.FILE_SYSTEM, {
            func: IPC_FUNCTIONS.OPEN_EXTERNAL_LINK,
            data: credential.data.resource.url,
          })
          .then(() => {
            this.showMenu = false;
          });
      }
    },
    logout() {
      this.showMenu = false;
      this.credentials = {};
      window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
        func: IPC_FUNCTIONS.UPDATE_CREDENTIALS,
        data: this.credentials,
      });
    },
  },
};
</script>

<template>
  <div class="authentication-wrapper">
    <router-view
      :config-item="config"
      :credential-items="credentials"
      :prev-route="prevRoute"
    ></router-view>
  </div>
</template>

<script>
import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";
export default {
  name: "AuthenticationView",
  components: {},
  data() {
    return {
      config: {},
      credentials: {},
      prevRoute: null,
    };
  },
  created() {
    this.getConfig();
    this.getCredentials();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  mounted() {
    window.ipc.on("CONFIG_CHANGE", () => {
      this.getConfig();
    });

    window.ipc.on("CREDENTIAL_CHANGE", () => {
      this.getCredentials();
    });
  },
  methods: {
    getConfig() {
      window.ipc
        .invoke(IPC_HANDLERS.PERSISTENCE, { func: IPC_FUNCTIONS.GET_CONFIG })
        .then((result) => {
          this.config = result;
        });
    },
    getCredentials() {
      window.ipc
        .invoke(IPC_HANDLERS.PERSISTENCE, {
          func: IPC_FUNCTIONS.GET_CREDENTIALS,
        })
        .then((result) => {
          this.credentials = result;
        });
    },
  },
};
</script>
<style scoped>
.authentication-wrapper {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15),
    0px 25px 30px rgba(0, 0, 0, 0.35);
}
</style>

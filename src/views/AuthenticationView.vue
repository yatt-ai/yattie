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
    if (this.$isElectron) {
      this.$electronService.onConfigChange(this.getConfig);
      this.$electronService.onCredentialChange(this.getCredentials);
    }
  },
  methods: {
    async getConfig() {
      const config = await this.$storageService.getConfig();
      this.$store.commit("config/setFullConfig", config);
    },
    async getCredentials() {
      const credentials = await this.$storageService.getCredentials();
      this.$store.commit("auth/setCredentials", credentials);
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

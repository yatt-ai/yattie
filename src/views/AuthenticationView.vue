<template>
  <div class="authentication-wrapper">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "AuthenticationView",
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped>
.authentication-wrapper {
  background-color: #f9f9f9;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15),
    0px 25px 30px rgba(0, 0, 0, 0.35);
}
</style>

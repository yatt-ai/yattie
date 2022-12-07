<template>
  <div class="app-wrapper">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
const default_layout = "default";

export default {
  name: "App",

  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + "-layout";
    },
  },
};
</script>
<style scoped>
.app-wrapper {
  width: 100%;
  height: 100vh;
  background: transparent;
}
</style>

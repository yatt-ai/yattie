<template>
  <v-dialog
    v-bind="$attrs"
    v-on="$listeners"
    persistent
    width="100%"
    max-width="700px"
    eager
  >
    <v-sheet outlined rounded>
      <SettingView />
    </v-sheet>
  </v-dialog>
</template>

<script>
import SettingView from "@/views/SettingView.vue";
export default {
  name: "SettingsDialog",
  components: {
    SettingView,
  },
  props: {},
  watch: {},
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>

<style scoped></style>

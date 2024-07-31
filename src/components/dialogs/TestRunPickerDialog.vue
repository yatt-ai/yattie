<template>
  <div>
    <v-btn
      block
      plain
      color="secondary"
      medium
      class="mt-4 text-capitalize secondary-btn"
      v-shortkey="scriptedTestSessionHotkey"
      @shortkey="handleScriptedTestSessionRedirect()"
      @click="handleScriptedTestSessionRedirect()"
      :disabled="!isAuthenticated || !isLoggedInToTestrail"
    >
      {{ $tc("caption.scripted_test_session", 1) }}
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TestRunPickerDialog",
  props: {
    isAuthenticated: {
      type: Boolean,
      default: true,
    },
    isLoggedInToTestrail: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  watch: {},
  computed: {
    ...mapGetters({
      hotkeys: "config/hotkeys",
      credentials: "auth/credentials",
    }),
    scriptedTestSessionHotkey() {
      return this.$hotkeyHelpers.findBinding(
        "home.scriptedTestSession",
        this.hotkeys
      );
    },
  },
  methods: {
    handleScriptedTestSessionRedirect() {
      this.$router.push("/start/scripted");
    },
  },
  mounted() {},
};
</script>

<style scoped>
.header span {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #111827;
}

.secondary-btn {
  background: #f2f4f7;
  font-weight: 700;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
</style>

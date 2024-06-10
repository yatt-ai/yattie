<template>
  <v-dialog
    v-bind="$attrs"
    v-on="$listeners"
    persistent
    width="100%"
    max-width="600px"
  >
    <v-sheet rounded :style="{ backgroundColor: currentTheme.background }">
      <div class="wrapper">
        <div class="header">
          <span :style="{ color: currentTheme.secondary }">
            {{ $tc("message.select_tests_to_execute_in_session", 1) }}
          </span>
        </div>
        <div class="content"></div>
        <div class="footer">
          <v-btn
            class="text-capitalize"
            small
            :color="currentTheme.background"
            :style="{ color: currentTheme.secondary }"
            v-shortkey="cancelHotkey"
            @shortkey="handleClose()"
            @click="handleClose()"
          >
            {{ $tc("caption.cancel", 1) }}
          </v-btn>
          <v-btn
            class="text-capitalize"
            small
            :color="currentTheme.primary"
            :style="{ color: currentTheme.white }"
            v-shortkey="confirmHotkey"
            @shortkey="handleSelect()"
            @click="handleSelect()"
          >
            {{ $tc("caption.select", 1) }}
          </v-btn>
        </div>
      </div>
    </v-sheet>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TestRunPickerDialog",
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {
    ...mapGetters({
      hotkeys: "config/hotkeys",
    }),
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
    handleClose() {
      this.$root.$emit("close-testrunpickerdialog");
    },
    handleSelect() {},
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
</style>

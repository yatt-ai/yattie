<template>
  <v-dialog
    v-bind="$attrs"
    v-on="$listeners"
    persistent
    width="350"
    style="z-index: 10"
  >
    <v-sheet outlined rounded>
      <v-card :style="{ backgroundColor: currentTheme.background }">
        <LogoWrapper :height="20" :width="60" />
        <v-card-text class="text" :style="{ color: currentTheme.secondary }">
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="text"
              :rules="textRules"
              :label="$tc('caption.node_title', 1)"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            small
            color="currentTheme.primary"
            class="text-capitalize"
            v-shortkey="confirmHotkey"
            @shortkey="handleSave()"
            @click="handleSave()"
          >
            {{ $tc("caption.save", 1) }}
          </v-btn>
          <v-btn
            small
            color="currentTheme.background"
            class="text-capitalize"
            v-shortkey="cancelHotkey"
            @shortkey="handleCancel()"
            @click="handleCancel()"
          >
            {{ $tc("caption.cancel", 1) }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script>
import LogoWrapper from "../LogoWrapper.vue";
import { mapGetters } from "vuex";
export default {
  name: "NodeEditDialog",
  components: {
    LogoWrapper,
  },
  props: {
    title: {
      type: String,
      default: () => "",
    },
  },
  watch: {
    title: function () {
      this.text = this.title;
    },
  },
  data() {
    return {
      text: "",
      valid: false,
      textRules: [(v) => !!v || "Node title is required"],
    };
  },
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
    handleCancel() {
      this.$emit("cancel");
    },
    handleSave() {
      if (this.$refs.form.validate()) {
        this.$emit("save", this.text);
        this.$refs.form.reset();
      }
    },
  },
};
</script>

<style scoped>
.v-card {
  padding: 24px;
}
.v-card__title {
  padding: 0;
  padding-top: 0.5rem;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #111827;
}
.v-card__text {
  padding: 0;
  padding-top: 0.5rem;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #6b7280;
}
.v-card__actions {
  padding: 0;
  padding-top: 1rem;
}
</style>

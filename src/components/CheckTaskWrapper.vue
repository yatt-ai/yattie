<template>
  <div class="task-wrapper">
    <div
      class="subtitle-2 label-text"
      :style="{ color: currentTheme.secondary }"
    >
      {{ $tc("caption.checklist", 1) }}
    </div>
    <div
      class="list"
      v-shortkey="checklistHotkey"
      @shortkey="$hotkeyHelpers.focusField($refs, 'form')"
    >
      <v-form ref="form" v-model="valid" lazy-validation>
        <div class="" v-for="task in tasks" :key="task.id">
          <v-checkbox
            v-model="task.checked"
            :rules="rules(task.required)"
            :label="`${task.content}`"
            dense
            :ripple="false"
            :hide-details="!task.required ? true : false"
            :required="task.required ? true : false"
          >
            <template v-slot:label>
              <span id="checkboxLabel" style="font-size: 14px; font-weight: 500"
                >{{ task.content }} {{ task.required ? "*" : "" }}</span
              >
            </template>
          </v-checkbox>
        </div>
      </v-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "CheckTaskWrapper",
  props: {
    configItem: {
      type: Object,
      default: () => {},
    },
    tasks: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      defaut: () => "pressession",
    },
  },
  data() {
    return {
      valid: true,
      config: this.configItem,
    };
  },
  mounted() {
    this.$root.$on("start-new-session", () => {
      this.handleValidate();
    });
  },
  computed: {
    checklistHotkey() {
      return this.$hotkeyHelpers.findBinding(
        "sessionPlanning.checklist",
        this.config.hotkeys
      );
    },
    currentTheme() {
      if (this.$vuetify.theme.dark) {
        return this.$vuetify.theme.themes.dark;
      } else {
        return this.$vuetify.theme.themes.light;
      }
    },
  },
  watch: {
    configItem: function (newValue) {
      this.config = newValue;
    },
  },
  methods: {
    rules(required) {
      if (required) {
        return [(v) => !!v || this.$tc("caption.required_checkbox", 1)];
      } else {
        return [true];
      }
    },
    handleValidate() {
      if (this.$refs.form) {
        const isValid = this.$refs.form.validate();
        if (!isValid) {
          this.$refs.form.$el.scrollIntoView();
        }
      }
    },
  },
};
</script>
<style scoped>
.task-wrapper {
  display: block;
  padding: 12px;
}
.task-wrapper .subtitle-2 {
  font-size: 14px;
}
.task-wrapper .list {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin-top: 10px;
}
.task-wrapper .list > .one {
  display: flex;
  align-items: center;
  column-gap: 10px;
}
.task-wrapper .list > .one > input[type="checkbox"]:checked {
  accent-color: #7c3aed;
}
.task-wrapper .list > .one > content {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}
.error1 {
  background-color: #fef2f2 !important;
  padding: 10px;
  display: flex;
  column-gap: 10px;
  margin-top: 10px;
}
.error1 > .content > .title {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #991b1b;
}
.error1 > .content > .desc {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #b91c1c;
  margin-top: 5px;
}
</style>

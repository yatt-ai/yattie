<template>
  <div class="task-wrapper">
    <div class="subtitle-2 label-text">{{ $tc("caption.checklist", 1) }}</div>
    <div class="list">
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
    };
  },
  mounted() {
    this.$root.$on("start-new-session", () => {
      this.handleValidate();
    });
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
      const isValid = this.$refs.form.validate();
      if (!isValid) {
        const el = document.querySelector(".v-messages__wrapper:first-of-type");
        el.scrollIntoView();
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
</style>

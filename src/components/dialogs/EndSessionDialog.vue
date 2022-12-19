<template>
  <v-dialog v-bind="$attrs" v-on="$listeners" persistent width="350">
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <CheckTaskWrapper
          :tasks="tasks"
          :showError="showTaskError"
          type="postsession"
        />
        <div class="footer">
          <v-btn
            color="primary text-capitalize white__text"
            class="btn-end"
            @click="endSession"
          >
            End Session
          </v-btn>
          <v-btn color="white text-capitalize" class="btn-end" @click="cancel">
            Cancel
          </v-btn>
        </div>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>
<script>
import CheckTaskWrapper from "../CheckTaskWrapper.vue";

export default {
  name: "EndSessionDialog",
  components: {
    CheckTaskWrapper,
  },
  props: {
    postSessionData: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    tasks() {
      return this.postSessionData ? this.postSessionData.tasks : [];
    },
  },
  data() {
    return {
      showTaskError: false,
    };
  },
  methods: {
    endSession: function () {
      const uncheckedTasks = this.postSessionData.tasks.filter(
        (task) => !task.checked && task.required
      );

      if (uncheckedTasks.length > 0) {
        this.showTaskError = true;
        return;
      }

      this.showTaskError = false;
      this.$emit("proceed", true);
    },
    cancel: function () {
      this.$emit("proceed", false);
    },
  },
};
</script>
<style scoped>
.footer {
  padding: 15px;
  display: flex;
  column-gap: 10px;
}
.v-btn {
  flex: 1;
}
</style>

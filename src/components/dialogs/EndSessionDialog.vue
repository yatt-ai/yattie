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
            block
            color="primary text-capitalize white__text"
            class="btn-end"
            @click="endSession"
          >
            End Session
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
      this.$emit("proceed");
    },
  },
};
</script>
<style scoped>
.footer {
  padding: 15px;
}
</style>

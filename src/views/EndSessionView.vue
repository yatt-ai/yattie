<template>
  <v-container>
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
  </v-container>
</template>
<script>
import CheckTaskWrapper from "../components/CheckTaskWrapper.vue";
import {
  IPC_HANDLERS,
  IPC_FUNCTIONS,
  IPC_BIND_KEYS,
} from "../modules/constants";

export default {
  name: "EndSessionView",
  components: {
    CheckTaskWrapper,
  },
  data() {
    return {
      showTaskError: false,
      tasks: [],
    };
  },
  created() {
    if (!window.ipc) return;

    window.ipc.on(IPC_BIND_KEYS.MODAL_DATA, (data) => {
      this.tasks = data.checklist.postsession.tasks.map((task) => ({
        ...task,
        checked: false,
      }));
    });
  },
  methods: {
    cancel() {
      if (!window.ipc) return;

      window.ipc.invoke(IPC_HANDLERS.WINDOW, {
        func: IPC_FUNCTIONS.CLOSE_MODAL_WINDOW,
        data: {
          bindKey: IPC_BIND_KEYS.CLOSED_ENDSESSION_DIALOG,
          data: { passed: false },
        },
      });
    },
    endSession() {
      const uncheckedTasks = this.tasks.filter(
        (task) => !task.checked && task.required
      );

      if (uncheckedTasks.length > 0) {
        this.showTaskError = true;
        return;
      }

      this.showTaskError = false;

      if (!window.ipc) return;

      window.ipc.invoke(IPC_HANDLERS.WINDOW, {
        func: IPC_FUNCTIONS.CLOSE_MODAL_WINDOW,
        data: {
          bindKey: IPC_BIND_KEYS.CLOSED_ENDSESSION_DIALOG,
          data: { passed: true },
        },
      });
    },
    handleClear() {
      this.comment.type = "Summary";
      this.comment.content = "";
      this.comment.text = "";
    },
    updateComment({ content, text }) {
      this.comment.content = content;
      this.comment.text = text;
    },
  },
};
</script>
<style scoped>
.cotainer {
  height: 100vh;
}
.v-card {
  height: calc(100vh - 30px);
}
.footer {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px;
  display: flex;
  column-gap: 10px;
}
.v-btn {
  flex: 1;
}
</style>

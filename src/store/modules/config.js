import Vue from "vue";
export const config = {
  namespaced: true,
  state: () => ({
    checklist: {
      presession: {
        status: false,
        tasks: [],
      },
      postsession: {
        status: false,
        tasks: [],
      },
    },
  }),
  mutations: {
    setFullConfig(state, payload) {
      // Clear existing state properties
      Object.keys(state).forEach((key) => {
        Vue.delete(state, key);
      });

      // Add new properties from payload
      Object.keys(payload).forEach((key) => {
        Vue.set(state, key, payload[key]);
      });
    },
  },
  actions: {},
  getters: {
    fullConfig: (state) => {
      return state;
    },
    hotkeys: (state) => state.hotkeys,
    checklistPresessionStatus: (state) => state.checklist.presession.status,
    checklistPresessionTasks: (state) => state.checklist.presession.tasks,
    uncheckedRequiredPresessionTaskExist: (state) => {
      if (!state.checklist.presession.status) {
        this.checkedStatusOfPreSessionTask = true;
      } else {
        const uncheckedTasks = state.checklist.presession.tasks.filter(
          (task) => !task.checked && task.required
        );
        return uncheckedTasks.length === 0;
      }
    },
    checklistPostsessionStatus: (state) =>
      state?.checklist?.postsession?.status,
    checklistPostsessionTasks: (state) => state.checklist.postsession.tasks,
  },
};

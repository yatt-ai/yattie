import Vue from "vue";
export const config = {
  namespaced: true,
  state: () => ({
    ai: {
      enabled: false,
    },
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
    isAiAssistEnabled: (state) => state.ai?.enabled || false,
    postSessionData: (state) => state.checklist.postsession,
    checklistPostsessionStatus: (state) =>
      state?.checklist?.postsession?.status,
    checklistPostsessionTasks: (state) => state.checklist.postsession.tasks,
  },
};

import Vue from "vue";
export const config = {
  namespaced: true,
  state: () => ({}),
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
  },
};

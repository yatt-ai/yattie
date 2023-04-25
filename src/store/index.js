import Vue from "vue";
import Vuex from "vuex";

import {
  SESSION_STATUSES,
  DEFAULT_CHARTER_MAP_NODES,
  DEFAULT_CHARTER_MAP_CONNECTIONS,
} from "../modules/constants";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: "",
    charter: {
      content: "",
      text: "",
    },
    mindmap: {
      nodes: DEFAULT_CHARTER_MAP_NODES,
      connections: DEFAULT_CHARTER_MAP_CONNECTIONS,
    },
    precondition: {
      content: "",
      text: "",
    },
    duration: 0,
    status: SESSION_STATUSES.PENDING,
    timer: 0,
    started: "",
    ended: "",
    quickTest: false,
  },
  getters: {},
  mutations: {
    setTitle(state, payload) {
      state.title = payload;
    },
    setCharter(state, payload) {
      state.charter.content = payload.content;
      state.charter.text = payload.text;
    },
    setMindmap(state, payload) {
      state.mindmap.nodes = payload.nodes;
      state.mindmap.connections = payload.connections;
    },
    setPrecondition(state, payload) {
      state.precondition.content = payload.content;
      state.precondition.text = payload.text;
    },
    setDuration(state, payload) {
      state.duration = payload;
    },
    setStarted(state, payload) {
      state.started = payload;
    },
    setEnded(state, payload) {
      state.ended = payload;
    },
    setQuickTest(state, payload) {
      state.quickTest = payload;
    },
    updateSession(state, payload) {
      if (state.status !== payload.status) {
        state.status = payload.status;
      }
      if (state.timer !== payload.timer) {
        state.timer = payload.timer;
      }
      if (state.duration !== payload.duration) {
        state.duration = payload.duration;
      }
    },
    clearState(state) {
      state.title = "";
      state.charter = {
        content: "",
        text: "",
      };
      state.precondition = {
        content: "",
        text: "",
      };
      state.mindmap = {
        nodes: DEFAULT_CHARTER_MAP_NODES,
        connections: DEFAULT_CHARTER_MAP_CONNECTIONS,
      };

      state.duration = 0;
      state.status = SESSION_STATUSES.PENDING;
      state.timer = 0;

      state.started = "";
      state.ended = "";
      state.quickTest = false;
    },
    resetState(state) {
      state.duration = 0;
      state.status = SESSION_STATUSES.PENDING;
      state.timer = 0;

      state.started = "";
      state.ended = "";
      state.quickTest = false;
    },
    restoreState(state, payload) {
      state.title = payload.title;
      state.charter.content = payload.charter.content;
      state.charter.text = payload.charter.text;
      state.precondition.content = payload.precondition.content;
      state.precondition.text = payload.precondition.text;
      state.status = payload.status;
      state.timer = payload.timer;
      state.duration = payload.duration;
      state.started = payload.started;
      state.ended = payload.ended;
    },
  },
  actions: {},
  modules: {},
  strict: process.env.NODE_ENV !== "production",
});

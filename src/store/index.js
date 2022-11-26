import Vue from "vue";
import Vuex from "vuex";

import {
  SESSION_STATUSES,
  MAP_NODES,
  MAP_CONNECTIONS,
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
      nodes: MAP_NODES,
      connections: MAP_CONNECTIONS,
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
    resetState(state) {
      state.title = "";
      state.charter = "";
      state.precondition = "";
      state.status = SESSION_STATUSES.PENDING;
      state.timer = 0;
      state.duration = 0;
      state.started = "";
      state.ended = "";
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

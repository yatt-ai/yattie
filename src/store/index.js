import Vue from "vue";
import Vuex from "vuex";

import {
  SESSION_STATUSES,
  DEFAULT_CHARTER_MAP_NODES,
  DEFAULT_CHARTER_MAP_CONNECTIONS,
} from "../modules/constants";
import { auth } from "@/store/modules/auth";
import { config } from "@/store/modules/config";

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
    preconditions: {
      content: "",
      text: "",
    },
    duration: 0,
    status: SESSION_STATUSES.PENDING,
    timer: 0,
    started: "",
    ended: "",
    quickTest: false,
    path: "",
  },
  getters: {},
  mutations: {
    setTitle(state, payload) {
      state.title = payload;
      if (this.$isElectron) {
        this.$electronService.updateState(state);
      }
    },
    setCharter(state, payload) {
      state.charter.content = payload.content;
      state.charter.text = payload.text;
      if (this.$isElectron) {
        this.$electronService.updateState(state);
      }
    },
    setMindmap(state, payload) {
      state.mindmap.nodes = payload.nodes;
      state.mindmap.connections = payload.connections;
      if (this.$isElectron) {
        this.$electronService.updateState(state);
      }
    },
    setPrecondition(state, payload) {
      state.preconditions.content = payload.content;
      state.preconditions.text = payload.text;
      if (this.$isElectron) {
        this.$electronService.updateState(state);
      }
    },
    setDuration(state, payload) {
      state.duration = payload;
      if (this.$isElectron) {
        this.$electronService.updateState(state);
      }
    },
    setStarted(state, payload) {
      state.started = payload;
      if (this.$isElectron) {
        this.$electronService.updateState(state);
      }
    },
    setEnded(state, payload) {
      state.ended = payload;
      if (this.$isElectron) {
        this.$electronService.updateState(state);
      }
    },
    setQuickTest(state, payload) {
      state.quickTest = payload;
      if (this.$isElectron) {
        this.$electronService.updateState(state);
      }
    },
    setPath(state, payload) {
      state.path = payload;
      if (this.$isElectron) {
        this.$electronService.updateState(state);
      }
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
      if (this.$isElectron) {
        this.$electronService.updateState(state);
      }
    },
    clearState(state) {
      state.title = "";
      state.charter = {
        content: "",
        text: "",
      };
      state.preconditions = {
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
      if (this.$isElectron) {
        this.$electronService.updateState(state);
      }
    },
    resetState(state) {
      state.duration = 0;
      state.status = SESSION_STATUSES.PENDING;
      state.timer = 0;

      state.started = "";
      state.ended = "";
      state.quickTest = false;
      if (this.$isElectron) {
        this.$electronService.updateState(state);
      }
    },
    restoreState(state, payload) {
      state.title = payload.title;
      state.charter.content = payload?.charter?.content || "";
      state.charter.text = payload?.charter?.text || "";
      state.mindmap.nodes =
        payload?.mindmap?.nodes || DEFAULT_CHARTER_MAP_NODES;
      state.mindmap.connections =
        payload?.mindmap?.connections || DEFAULT_CHARTER_MAP_CONNECTIONS;
      state.preconditions.content = payload?.preconditions?.content || "";
      state.preconditions.text = payload?.preconditions?.text || "";
      state.status = payload.status;
      state.timer = payload.timer;
      state.duration = payload.duration;
      state.started = payload.started;
      state.ended = payload.ended;
      state.quickTest = payload.quickTest;
      state.path = payload.path;
      if (this.$isElectron) {
        this.$electronService.updateState(state);
      }
    },
  },
  actions: {},
  modules: {
    auth,
    config,
  },
  strict: process.env.NODE_ENV !== "production",
});

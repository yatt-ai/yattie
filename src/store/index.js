import Vue from "vue";
import Vuex from "vuex";

import {
  SESSION_STATUSES,
  DEFAULT_CHARTER_MAP_NODES,
  DEFAULT_CHARTER_MAP_CONNECTIONS,
  IPC_HANDLERS,
  IPC_FUNCTIONS,
} from "../modules/constants";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    remote: false,
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
    setRemote(state, payload) {
      state.remote = payload;
      window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
        func: IPC_FUNCTIONS.UPDATE_STATE,
        data: state,
      });
    },
    setTitle(state, payload) {
      state.title = payload;
      window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
        func: IPC_FUNCTIONS.UPDATE_STATE,
        data: state,
      });
    },
    setCharter(state, payload) {
      state.charter.content = payload.content;
      state.charter.text = payload.text;
      window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
        func: IPC_FUNCTIONS.UPDATE_STATE,
        data: state,
      });
    },
    setMindmap(state, payload) {
      state.mindmap.nodes = payload.nodes;
      state.mindmap.connections = payload.connections;
      window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
        func: IPC_FUNCTIONS.UPDATE_STATE,
        data: state,
      });
    },
    setPrecondition(state, payload) {
      state.preconditions.content = payload.content;
      state.preconditions.text = payload.text;
      window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
        func: IPC_FUNCTIONS.UPDATE_STATE,
        data: state,
      });
    },
    setDuration(state, payload) {
      state.duration = payload;
      window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
        func: IPC_FUNCTIONS.UPDATE_STATE,
        data: state,
      });
    },
    setStarted(state, payload) {
      state.started = payload;
      window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
        func: IPC_FUNCTIONS.UPDATE_STATE,
        data: state,
      });
    },
    setEnded(state, payload) {
      state.ended = payload;
      window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
        func: IPC_FUNCTIONS.UPDATE_STATE,
        data: state,
      });
    },
    setQuickTest(state, payload) {
      state.quickTest = payload;
      window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
        func: IPC_FUNCTIONS.UPDATE_STATE,
        data: state,
      });
    },
    setPath(state, payload) {
      state.path = payload;
      window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
        func: IPC_FUNCTIONS.UPDATE_STATE,
        data: state,
      });
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
      window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
        func: IPC_FUNCTIONS.UPDATE_STATE,
        data: state,
      });
    },
    clearState(state) {
      state.remote = false;
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
      window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
        func: IPC_FUNCTIONS.UPDATE_STATE,
        data: state,
      });
    },
    resetState(state) {
      state.duration = 0;
      state.status = SESSION_STATUSES.PENDING;
      state.timer = 0;

      state.started = "";
      state.ended = "";
      state.quickTest = false;
      window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
        func: IPC_FUNCTIONS.UPDATE_STATE,
        data: state,
      });
    },
    restoreState(state, payload) {
      state.remote = payload.remote || false;
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
      window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
        func: IPC_FUNCTIONS.UPDATE_STATE,
        data: state,
      });
    },
  },
  actions: {},
  modules: {},
  strict: process.env.NODE_ENV !== "production",
});

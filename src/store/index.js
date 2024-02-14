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

const store = new Vuex.Store({
  state: {
    case: {
      caseID: "",
      title: "",
      charter: {
        content: "",
        text: "",
      },
      preconditions: {
        content: "",
        text: "",
      },
      duration: 0,
      mindmap: {
        nodes: DEFAULT_CHARTER_MAP_NODES,
        connections: DEFAULT_CHARTER_MAP_CONNECTIONS,
      },
    },
    session: {
      sessionID: "",
      status: SESSION_STATUSES.PENDING,
      timer: 0,
      started: "",
      ended: "",
      quickTest: false,
      path: "",
      remote: false,
      preSessionTasks: [],
      postSessionTasks: [],
      // items: [],
      // notes: {
      //   content: "",
      //   text: "",
      // },
    },
  },
  mutations: {
    setCaseID(state, payload) {
      state.case.caseID = payload;
      this._vm.$storageService.updateState(state);
    },
    setCaseTitle(state, payload) {
      state.case.title = payload;
      this._vm.$storageService.updateState(state);
    },
    setCaseCharter(state, payload) {
      state.case.charter.content = payload.content;
      state.case.charter.text = payload.text;
      this._vm.$storageService.updateState(state);
    },
    setCasePrecondition(state, payload) {
      state.case.preconditions.content = payload.content;
      state.case.preconditions.text = payload.text;
      this._vm.$storageService.updateState(state);
    },
    setCaseDuration(state, payload) {
      state.case.duration = payload;
      this._vm.$storageService.updateState(state);
    },
    setCaseMindmap(state, payload) {
      state.case.mindmap.nodes = payload.nodes;
      state.case.mindmap.connections = payload.connections;
      this._vm.$storageService.updateState(state);
    },
    setSessionID(state, payload) {
      state.session.sessionID = payload;
      this._vm.$storageService.updateState(state);
    },
    setSessionStarted(state, payload) {
      state.session.started = payload;
      this._vm.$storageService.updateState(state);
    },
    setSessionEnded(state, payload) {
      state.session.ended = payload;
      this._vm.$storageService.updateState(state);
    },
    setSessionQuickTest(state, payload) {
      state.session.quickTest = payload;
      this._vm.$storageService.updateState(state);
    },
    setSessionPath(state, payload) {
      state.session.path = payload;
      this._vm.$storageService.updateState(state);
    },
    setSessionRemote(state, payload) {
      state.session.remote = payload;
      this._vm.$storageService.updateState(state);
    },
    setPreSessionTasks(state, payload) {
      state.session.preSessionTasks = payload;
    },
    setPostSessionTasks(state, payload) {
      state.session.postSessionTasks = payload;
    },
    updateSession(state, payload) {
      if (state.session.status !== payload.status) {
        state.session.status = payload.status;
      }
      if (state.session.timer !== payload.timer) {
        state.session.timer = payload.timer;
      }
      if (state.case.duration !== payload.duration) {
        state.case.duration = payload.duration;
      }
      this._vm.$storageService.updateState(state);
    },
    clearState(state) {
      state.case.caseID = null;
      state.case.title = "";
      state.case.charter = {
        content: "",
        text: "",
      };
      state.case.preconditions = {
        content: "",
        text: "",
      };
      state.case.duration = 0;
      state.case.mindmap = {
        nodes: DEFAULT_CHARTER_MAP_NODES,
        connections: DEFAULT_CHARTER_MAP_CONNECTIONS,
      };

      state.session.sessionID = null;
      state.session.status = SESSION_STATUSES.PENDING;
      state.session.timer = 0;
      state.session.started = "";
      state.session.ended = "";
      state.session.quickTest = false;
      state.session.remote = false;
      this._vm.$storageService.updateState(state);
    },
    resetState(state) {
      state.session.status = SESSION_STATUSES.PENDING;
      state.session.timer = 0;

      state.session.started = "";
      state.session.ended = "";
      this._vm.$storageService.updateState(state);
    },
    restoreState(state, payload) {
      state.case = {
        ...state.case,
        ...payload?.case,
        charter: {
          content: payload?.case?.charter?.content || "",
          text: payload?.case?.charter?.text || "",
        },
        preconditions: {
          content: payload?.case?.preconditions?.content || "",
          text: payload?.case?.preconditions?.text || "",
        },
        mindmap: {
          nodes: payload?.case?.mindmap?.nodes || DEFAULT_CHARTER_MAP_NODES,
          connections:
            payload?.case?.mindmap?.connections ||
            DEFAULT_CHARTER_MAP_CONNECTIONS,
        },
      };

      state.session = {
        ...state.session,
        ...payload?.session,
        remote: payload?.session?.remote || false,
      };

      this._vm.$storageService.updateState(state);
    },
    togglePreSessionTask(state, { taskId, checked }) {
      const taskIndex = state.session.preSessionTasks.findIndex(
        (task) => task.id === taskId
      );
      if (taskIndex !== -1) {
        state.session.preSessionTasks[taskIndex].checked = checked;
      }
    },
    togglePostSessionTask(state, { taskId, checked }) {
      const taskIndex = state.session.postSessionTasks.findIndex(
        (task) => task.id === taskId
      );
      if (taskIndex !== -1) {
        state.session.postSessionTasks[taskIndex].checked = checked;
      }
    },
  },
  actions: {},
  getters: {
    requiredPreSessionTasksChecked(state) {
      const uncheckedTasks = state.session.preSessionTasks.filter(
        (task) => !task.checked && task.required
      );
      return uncheckedTasks.length === 0;
    },
    requiredPostSessionTasksChecked(state) {
      const uncheckedTasks = state.session.postSessionTasks.filter(
        (task) => !task.checked && task.required
      );
      return uncheckedTasks.length === 0;
    },
  },
  modules: {
    auth,
    config,
  },
  strict: process.env.NODE_ENV !== "production",
});

export default store;

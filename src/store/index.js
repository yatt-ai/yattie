import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

import {
  SESSION_STATUSES,
  DEFAULT_CHARTER_MAP_NODES,
  DEFAULT_CHARTER_MAP_CONNECTIONS,
} from "@/modules/constants";
import { auth } from "@/store/modules/auth";
import { config } from "@/store/modules/config";

Vue.use(Vuex);

const isElectronApp = navigator.userAgent.includes("Electron");

const vuexLocalStorage = new VuexPersist({
  key: "yattie-state",
  storage: window.localStorage,
});

const store = new Vuex.Store({
  state: {
    plan: {
      items: [],
    },
    current: {
      case: {
        caseID: null,
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
      execution: {
        executionID: null,
        status: SESSION_STATUSES.PENDING,
        timer: 0,
        started: "",
        ended: "",
        quickTest: false,
        path: "",
        remote: false,
        preSessionTasks: [],
        postSessionTasks: [],
        items: [],
        notes: {
          content: "",
          text: "",
        },
        nodes: [],
        connections: [],
      },
    },
    savedTimer: 0,
  },
  mutations: {
    replaceAttachmentUrl(state, { attachmentID, url }) {
      console.log("replaceAttachmentUrl");
      const uploadedAttachment = state.current.execution.items.find(
        (item) => item.attachmentID === attachmentID
      );
      console.log({ uploadedAttachment });
      uploadedAttachment.filePath = url;
      uploadedAttachment.uploaded = true;
    },
    setSessionIDFromBackend(state, payload) {
      state.current.execution.executionID = payload;
    },
    setCaseIDFromBackend(state, payload) {
      state.current.case.caseID = payload;
    },
    setCaseID(state, payload) {
      state.current.case.caseID = payload;
      this._vm.$storageService.updateState(state);
    },
    setCaseTitle(state, payload) {
      state.current.case.title = payload;
      this._vm.$storageService.updateState(state);
    },
    setCaseCharter(state, payload) {
      state.current.case.charter.content = payload.content;
      state.current.case.charter.text = payload.text;
      this._vm.$storageService.updateState(state);
    },
    setCasePrecondition(state, payload) {
      state.current.case.preconditions.content = payload.content;
      state.current.case.preconditions.text = payload.text;
      this._vm.$storageService.updateState(state);
    },
    setCaseDuration(state, payload) {
      state.current.case.duration = payload;
      this._vm.$storageService.updateState(state);
    },
    setCaseMindmap(state, payload) {
      state.current.case.mindmap.nodes = payload.nodes;
      state.current.case.mindmap.connections = payload.connections;
      this._vm.$storageService.updateState(state);
    },
    setSessionID(state, payload) {
      state.current.execution.executionID = payload;
      this._vm.$storageService.updateState(state);
    },
    setSessionStarted(state, payload) {
      state.current.execution.started = payload;
      this._vm.$storageService.updateState(state);
    },
    setSessionEnded(state, payload) {
      state.current.execution.ended = payload;
      this._vm.$storageService.updateState(state);
    },
    setSessionQuickTest(state, payload) {
      state.current.execution.quickTest = payload;
      this._vm.$storageService.updateState(state);
    },
    setSessionPath(state, payload) {
      state.current.execution.path = payload;
      this._vm.$storageService.updateState(state);
    },
    setSessionRemote(state, payload) {
      state.current.execution.remote = payload;
      this._vm.$storageService.updateState(state);
    },
    setPreSessionTasks(state, payload) {
      state.current.execution.preSessionTasks = payload;
    },
    setPostSessionTasks(state, payload) {
      state.current.execution.postSessionTasks = payload;
    },
    setSessionItems(state, payload) {
      state.current.execution.items = payload;

      if (Vue.prototype.$isElectron) {
        this._vm.$storageService.updateItems(payload);
      } else {
        this._vm.$storageService.updateState(state);
      }
    },
    setSessionNodes(state, payload) {
      state.current.execution.nodes = payload;
      if (Vue.prototype.$isElectron)
        this._vm.$storageService.updateNodes(payload);
      else this._vm.$storageService.updateState(state);
    },
    setSessionConnections(state, payload) {
      state.current.execution.connections = payload;
      if (Vue.prototype.$isElectron)
        this._vm.$storageService.updateConnections(payload);
      else this._vm.$storageService.updateState(state);
    },
    setSessionItemsFromExternalWindow(state, payload) {
      state.current.execution.items = payload;
    },
    addSessionItem(state, payload) {
      state.current.execution.items.push(payload);
      if (Vue.prototype.$isElectron) {
        this._vm.$storageService.addItem(payload);
      } else {
        this._vm.$storageService.updateState(state);
      }
    },
    updateSessionItem(state, payload) {
      const currentItemIndex = state.current.execution.items.findIndex(
        (item) => item.stepID === payload.stepID
      );
      if (currentItemIndex !== -1) {
        state.current.execution.items[currentItemIndex] = payload;
      }
      this._vm.$storageService.updateItem(payload);
    },
    startSessionPlan(state, payload) {
      // this._vm.$storageService.startQuickTest(payload);
      state.plan.items = payload;
    },
    deleteSessionItems(state, ids) {
      state.current.execution.items = ids.reduce((acc, currentId) => {
        return acc.filter((item) => item.stepID !== currentId);
      }, state.current.execution.items);
      this._vm.$storageService.deleteItems(ids);
    },

    setSessionNotes(state, payload) {
      state.current.execution.notes.content = payload.content;
      state.current.execution.notes.text = payload.text;
      if (!this.$isElectron) {
        this._vm.$storageService.updateState(state);
      }
    },

    updateSession(state, payload) {
      let isStatusChanged = false;
      if (state.current.execution.status !== payload.status) {
        state.current.execution.status = payload.status;
        isStatusChanged = true;
      }
      if (state.current.execution.timer !== payload.timer) {
        state.current.execution.timer = payload.timer;
      }
      if (state.current.case.duration !== payload.duration) {
        state.current.case.duration = payload.duration;
      }
      if (state.current.execution.ended !== payload.ended && payload.ended) {
        state.current.execution.ended = payload.ended;
      }
      if (
        state.current.execution.quickTest !== payload.quickTest &&
        payload.quickTest
      ) {
        state.current.execution.quickTest = payload.quickTest;
      }
      if (
        state.current.execution.executionID !== payload.sessionID &&
        payload.sessionID
      ) {
        state.current.execution.executionID = payload.sessionID;
      }

      if (
        Vue.prototype.$isElectron ||
        isStatusChanged ||
        payload.isForce ||
        payload.timer - state.savedTimer >= 10
      ) {
        state.savedTimer = payload.timer;
        this._vm.$storageService.updateState(state);
      }
    },

    clearState(state) {
      state.current.case.caseID = null;
      state.current.case.title = "";
      state.current.case.charter = {
        content: "",
        text: "",
      };
      state.current.case.preconditions = {
        content: "",
        text: "",
      };
      state.current.case.duration = 0;
      state.current.case.mindmap = {
        nodes: DEFAULT_CHARTER_MAP_NODES,
        connections: DEFAULT_CHARTER_MAP_CONNECTIONS,
      };

      state.current.execution.executionID = null;
      state.current.execution.status = SESSION_STATUSES.PENDING;
      state.current.execution.timer = 0;
      state.current.execution.started = "";
      state.current.execution.ended = "";
      state.current.execution.quickTest = false;
      state.current.execution.remote = false;
      state.current.execution.items = [];

      state.current.execution.notes = {
        content: "",
        text: "",
      };
      state.current.execution.nodes = [];
      state.current.execution.connections = [];
      state.plan.items = [];
      this._vm.$storageService.updateState(state);
    },

    startQuickTest(state) {
      state.current.case.caseID = null;
      state.current.case.title = "";
      state.current.case.charter = {
        content: "",
        text: "",
      };
      state.current.case.preconditions = {
        content: "",
        text: "",
      };
      state.current.case.duration = 0;
      state.current.case.mindmap = {
        nodes: DEFAULT_CHARTER_MAP_NODES,
        connections: DEFAULT_CHARTER_MAP_CONNECTIONS,
      };

      state.current.execution.executionID = null;
      state.current.execution.path = "/main/workspace";
      state.current.execution.status = SESSION_STATUSES.PENDING;
      state.current.execution.timer = 0;
      state.current.execution.started = "";
      state.current.execution.ended = "";
      state.current.execution.quickTest = true;
      state.current.execution.remote = false;
      state.current.execution.items = [];
      state.current.execution.notes = {
        content: "",
        text: "",
      };
      state.current.execution.nodes = [];
      state.current.execution.connections = [];
      this._vm.$storageService.updateState(state);
    },

    resetState(state) {
      state.current.execution.status = SESSION_STATUSES.PENDING;
      state.current.execution.timer = 0;

      state.current.execution.started = "";
      state.current.execution.ended = "";
      this._vm.$storageService.updateState(state);
    },

    restoreState(state, payload) {
      state.current.case = {
        ...state.current.case,
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

      state.current.execution = {
        ...state.current.execution,
        ...payload?.session,
        remote: payload?.session?.remote || false,
        notes: {
          content: payload?.session?.notes?.content || "",
          text: payload?.session?.notes?.text || "",
        },
      };

      this._vm.$storageService.updateState(state);
    },

    togglePreSessionTask(state, { taskId, checked }) {
      const taskIndex = state.current.execution.preSessionTasks.findIndex(
        (task) => task.id === taskId
      );
      if (taskIndex !== -1) {
        state.current.execution.preSessionTasks[taskIndex].checked = checked;
      }
    },

    togglePostSessionTask(state, { taskId, checked }) {
      const taskIndex = state.current.execution.postSessionTasks.findIndex(
        (task) => task.id === taskId
      );
      if (taskIndex !== -1) {
        state.current.execution.postSessionTasks[taskIndex].checked = checked;
      }
    },
  },
  actions: {},
  getters: {
    sessionItems(state) {
      return state.current.execution.items;
    },
    sessionNodes(state) {
      return state.current.execution.nodes;
    },
    sessionConnections(state) {
      return state.current.execution.connections;
    },
    requiredPreSessionTasksChecked(state) {
      const uncheckedTasks = state.current.execution.preSessionTasks.filter(
        (task) => !task.checked && task.required
      );
      return uncheckedTasks.length === 0;
    },
    requiredPostSessionTasksChecked(state) {
      const uncheckedTasks = state.current.execution.postSessionTasks.filter(
        (task) => !task.checked && task.required
      );
      return uncheckedTasks.length === 0;
    },
  },
  modules: {
    auth,
    config,
  },
  plugins: isElectronApp ? [] : [vuexLocalStorage.plugin],
  strict: process.env.NODE_ENV !== "production",
});

export default store;

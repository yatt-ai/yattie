import Vuetify from "vuetify";
import Vuex from "vuex";
import VueRouter from "vue-router";

import ControlPanel from "../ControlPanel.vue";
import SourcePickerDialog from "../dialogs/SourcePickerDialog.vue";
import NoteDialog from "../dialogs/NoteDialog.vue";
import DeleteConfirmDialog from "../dialogs/DeleteConfirmDialog.vue";
import ResetConfirmDialog from "../dialogs/ResetConfirmDialog.vue";
import NewSessionDialog from "../dialogs/NewSessionDialog.vue";
import DurationConfirmDialog from "../dialogs/DurationConfirmDialog.vue";
import AudioErrorDialog from "../dialogs/AudioErrorDialog.vue";
import EndSessionDialog from "../dialogs/EndSessionDialog.vue";
import storeConfig from "@/store/store-config";

import { mount, createLocalVue } from "@vue/test-utils";
import { cloneDeep } from "lodash";
import { SESSION_STATUSES } from "../../modules/constants";

const vuetify = new Vuetify();
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

const router = new VueRouter();

describe("ControlPanel.vue", () => {
  const dataInfo = {
    selected: [],
  };

  let store;

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig));
  });

  test('displays "Start New Session" button', () => {
    const wrapper = mount(ControlPanel, {
      data() {
        return dataInfo;
      },
      propsData: {
        postSessionData: {
          status: true,
          tasks: [],
        },
        configItem: {
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
        },
      },
      localVue,
      router,
      store: {
        ...store,
        state: {
          status: SESSION_STATUSES.PENDING,
        },
      },
      vuetify,
    });

    expect(wrapper.findComponent(SourcePickerDialog).exists()).toBe(true);
    expect(wrapper.findComponent(NoteDialog).exists()).toBe(true);
    expect(wrapper.findComponent(DeleteConfirmDialog).exists()).toBe(true);
    expect(wrapper.findComponent(ResetConfirmDialog).exists()).toBe(true);
    expect(wrapper.findComponent(NewSessionDialog).exists()).toBe(true);
    expect(wrapper.findComponent(DurationConfirmDialog).exists()).toBe(true);
    expect(wrapper.findComponent(AudioErrorDialog).exists()).toBe(true);
    expect(wrapper.findComponent(EndSessionDialog).exists()).toBe(true);

    expect(wrapper.find("#btn_new_session").exists()).toBe(true);
    expect(wrapper.find("#btn_new_session").text()).toContain(
      "Start New Session"
    );
  });

  test('displays "Delete", "Export" buttons', () => {
    const wrapper = mount(ControlPanel, {
      data() {
        return {
          selected: ["selected"],
        };
      },
      propsData: {
        postSessionData: {
          status: true,
          tasks: [],
        },
        configItem: {
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
        },
      },
      localVue,
      router,
      store: {
        ...store,
        state: {
          status: SESSION_STATUSES.PENDING,
        },
      },
      vuetify,
    });

    expect(wrapper.find("#btn_delete").text()).toContain("Delete");
    expect(wrapper.find("#btn_download").text()).toContain("Export");
  });

  test("displays icon buttons", async () => {
    const wrapper = mount(ControlPanel, {
      data() {
        return {
          selected: ["selected"],
        };
      },
      propsData: {
        postSessionData: {
          status: true,
          tasks: [],
        },
        configItem: {
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
        },
      },
      localVue,
      router,
      store: {
        ...store,
        state: {
          ...store.status,
          status: SESSION_STATUSES.START,
        },
      },
      vuetify,
    });

    expect(wrapper.find("#btn_resume").exists()).toBe(false);
    expect(wrapper.find("#btn_save").exists()).toBe(false);
    expect(wrapper.find("#btn_reset").exists()).toBe(false);

    expect(wrapper.find("#btn_pause_session").exists()).toBe(true);
    expect(wrapper.find("#btn_resume_session").exists()).toBe(false);
    expect(wrapper.find("#btn_end_session").exists()).toBe(true);
    expect(wrapper.find("#btn_start_record_video").exists()).toBe(true);
    expect(wrapper.find("#btn_stop_record_video").exists()).toBe(false);
    expect(wrapper.find("#btn_screenshot").exists()).toBe(true);
    expect(wrapper.find("#btn_start_record_audio").exists()).toBe(true);
    expect(wrapper.find("#btn_stop_record_audio").exists()).toBe(false);
    expect(wrapper.find("#btn_note").exists()).toBe(true);
  });
});

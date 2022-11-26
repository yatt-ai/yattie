import Vuetify from "vuetify";
import Vuex from "vuex";
import VueRouter from "vue-router";

import MainView from "../MainView";
import TestWrapper from "../../components/TestWrapper";
import TimelineWrapper from "../../components/TimelineWrapper";
import TimeCounter from "../../components/TimeCounter";
import storeConfig from "@/store/store-config";

import { mount, createLocalVue } from "@vue/test-utils";
import { cloneDeep } from "lodash";

const vuetify = new Vuetify();

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

const router = new VueRouter();

describe("MainView.vue", () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig));
  });

  test("loads tab bar", () => {
    const wrapper = mount(MainView, {
      store: {
        ...store,
        state: {
          ...store.state,
          status: "",
        },
      },
      localVue,
      router,
      vuetify,
    });

    expect(wrapper.find(".header")).toBeTruthy();
    expect(wrapper.find(".header .test-tab")).toBeTruthy();
    expect(wrapper.find(".header .timeline-tab")).toBeTruthy();
  });

  test('loads content of "test" tab', async () => {
    const wrapper = mount(MainView, {
      data() {
        return {
          activeTab: "/main",
        };
      },
      store: {
        ...store,
        state: {
          ...store.state,
          status: "",
        },
      },
      localVue,
      router,
      vuetify,
    });

    expect(wrapper.findComponent(TestWrapper).exists()).toBe(true);
  });

  test('loads content of "timeline" tab', async () => {
    const wrapper = mount(MainView, {
      data() {
        return {
          activeTab: "/main/timeline",
        };
      },
      store: {
        ...store,
        state: {
          ...store.state,
          status: "",
        },
      },
      localVue,
      router,
      vuetify,
    });

    expect(wrapper.findComponent(TimelineWrapper).exists()).toBe(true);
  });

  test("show the time counter by status", () => {
    const wrapper = mount(MainView, {
      store: {
        ...store,
        state: {
          ...store.state,
          status: "",
        },
      },
      localVue,
      router,
      vuetify,
    });

    expect(wrapper.findComponent(TimeCounter).exists()).toBe(true);
  });

  test("hide the time counter by status", () => {
    const wrapper = mount(MainView, {
      store: {
        ...store,
        state: {
          ...store.state,
          status: "pending",
        },
      },
      localVue,
      router,
      vuetify,
    });

    expect(wrapper.findComponent(TimeCounter).exists()).toBe(false);
  });
});

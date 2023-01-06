import Vuetify from "vuetify";
import SignupHomeWrapper from "../SignupHomeWrapper.vue";
import LogoWrapper from "../../LogoWrapper.vue";

import { mount } from "@vue/test-utils";

const vuetify = new Vuetify();

describe("SignupHomeWrapper.vue", () => {
  test("render a view", () => {
    const wrapper = mount(SignupHomeWrapper, {
      mocks: {
        $t: () => {},
        $tc: () => {},
      },
      vuetify,
    });

    expect(wrapper.findComponent(LogoWrapper).exists()).toBe(true);
    expect(wrapper.find(".new-section").exists()).toBe(true);
    expect(wrapper.findAll(".new-section .v-btn").length).toBe(2);
    expect(wrapper.find(".footer").exists()).toBe(true);
  });

  test('trigger the click event of "signin" button', () => {
    const wrapper = mount(SignupHomeWrapper, {
      mocks: {
        $t: () => {},
        $tc: () => {},
      },
      data() {
        return {};
      },
      vuetify,
    });

    const event = jest.fn();
    const button = wrapper.find(".v-btn.signin");

    button.vm.$on("click", event);
    button.trigger("click");
  });

  test('trigger the click event of "signup" button', () => {
    const wrapper = mount(SignupHomeWrapper, {
      mocks: {
        $t: () => {},
        $tc: () => {},
      },
      data() {
        return {};
      },
      vuetify,
    });

    const event = jest.fn();
    const button = wrapper.find(".v-btn.signup");

    button.vm.$on("click", event);
    button.trigger("click");
  });
});

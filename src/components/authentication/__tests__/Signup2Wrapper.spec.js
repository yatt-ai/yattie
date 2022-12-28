import Vuetify from "vuetify";
import Signup2Wrapper from "../Signup2Wrapper.vue";

import { mount } from "@vue/test-utils";

const vuetify = new Vuetify();
let wrapper;

describe("Signup2Wrapper.vue", () => {
  beforeEach(() => {
    wrapper = mount(Signup2Wrapper, {
      mocks: {
        $t: () => {},
        $tc: () => {},
      },
      data() {
        return {};
      },
      vuetify,
    });
  });

  test("render a view", () => {
    expect(wrapper.find(".wrapper .header").exists()).toBe(true);
    expect(wrapper.find(".wrapper .header .v-btn").exists()).toBe(true);
    expect(wrapper.find(".wrapper .header .signup-title").exists()).toBe(true);
    expect(wrapper.find(".wrapper .content").exists()).toBe(true);
    expect(
      wrapper.findAll(".wrapper .content .row:first-child .v-btn").length
    ).toBe(5);
    expect(
      wrapper.findAll(".wrapper .content .row:nth-child(2) .v-btn").length
    ).toBe(2);
    expect(
      wrapper.find(".wrapper .content .row:last-child .v-btn").exists()
    ).toBe(true);
  });

  test('trigger the click event of "signup with yattie" button', () => {
    const event = jest.fn();
    const button = wrapper.find(".v-btn.yattie");

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "signup with jira" button', () => {
    const event = jest.fn();
    const button = wrapper.find(".v-btn.jira");

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "signup with testreail" button', () => {
    const event = jest.fn();
    const button = wrapper.find(".v-btn.testrail");

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "signup with qtest" button', () => {
    const event = jest.fn();
    const button = wrapper.find(".v-btn.qtest");

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "signup with practitest" button', () => {
    const event = jest.fn();
    const button = wrapper.find(".v-btn.practitest");

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "skip" button', () => {
    const event = jest.fn();
    const button = wrapper.find(".v-btn.btn_skip");

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "signup" button', () => {
    const event = jest.fn();
    const button = wrapper.find(".btn_signup");

    button.vm.$on("click", event);
    button.trigger("click");

    // expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "signin" button', () => {
    const event = jest.fn();
    const button = wrapper.find(".signin-btn");

    button.vm.$on("click", event);
    button.trigger("click");

    // expect(event).toHaveBeenCalled();
  });
});

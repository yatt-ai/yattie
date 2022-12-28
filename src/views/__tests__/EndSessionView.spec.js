import Vuetify from "vuetify";
import EndSessionView from "../EndSessionView.vue";
import CheckTaskWrapper from "../../components/CheckTaskWrapper.vue";

import { mount } from "@vue/test-utils";

const vuetify = new Vuetify();

describe("EndSessionView.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(EndSessionView, {
      mocks: {
        $t: () => {},
        $tc: () => {},
      },
      vuetify,
    });
  });

  test("render a view", () => {
    expect(wrapper.findComponent(CheckTaskWrapper).exists()).toBe(true);
    expect(wrapper.findAll(".footer button").length).toBe(2);
  });

  test('trigger the click event of "End Session" button', () => {
    const event = jest.fn();
    const button = wrapper.find(".footer button:first-child");

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "Cancel" button', () => {
    const event = jest.fn();
    const button = wrapper.find(".footer button:last-child");

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });
});

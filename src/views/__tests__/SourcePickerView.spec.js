import Vuetify from "vuetify";
import SourcePickerView from "../SourcePickerView.vue";

import { mount } from "@vue/test-utils";

const vuetify = new Vuetify();

describe("SourcePickerView.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(SourcePickerView, {
      mocks: {
        $t: () => {},
        $tc: () => {},
      },
      data() {
        return {
          activeSource: "",
          sources: [],
        };
      },
      vuetify,
    });
  });

  test("render a view", () => {
    expect(wrapper.find(".header span").exists()).toBe(true);

    expect(wrapper.find(".content").exists()).toBe(true);
    expect(wrapper.findAll(".footer button").length).toBe(2);
  });

  test('trigger the click event of "Cancel" button', () => {
    const button = wrapper.find(".footer button:first-child");
    const event = jest.fn();

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "Start Recording" button', () => {
    const button = wrapper.find(".footer button:first-child");
    const event = jest.fn();

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });
});

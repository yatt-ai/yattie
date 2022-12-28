import Vuetify from "vuetify";
import SummaryEditorView from "../SummaryEditorView.vue";
import TextEditor from "../../components/TextEditor.vue";

import { mount } from "@vue/test-utils";

const vuetify = new Vuetify();

describe("SummaryEditoryView.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(SummaryEditorView, {
      mocks: {
        $t: () => {},
        $tc: () => {},
      },
      vuetify,
    });
  });

  test("render a view", () => {
    expect(wrapper.find(".dialog-title").exists()).toBe(true);
    expect(wrapper.findComponent(TextEditor).exists()).toBe(true);
    expect(wrapper.find(".container").exists()).toBe(true);
    expect(wrapper.find(".container .subtitle-2").exists()).toBe(true);
    expect(wrapper.find(".container input").exists()).toBe(true);
    expect(wrapper.find(".container button").exists()).toBe(true);
    expect(wrapper.findAll(".action-wrapper button").length).toBe(2);
  });

  test('trigger the click event of "dicard" button', () => {
    const event = jest.fn();
    const button = wrapper.find(".action-wrapper button:first-child");

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "save" button', () => {
    const event = jest.fn();
    const button = wrapper.find(".action-wrapper button:last-child");

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "clear" button', () => {
    const event = jest.fn();
    const button = wrapper.find(".container button");

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });
});

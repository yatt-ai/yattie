import Vuetify from "vuetify";
import NoteEditorView from "../NoteEditorView.vue";

import { mount } from "@vue/test-utils";
import { TEXT_TYPES } from "../../modules/constants";

const vuetify = new Vuetify();

describe("NoteEditorView.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(NoteEditorView, {
      mocks: {
        $t: () => {},
        $tc: () => {},
      },
      data() {
        return {
          config: {},
          comment: {
            type: "",
            content: "",
            tags: [],
          },
          tag: "",
          tags: [],
          commentTypes: TEXT_TYPES.filter((item) => item !== "Summary"),
        };
      },
      vuetify,
    });
  });

  test("render a view", () => {
    expect(wrapper.find(".dialog-title").exists()).toBe(true);

    expect(wrapper.findAll(".btn").length).toBe(3);
  });

  test('trigger the click event of "Clear" button', () => {
    const button = wrapper.find(".note-wrapper .btn");
    const event = jest.fn();

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "Discard" button', () => {
    const button = wrapper.find(".action-wrapper > div:first-child > .btn");
    const event = jest.fn();

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "Save" button', () => {
    const button = wrapper.find(".action-wrapper > div:last-child > .btn");
    const event = jest.fn();

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });
});

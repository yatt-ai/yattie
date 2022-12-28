import Vuetify from "vuetify";
import NotesWrapper from "../NotesWrapper.vue";
import TextEditor from "../TextEditor.vue";

import { mount } from "@vue/test-utils";

const vuetify = new Vuetify();

describe("NotesWrapper.vue", () => {
  test("render a view", () => {
    const wrapper = mount(NotesWrapper, {
      mocks: {
        $t: () => {},
        $tc: () => {},
      },
      data() {
        return {
          notes: { text: "", content: "" },
        };
      },
      vuetify,
    });

    expect(wrapper.findComponent(TextEditor).exists()).toBe(true);
  });
});

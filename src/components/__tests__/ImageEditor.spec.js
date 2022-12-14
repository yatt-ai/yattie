import Vuetify from "vuetify";
import ImageEditor from "../ImageEditor";

import { mount } from "@vue/test-utils";

const vuetify = new Vuetify();

describe("ImageEditor.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(ImageEditor, {
      propsData: {
        item: {
          filePath: "",
        },
      },
      vuetify,
    });
  });
});

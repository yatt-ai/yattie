import Vuetify from "vuetify";
import ImageEditor from "../ImageEditor";

import { mount } from "@vue/test-utils";
import { ImageEditor as TuiImageEditor } from "@toast-ui/vue-image-editor";

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

  test("render a view", () => {
    expect(wrapper.findComponent(TuiImageEditor).exists()).toBe(true);
    expect(wrapper.findAll("button").length).toBe(2);
    expect(wrapper.find("button:first-child").text()).toContain("Cancel");
    expect(wrapper.find("button:last-child").text()).toContain("Apply");
  });

  test('trigger the click event of "Cancel" button', () => {
    const event = jest.fn();
    const button = wrapper.find("button:first-child");

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "Apply" button', () => {
    const event = jest.fn();
    const button = wrapper.find("button:last-child");

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });
});

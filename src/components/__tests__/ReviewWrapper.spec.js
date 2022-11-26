import Vuetify from "vuetify";

import ReviewWrappper from "../ReviewWrapper";
import ImageEditor from "../ImageEditor";
import VideoWrapper from "../VideoWrapper";
import AudioWrapper from "../AudioWrapper";
import FileWrapper from "../FileWrapper";

import { mount } from "@vue/test-utils";

const vuetify = new Vuetify();

describe("ReivewWrapper.vue", () => {
  test("render a view", async () => {
    const wrapper = mount(ReviewWrappper, {
      propsData: {
        item: {
          fileType: "image",
        },
      },
      vuetify,
    });

    expect(wrapper.findComponent(ImageEditor).exists()).toBe(true);

    await wrapper.setProps({
      item: {
        fileType: "video",
      },
    });
    expect(wrapper.findComponent(VideoWrapper).exists()).toBe(true);

    await wrapper.setProps({
      item: {
        fileType: "audio",
      },
    });
    expect(wrapper.findComponent(AudioWrapper).exists()).toBe(true);

    await wrapper.setProps({
      item: {
        fileType: "other",
      },
    });
    expect(wrapper.findComponent(FileWrapper).exists()).toBe(true);
  });
});

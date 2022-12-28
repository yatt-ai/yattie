import Vuetify from "vuetify";
import Signup3Wrapper from "../Signup3Wrapper.vue";

import { mount } from "@vue/test-utils";

const vuetify = new Vuetify();
let wrapper;

describe("Signup3Wrapper.vue", () => {
  beforeEach(() => {
    wrapper = mount(Signup3Wrapper, {
      mocks: {
        $t: () => {},
        $tc: () => {},
      },
      data() {
        return {
          start: "individual",
          email: "",
          url: "",
        };
      },
      vuetify,
    });
  });

  test("render a view", () => {
    expect(wrapper.find(".wrapper .header").exists()).toBe(true);
    expect(wrapper.find(".wrapper .header .v-btn").exists()).toBe(true);
    expect(wrapper.find(".wrapper .header .subtitle-1").exists()).toBe(true);
    expect(wrapper.find(".wrapper .content").exists()).toBe(true);
    expect(wrapper.find(".wrapper .content .radio-box").exists()).toBe(true);
    expect(wrapper.find(".wrapper"));
    expect(wrapper.find(".wrapper .footer").exists()).toBe(true);
  });

  test('trigger the click event of "back" button', async () => {
    const event = jest.fn();
    const button = wrapper.find(".back-btn");

    button.vm.$on("click", event);
    button.trigger("click");

    await wrapper.vm.$nextTick();

    // expect(event).toHaveBeenCalled();
  });
});

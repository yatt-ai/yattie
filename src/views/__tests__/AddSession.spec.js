import Vuetify from "vuetify";
import AddSession from "../AddSession";
import ReviewWrapper from "../../components/ReviewWrapper";
import TextEditor from "../../components/TextEditor";

import { mount } from "@vue/test-utils";

const vuetify = new Vuetify();

describe("AddSession.vue", () => {
  test("loads editor view", () => {
    const wrapper = mount(AddSession, {
      data() {
        return {
          item: {
            fileType: "",
            comment: {
              type: "",
            },
          },
          config: {},
          comment: {
            type: "",
            content: "",
            text: "",
          },
        };
      },
      stubs: ["router-link"],
      vuetify,
    });

    expect(
      wrapper
        .find(".content-bottom .comment-type .subtitle-2.label-text")
        .text()
    ).toContain("Comment Type");
    expect(wrapper.findComponent(ReviewWrapper).exists()).toBe(true);
    expect(wrapper.findComponent(TextEditor).exists()).toBe(true);
    expect(wrapper.find(".footer button:nth-child(1)").text()).toContain(
      "Clear"
    );
    expect(wrapper.find(".footer > div button:nth-child(1)").text()).toContain(
      "Discard"
    );
    expect(wrapper.find(".footer > div button:nth-child(2)").text()).toContain(
      "Save"
    );
  });

  test('triggers a click on "Discard" button', async () => {
    const wrapper = mount(AddSession, {
      data() {
        return {
          item: {
            fileType: "",
            comment: {
              type: "",
            },
          },
          config: {},
          comment: {
            type: "",
            content: "",
            text: "",
          },
          processing: false,
        };
      },
      stubs: ["router-link"],
      vuetify,
    });

    const button = wrapper.find(".footer > div button:nth-child(1)");
    const event = jest.fn();

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('triggers a click on "Save" button', async () => {
    const wrapper = mount(AddSession, {
      data() {
        return {
          item: {
            fileType: "",
            comment: {
              type: "",
            },
          },
          config: {},
          comment: {
            type: "",
            content: "",
            text: "",
          },
          processing: false,
        };
      },
      stubs: ["router-link"],
      vuetify,
    });

    const button = wrapper.find(".footer > div button:nth-child(2)");
    const event = jest.fn();

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  it('trigger the click event of "Clear" button', async () => {
    const wrapper = mount(AddSession, {
      data() {
        return {
          item: {
            fileType: "",
            comment: {
              type: "",
            },
          },
          config: {},
          comment: {
            type: "",
            content: "",
            text: "",
          },
          processing: false,
        };
      },
      stubs: ["router-link"],
      vuetify,
    });

    const button = wrapper.find(".footer button:nth-child(1)");
    const event = jest.fn();

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();

    expect(wrapper.vm.comment.text).toBe("");
    expect(wrapper.vm.comment.type).toBe("Comment");
  });
});

import Vuetify from "vuetify";

import LogoWrapper from "../../LogoWrapper";
import AudioRecordingDialog from "../AudioRecordingDialog";

import { mount, createLocalVue } from "@vue/test-utils";

let vuetify;
let localVue;
let wrapper;

describe("AudioRecordingDialog.vue", () => {
  beforeEach(() => {
    const rootDiv = document.createElement("div");
    rootDiv.id = "root";
    document.body.appendChild(rootDiv);

    localVue = createLocalVue();
    vuetify = new Vuetify();

    const App = localVue.component("App", {
      components: { AudioRecordingDialog },
      data() {
        return {
          dialog: false,
        };
      },
      template: `
        <v-app>
          <AudioRecordingDialog
            title="Recording Audio"
            text="An error occurred while recording the audio."
            ref="dialog"
            v-model="dialog"
          />
        </v-app>
      `,
    });

    wrapper = mount(App, {
      localVue,
      vuetify,
      attachTo: "#root",
    });
  });

  test("render a dialog", async () => {
    wrapper.setData({ dialog: true });

    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(LogoWrapper).exists()).toBe(true);
    expect(wrapper.find(".title").exists()).toBe(true);
    expect(wrapper.find(".title").text()).toContain("Recording Audio");
    expect(wrapper.find(".text").exists()).toBe(true);
    expect(wrapper.find(".text").text()).toContain(
      "An error occurred while recording the audio."
    );
    expect(wrapper.findAll(".btn").length).toBe(2);
    expect(wrapper.find(".btn:nth-child(1)").text()).toContain("Allow");
    expect(wrapper.find(".btn:nth-child(2)").text()).toContain("Cancel");
  });

  test('trigger the click event of "Allow" button', async () => {
    wrapper.setData({ dialog: true });

    await wrapper.vm.$nextTick();

    const event = jest.fn();
    const button = wrapper.find(".btn:first-child");
    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "Cancel" button', async () => {
    wrapper.setData({ dialog: true });

    await wrapper.vm.$nextTick();

    const event = jest.fn();
    const button = wrapper.find(".btn:last-child");
    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });
});

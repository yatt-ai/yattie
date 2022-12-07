import Vuetify from "vuetify";

import NoteDialog from "../NoteDialog";
import TextEditor from "../../TextEditor";

import { mount, createLocalVue } from "@vue/test-utils";

let vuetify;
let wrapper;
let localVue;

describe("NoteDialog.vue", () => {
  beforeEach(() => {
    const rootDiv = document.createElement("div");
    rootDiv.id = "root";
    document.body.appendChild(rootDiv);

    localVue = createLocalVue();
    vuetify = new Vuetify();

    const App = localVue.component("App", {
      components: { NoteDialog },
      propsData: {
        configItem: {
          commentType: "",
          templates: [
            {
              precondition: { comment: "", text: "" },
              type: "Note",
            },
          ],
        },
      },
      data() {
        return {
          dialog: false,
        };
      },
      template: `
        <v-app>
          <NoteDialog
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

    expect(wrapper.findComponent(TextEditor).exists()).toBe(true);
    expect(wrapper.find(".dialog-title").exists()).toBe(true);
    expect(wrapper.find(".dialog-title").text()).toContain("Take a Note");

    expect(wrapper.findAll(".btn").length).toBe(3);
    expect(wrapper.find(".note-wrapper .btn").text()).toContain("Clear");
    expect(
      wrapper.find(".action-wrapper > div:first-child > .btn").text()
    ).toContain("Discard");
    expect(
      wrapper.find(".action-wrapper > div:last-child > .btn").text()
    ).toContain("Save");
  });

  test('trigger the click event of "Clear" button', async () => {
    wrapper.setData({ dialog: true });

    await wrapper.vm.$nextTick();

    const button = wrapper.find(".note-wrapper .btn");
    const event = jest.fn();

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "Discard" button', async () => {
    wrapper.setData({ dialog: true });

    await wrapper.vm.$nextTick();

    const button = wrapper.find(".action-wrapper > div:first-child > .btn");
    const event = jest.fn();

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });

  test('trigger the click event of "Save" button', async () => {
    wrapper.setData({ dialog: true });

    await wrapper.vm.$nextTick();

    const button = wrapper.find(".action-wrapper > div:last-child > .btn");
    const event = jest.fn();

    button.vm.$on("click", event);
    button.trigger("click");

    expect(event).toHaveBeenCalled();
  });
});

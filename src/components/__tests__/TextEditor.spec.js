import { mount } from "@vue/test-utils";

import TextEditor from "../TextEditor";

describe("TextEditor.vue", () => {
  const dataInfo = {
    apiKey: "gsamuimia341odbjm3dbaxstm3a8ttjg458ce840htiimyk5",
    config: {
      selector: "textarea",
      plugins: [
        "lists",
        "advlist",
        "image",
        "link",
        "code",
        "table",
        "emoticons",
      ],
      toolbar:
        "block | bold italic formatgroup | forecolor | bullist | link emoticons insertgroup",
      block_formats: "Paragraph=p;Header 1=h1;Header 2=h2;Header 3=h3",
      font_formats:
        "Arial=arial,helvetica,sans-serif;Courier New=courier new,courier,monospace;AkrutiKndPadmini=Akpdmi-n",
      toolbar_groups: {
        formatgroup: {
          icon: "more-drawer",
          tooltip: "More rormatting",
          items:
            "underline strikethrough | superscript subscript | code removeformat",
        },

        insertgroup: {
          icon: "plus",
          tooltip: "Insert",
          items: "code blockquote table hr",
        },
      },
      menubar: false,
      statusbar: false,
    },
  };

  test("displays label text", () => {
    const wrapper = mount(TextEditor, {
      mocks: {
        $t: () => {},
        $tc: () => {},
      },
      propsData: {
        label: "subtitle",
        placeholder: "",
        content: "",
        height: 100,
      },
      data() {
        return dataInfo;
      },
    });

    expect(wrapper.find(".subtitle-2.label-text")).toBeTruthy();
    expect(wrapper.find(".subtitle-2.label-text").text()).toBe("subtitle");
  });
});

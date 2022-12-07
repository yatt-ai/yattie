<template>
  <v-container class="content-wrapper">
    <div class="title">Note Templates</div>
    <p class="subtitle-1 mb-4">
      Improve your note taking and evidence labeling with pre-populated
      templates
    </p>

    <v-row>
      <v-col cols="12" class="pa-4">
        <div class="mb-3 session-type">
          <p class="subtitle-1 mb-1">Apply to</p>
          <v-select
            :items="sessionTypes"
            v-model="type"
            placeholder="Session Type"
            solo
            dense
            hide-details="true"
            @change="handleTemplate"
          ></v-select>
        </div>
        <div class="mb-3 precond">
          <text-editor
            label="Preconditions"
            placeholder="Define required preconditions for this test."
            @update-data="updatePrecondition"
            :content="template.precondition.content"
            :height="150"
          />
        </div>
        <!--
        <div class="mb-3 issue">
          <div class="subtitle-2 label-text">Issue</div>
          <v-text-field
            placeholder="Enter a title for the project"
            outlined
            dense
            :height="32"
            v-model="template.issue"
            hide-details="true"
          ></v-text-field>
        </div>
        <div class="mb-7 bug">
          <div class="subtitle-2 label-text">Bug</div>
          <v-radio-group
            v-model="template.isBug"
            row
            class="ma-0 pa-0 radio-control"
            dense
            hide-details
          >
            <v-radio label="Yes" :value="true"></v-radio>
            <v-radio label="No" :value="false"></v-radio>
          </v-radio-group>
        </div>
        -->
        <div class="footer">
          <v-row>
            <v-col cols="6 pr-2">
              <v-btn
                small
                block
                color="white"
                class="text-capitalize"
                @click="handleCancel"
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="6 pl-2">
              <v-btn
                small
                block
                color="primary"
                class="text-capitalize"
                @click="saveTemplate"
              >
                Save Template
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TextEditor from "../TextEditor.vue";
import { SESSION_TYPES } from "../../modules/constants";
export default {
  name: "TemplateTab",
  components: {
    TextEditor,
  },
  props: {
    config: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    config: function (newValue) {
      this.setting = newValue;
    },
  },
  data() {
    return {
      setting: this.config,
      templates: this.config.templates,
      template: this.config.templates[0],
      type: this.config.templates[0].type,
      sessionTypes: SESSION_TYPES,
    };
  },
  mounted() {},
  methods: {
    updatePrecondition({ content, text }) {
      this.template.precondition.content = content;
      this.template.precondition.text = text;
    },
    handleTemplate() {
      this.templates.map((item) => {
        let temp = Object.assign({}, item);
        if (temp.type === this.type) {
          this.template = temp;
        }
      });
    },
    handleCancel() {
      this.type = this.templates[0].type;
      this.template = this.templates[0];
    },
    saveTemplate() {
      this.templates = this.templates.map((item) => {
        let temp = Object.assign({}, item);
        if (temp.type === this.template.type) {
          temp = this.template;
        }
        return temp;
      });
      this.setting.templates = this.templates;
      this.$emit("submit-config", this.setting);
    },
  },
};
</script>
<style scoped>
.content-wrapper {
  height: 100vh;
  width: 100%;
  overflow-y: auto;
}
.body-1 {
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 12px !important;
  line-height: 16px !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
  color: #6b7280 !important;
}
.subtitle-1 {
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 20px !important;
  color: #111827 !important;
}
.caption {
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 13px !important;
  line-height: 16px !important;
  color: #6b7280;
}
</style>

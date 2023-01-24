<template>
  <v-container>
    <v-row class="text-left">
      <v-col cols="12">
        <div class="title">
          <div class="subtitle-2 label-text">{{ $tc("caption.title", 1) }}</div>
          <v-text-field
            :placeholder="$t('message.enter_brief_charter_name')"
            outlined
            dense
            :height="35"
            v-model="title"
            hide-details="true"
            @input="updateTitle"
          ></v-text-field>
        </div>
        <div class="mt-4">
          <div class="subtitle-2 label-text">
            {{ $tc("caption.charter", 1) }}
          </div>
          <v-tabs
            class="charter-tab"
            color="cyan"
            dark
            hide-slider
            background-color="primary"
            :height="32"
          >
            <v-tab ripple class="text-capitalize">
              {{ $tc("caption.editor", 1) }}
            </v-tab>
            <v-tab ripple class="text-capitalize">
              {{ $tc("caption.mind_map", 1) }}
            </v-tab>
            <v-tab-item :transition="false">
              <v-tiptap
                v-model="charter.content"
                :placeholder="$t('message.describe_test_charter')"
                ref="charter"
                :toolbar="[
                  'headings',
                  '|',
                  'bold',
                  'italic',
                  'underline',
                  '|',
                  'color',
                  '|',
                  'bulletList',
                  'orderedList',
                  '|',
                  'link',
                  'emoji',
                  'blockquote',
                ]"
                @input="updateCharter"
              >
              </v-tiptap>
            </v-tab-item>
            <v-tab-item :transition="false">
              <div class="mindmap-wrapper">
                <mindmap-editor
                  :nodesData="mindmap.nodes"
                  :connectionsData="mindmap.connections"
                  :edit="true"
                  :auto-save="true"
                  @submit-mindmap="handleMindmap"
                />
              </div>
            </v-tab-item>
          </v-tabs>
        </div>
        <div class="mt-4 timelimit">
          <div class="subtitle-2 label-text">
            {{ $tc("caption.time_limit", 1) }}
          </div>
          <div class="timer-box-wrapper">
            <v-text-field
              placeholder="00:00"
              v-mask="'##:##'"
              outlined
              dense
              v-model="duration"
              @input="handleDuration"
              hide-details="true"
              :disabled="this.$store.state.status !== 'pending' ? true : false"
            />
            <span class="timer-box-wrapper-label">
              {{ $tc("caption.minute", 1) }}
            </span>
          </div>
        </div>
        <div class="mt-4 pre-cond">
          <v-tiptap
            v-model="precondition.content"
            :placeholder="$t('message.define_required_precondition')"
            label="Preconditions"
            ref="precondition"
            :toolbar="[
              'headings',
              '|',
              'bold',
              'italic',
              'underline',
              '|',
              'color',
              '|',
              'bulletList',
              'orderedList',
              '|',
              'link',
              'emoji',
              'blockquote',
            ]"
            @input="updatePrecondition"
          >
          </v-tiptap>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { VContainer, VRow, VCol, VTextField } from "vuetify/lib/components";
import MindmapEditor from "./MindmapEditor.vue";

import {
  DEFAULT_CHARTER_MAP_NODES,
  DEFAULT_CHARTER_MAP_CONNECTIONS,
} from "../modules/constants";

export default {
  name: "TestWrapper",
  components: {
    VContainer,
    VRow,
    VCol,
    VTextField,
    MindmapEditor,
  },
  data() {
    return {
      title: this.$store.state.title,
      charter: {
        content: this.$store.state.charter.content,
        text: this.$store.state.charter.text,
      },
      mindmap: {
        nodes: DEFAULT_CHARTER_MAP_NODES,
        connections: DEFAULT_CHARTER_MAP_CONNECTIONS,
      },
      precondition: {
        content: this.$store.state.precondition.content,
        text: this.$store.state.precondition.text,
      },
      duration: "",
    };
  },
  watch: {
    "$store.state.title": {
      deep: true,
      handler(newValue) {
        this.title = newValue;
      },
    },
    "$store.state.charter": {
      deep: true,
      handler(newValue) {
        this.charter.content = newValue.content;
        this.charter.text = newValue.text;
      },
    },
    "$store.state.precondition": {
      deep: true,
      handler(newValue) {
        this.precondition.content = newValue.content;
        this.precondition.text = newValue.text;
      },
    },
    "$store.state.mindmap": {
      deep: true,
      handler(newValue) {
        this.mindmap.nodes = newValue.nodes;
        this.mindmap.connections = newValue.connections;
      },
    },
  },
  mounted() {
    this.$root.$on("new-session", () => {
      this.duration = "";
    });
  },
  methods: {
    updateTitle() {
      this.$store.commit("setTitle", this.title);
    },
    updateCharter() {
      const regex = /(<([^>]+)>)/gi;
      this.charter.text = this.charter.content.replace(regex, "");
      this.$store.commit("setCharter", this.charter);
    },
    updatePrecondition() {
      const regex = /(<([^>]+)>)/gi;
      this.precondition.text = this.precondition.content.replace(regex, "");
      this.$store.commit("setPrecondition", this.precondition);
    },
    handleDuration() {
      const timeArr = this.duration.split(":");
      let minutes = parseInt(timeArr[0], 10);
      let seconds = parseInt(timeArr[1], 10);
      if (Number.isNaN(minutes)) {
        minutes = 0;
      }
      if (Number.isNaN(seconds)) {
        seconds = 0;
      }
      if (seconds > 59) {
        this.duration = timeArr[0] + ":00";
        return;
      }
      const temp = minutes * 60 + seconds;
      this.$store.commit("setDuration", temp);
    },
    handleMindmap(value) {
      const new_nodes = value.nodes.map((obj) => {
        return {
          id: obj.id,
          text: obj.text,
          fx: obj.fx,
          fy: obj.fy,
        };
      });
      const new_connections = value.connections.map((obj) => {
        return {
          source: obj.source.id,
          target: obj.target.id,
        };
      });
      const data = {
        nodes: new_nodes,
        connections: new_connections,
      };
      this.$store.commit("setMindmap", data);
    },
  },
};
</script>

<style scoped>
.timer-box-wrapper {
  display: flex;
  column-gap: 10px;
  align-items: center;
  max-width: 10em;
}
.timer-box-wrapper-label {
  color: #666;
}
.charter-tab {
  border-top-left-radius: 4px !important;
  border-top-right-radius: 4px !important;
}
.mindmap-wrapper {
  border: 1px solid #d1d5db;
  border-top: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
</style>

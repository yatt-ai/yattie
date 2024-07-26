<template>
  <div class="flex flex-column justify-center align-center">
    <div class="mindmap-control-btn flex flex-row justify-center gap-md">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <ColorPicker v-on="on" :currentColor="currentColor" />
        </template>
        <span>{{ $tc("caption.color", 1) }}</span>
      </v-tooltip>
      <v-divider vertical />
      <v-select
        v-model="shape"
        :items="shapeTypes"
        hide-details="true"
        style="width: 75px; height: 30px"
        color="secondary"
        solo
        dense
        @change="handleShape"
      >
        <template v-slot:selection="{ attr, on, item }">
          <div v-bind="attr" v-on="on" style="line-height: 0">
            <img
              :src="require('../../assets/icon/' + item + '.svg')"
              width="30"
              alt="avatar"
            />
          </div>
        </template>
        <template v-slot:item="{ item }">
          <div style="line-height: 0">
            <img
              :src="require('../../assets/icon/' + item + '.svg')"
              width="30"
              alt="avatar"
            />
          </div>
        </template>
      </v-select>
      <v-divider vertical />
      <v-select
        :items="statusTypes"
        style="width: 135px; height: 30px"
        color="secondary"
        v-model="status"
        :placeholder="$tc('caption.comment_type')"
        solo
        dense
        hide-details="true"
        @change="handleStatus"
      ></v-select>
      <v-divider vertical />
      <v-btn class="btn" small @click="openTags = !openTags"> + Add Tag</v-btn>
      <v-divider vertical />
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <!-- <div class="mindmap-ctrl-btn" v-on="on">
            <v-btn icon color="#6b7280" @click="handleFileUpload"> -->
          <v-file-input
            v-on="on"
            type="file"
            hidden
            v-model="attachment"
            truncate-length="15"
            style="padding-top: 0px; margin-top: 0px"
            hide-input
            prepend-icon="mdi-upload"
            @change="handleFileUpload"
          />
          <!-- </v-btn>
          </div> -->
        </template>
        <span>{{ $tc("caption.upload_attachment", 1) }}</span>
      </v-tooltip>
    </div>
    <div
      class="mindmap-control-btn mt-2"
      style="width: 350px; padding: 3px"
      v-if="openTags"
    >
      <v-autocomplete
        v-model="tags"
        :items="allTags"
        dense
        chips
        small-chips
        label="Tags"
        @change="handleTags"
        multiple
        solo
        prepend-icon="mdi-database-search"
      ></v-autocomplete>
    </div>
  </div>
</template>

<script>
import ColorPicker from "./ColorPicker.vue";

export default {
  name: "NodeDetailPad",
  data() {
    return {
      statusTypes: ["Passed", "Failed", "In Progress"],
      shapeTypes: [
        "rectangle",
        "ellipse",
        "triangle",
        "downward-triangle",
        "diamond",
      ],
      status: "Passed",
      shape: "rectangle",
      tags: ["Tag1", "Tag2"],
      openTags: false,
      id: "",
      attachment: null,
      attachments: [],
      allTags: [
        "Tag1",
        "Tag2",
        "Tag3",
        "Tag4",
        "Tag5",
        "Tag6",
        "Tag7",
        "Tag8",
        "Tag9",
        "Tag10",
      ],
    };
  },
  components: {
    ColorPicker,
  },
  mounted() {
    this.status = this.currentStatus;
    this.shape = this.currentShape;
    this.tags = this.currentTags;
    this.id = this.currentId;
    this.attachments = this.currentAttachments;
  },
  watch: {
    currentStatus: function (newValue) {
      this.status = newValue;
    },
    currentShape: function (newValue) {
      this.shape = newValue;
    },
    currentTags: function (newValue) {
      this.tags = newValue;
    },
    currentAttachments: function (newValue) {
      this.attachments = newValue;
    },
  },
  props: {
    currentColor: {
      type: String,
      default: () => "",
    },
    currentShape: {
      type: String,
      default: () => "",
    },
    currentStatus: {
      type: String,
      default: () => "Passed",
    },
    currentId: {
      type: String,
      default: () => "",
    },
    currentTags: {
      type: Array,
      default: () => [],
    },
    currentAttachments: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleShape() {
      this.$root.$emit("update:shape", this.shape);
    },
    handleStatus() {
      this.$root.$emit("update:status", this.status);
    },
    handleTags() {
      this.$root.$emit("update:tags", this.tags);
    },
    handleFileUpload() {
      this.attachments.push(this.attachment);
      this.$root.$emit("update:attachments", this.attachments);
    },
  },
};
</script>

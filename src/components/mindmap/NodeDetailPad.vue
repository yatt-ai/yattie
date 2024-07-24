<template>
  <div class="flex flex-row justify-center gap-md">
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <ColorPicker v-on="on" />
      </template>
      <span>{{ $tc("caption.color", 1) }}</span>
    </v-tooltip>
    <v-divider vertical />
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <div @click="handleShape('rectangle')" v-on="on">
          <img
            width="24"
            height="24"
            :src="require('../../assets/icon/rectangle.svg')"
          />
        </div>
      </template>
      <span>{{ $tc("caption.rectangle", 1) }}</span>
    </v-tooltip>
    <v-divider vertical />
    <v-select
      :items="statusTypes"
      color="secondary"
      v-model="status"
      :placeholder="$tc('caption.comment_type')"
      solo
      dense
      hide-details="true"
    ></v-select>
  </div>
</template>

<script>
import ColorPicker from "./ColorPicker.vue";

export default {
  name: "NodeDetailPad",
  data() {
    return {
      statusTypes: ["Passed", "Failed", "In Progress"],
      status: "Passed",
    };
  },
  components: {
    ColorPicker,
  },
  props: {
    shape: {
      type: String,
      default: () => "",
    },
  },
  methods: {
    handleShape(shape) {
      this.$root.$emit("update:shape", shape);
    },
  },
};
</script>

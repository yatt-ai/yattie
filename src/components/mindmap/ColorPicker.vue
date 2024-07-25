<template>
  <div>
    <div
      class="color-picker"
      @click="handleOpenColorPicker"
      :style="{ backgroundColor: currentColor }"
    />
    <ColorPickerDialog
      v-model="isOpen"
      @close="isOpen = false"
      :colorType="colorType"
      @save="handleSave"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ColorPickerDialog from "../dialogs/ColorPickerDialog.vue";
export default {
  name: "ColorPicker",
  components: {
    ColorPickerDialog,
  },
  props: {
    colorType: {
      type: String,
      default: () => "marker",
    },
    currentColor: {
      type: String,
      default: () => "",
    },
  },
  watch: {
    colorType: function (newValue) {
      this.type = newValue;
    },
    color: function (newValue) {
      this.color = newValue;
    },
  },
  created() {
    this.colors = this.config?.colors;
  },
  computed: {
    ...mapGetters({
      config: "config/fullConfig",
    }),
  },
  data() {
    return {
      type: this.colorType,
      colors: this.config?.colors,
      fillType: "fill",
      configToChange: null,
      isOpen: false,
      color: this.config?.colors[this.type + "Color"] || "#101828",
    };
  },
  methods: {
    handleOpenColorPicker() {
      this.isOpen = true;
    },
    handleSave(data) {
      this.isOpen = false;
      this.color = data.color;
      this.fillType = data.type;
      this.$root.$emit("update-color", data);
    },
  },
};
</script>
<style scoped>
.border-bottom {
  border-bottom: 1px solid #e5e7eb;
}
.color-picker {
  background-color: #1976d2ff;
  cursor: pointer;
  height: 30px;
  width: 30px;
  border-radius: 50%;
}
.theme--dark .border-bottom {
  border-color: #374151;
}
.theme--light .border-bottom {
  border-color: #e5e7eb;
}
</style>

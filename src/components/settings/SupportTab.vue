<template>
  <v-container class="content-wrapper">
    <v-row>
      <v-col cols="12" class="border-bottom pa-4">
        <p class="body-1">{{ $tc("caption.todo", 1) }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SupportTab",
  components: {},
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
      settings: this.config,
    };
  },
  methods: {
    handleConfig() {
      this.$emit("submit-config", this.settings);
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
.jira-link {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #6d28d9;
  text-decoration: none;
}
.border-bottom {
  border-bottom: 1px solid #e5e7eb;
}
</style>

<template>
  <v-container class="workspace">
    <div class="tab-bar">
      <v-tabs :height="26" centered hide-slider>
        <v-tab class="timeline-tab" @click="currentTab = 'timeline'">
          Timeline
        </v-tab>
        <v-tab class="notes-tab" @click="currentTab = 'notes'"> Notes </v-tab>
      </v-tabs>
    </div>
    <div class="tab-content">
      <v-tabs-items v-model="currentTab">
        <v-tab-item value="timeline" :transition="false">
          <TimelineWrapper
            :items="itemLists"
            :selectedItems="selected"
            :event-type="eventName"
            @submit-session="updateActiveSession"
          />
        </v-tab-item>
        <v-tab-item value="notes" :transition="false">
          <NotesWrapper
            :items="itemLists"
            :selectedItems="selected"
            @submit-session="updateActiveSession"
          />
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-container>
</template>
<script>
import NotesWrapper from "./NotesWrapper.vue";
import TimelineWrapper from "./TimelineWrapper.vue";

export default {
  name: "WorkspaceWrapper",
  components: {
    NotesWrapper,
    TimelineWrapper,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    selectedItems: {
      type: Array,
      default: () => [],
    },
    eventType: {
      type: String,
      default: () => "",
    },
  },
  watch: {
    items: function (newValue) {
      this.itemLists = newValue;
    },
    selectedItems: function (newValue) {
      this.selected = newValue;
    },
    eventType: function (newValue) {
      this.eventName = newValue;
    },
  },
  data() {
    return {
      itemLists: this.items,
      selected: this.selectedItems,
      eventName: this.eventType,
      currentTab: "timeline",
    };
  },
  methods: {
    updateActiveSession(data) {
      this.$emit("submit-session", data);
    },
  },
};
</script>
<style scoped>
.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.v-tab {
  border: 1px solid #d1d5db;
  text-transform: capitalize;
}
.theme--dark .v-tab {
  border-color: #4b5563;
}
.workspace .theme--light.v-tabs .v-tabs-bar .v-tab--active,
.workspace .theme--light.v-tabs .v-tabs-bar .v-tab:not(.v-tab--disabled) {
  font-weight: bold;
  border: 1px solid #6d28d9;
}
.workspace .theme--light.v-tabs .v-tabs-bar .v-tab--disabled,
.workspace .theme--light.v-tabs .v-tabs-bar .v-tab:not(.v-tab--active) {
  color: rgba(0, 0, 0, 0.54);
  border: 1px solid #d1d5db;
}
</style>

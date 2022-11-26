<template>
  <v-dialog v-bind="$attrs" v-on="$listeners" persistent width="350">
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <LogoWrapper :height="20" :width="60" />
        <v-card-title class="title"> {{ title || "Delete" }} </v-card-title>
        <v-card-text class="text">
          {{ text || "Are you sure you want to delete this?" }}
        </v-card-text>
        <v-card-actions>
          <v-btn
            small
            color="primary"
            class="text-capitalize btn"
            @click="allow"
          >
            Allow
          </v-btn>
          <v-btn
            small
            color="white"
            class="text-capitalize btn"
            @click="cancel"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script>
import LogoWrapper from "../LogoWrapper.vue";
export default {
  name: "AudioRecordingDialog",
  components: {
    LogoWrapper,
  },
  props: {
    title: String,
    text: String,
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    allow() {
      this.$emit("allow");
    },
  },
};
</script>

<style scoped>
.v-card {
  padding: 24px;
}
.v-card__title {
  padding: 0;
  padding-top: 0.5rem;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #111827;
}
.v-card__text {
  padding: 0;
  padding-top: 0.5rem;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #6b7280;
}
.v-card__actions {
  padding: 0;
  padding-top: 1rem;
}
</style>

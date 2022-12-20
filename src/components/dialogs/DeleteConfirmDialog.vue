<template>
  <v-dialog v-bind="$attrs" v-on="$listeners" persistent width="350">
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <LogoWrapper :height="20" :width="60" />
        <v-card-title class="title">
          {{ title || $tc("caption.delete", 1) }}
        </v-card-title>
        <v-card-text class="text">
          {{ text || $t("message.confirm_delete") }}
        </v-card-text>
        <v-card-actions>
          <v-btn
            small
            color="primary"
            class="text-capitalize btn"
            @click="confirm"
          >
            {{ $tc("caption.confirm", 1) }}
          </v-btn>
          <v-btn
            small
            color="white"
            class="text-capitalize btn"
            @click="cancel"
          >
            {{ $tc("caption.cancel", 1) }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script>
import LogoWrapper from "../LogoWrapper.vue";
export default {
  name: "DeleteConfirmDialog",
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
    confirm() {
      this.$emit("confirm");
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

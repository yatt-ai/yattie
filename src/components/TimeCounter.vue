<template>
  <v-container class="timecounter-wrapper">
    <v-row class="ma-0">
      <v-col cols="12" class="pa-0">
        <div class="time-wrapper">
          <div class="time">
            <span class="time-title">Elapsed time</span>
            <span class="time-value" color="primary">{{ elapsedTime }}</span>
          </div>
          <div class="time">
            <span class="time-title">Remaining time</span>
            <span
              :class="`time-value ${this.$store.state.status}`"
              color="primary"
              >{{ remainingTime }}</span
            >
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { VContainer, VRow, VCol } from "vuetify/lib/components";

export default {
  name: "TimeCounter",
  components: {
    VContainer,
    VRow,
    VCol,
  },
  data() {
    return {};
  },
  computed: {
    elapsedTime() {
      const timer = this.$store.state.timer;
      const date = new Date(null);
      date.setSeconds(timer);
      const result = date.toISOString().substr(11, 8);
      return result;
    },
    remainingTime() {
      const timer = this.$store.state.duration;
      const date = new Date(null);
      date.setSeconds(timer);
      const result = date.toISOString().substr(11, 8);
      return result;
    },
  },
};
</script>
<style scoped>
.timecounter-wrapper {
  border-top: 1px solid #e5e7eb;
  background: #f3f4f6;
}
.time-wrapper {
  display: flex;
  flex-direction: row;
  column-gap: 2rem;
  justify-content: center;
}
.time-wrapper .time {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.time-wrapper .time .time-title {
  font-size: 13px;
  color: #6b7280;
  line-height: 1;
}
.time-wrapper .time .time-value {
  font-size: 16px;
  color: #6d28d9;
}
.time-wrapper .time .time-value.proceed {
  color: #ff6000;
}
</style>

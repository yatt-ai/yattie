<template>
  <v-container class="wrapper">
    <div class="content">
      <div class="logo mb-10">
        <LogoWrapper :height="34" :width="120" />
      </div>
      <div class="new-section">
        <div class="subtitle-1 signup-title text-center">
          {{ $tc("caption.signup_test_app", 1) }}
        </div>
        <v-btn
          class="my-4 text-capitalize signup"
          fill
          block
          small
          color="primary"
          to="/authentication/signup2"
        >
          ${{ $tc("caption.sign_up", 2) }}
        </v-btn>
        <v-btn
          class="my-4 text-capitalize signin"
          fill
          small
          block
          color="white"
          to="/authentication/signin"
        >
          {{ $tc("caption.sign_in", 1) }}
        </v-btn>
      </div>
    </div>
    <div class="footer">
      <v-alert class="terms-alert" dark>
        {{ $t("message.signup_policy") }}
        <span style="color: #000; font-weight: 500">
          {{ $tc("caption.term_data_policy", 1) }}
        </span>
        {{ $tc("caption.and", 1) }}
        &nbsp;
        <span style="color: #000; font-weight: 500">
          {{ $tc("caption.cookie_policy", 1) }}
        </span>
        .
      </v-alert>
    </div>
  </v-container>
</template>

<script>
import { VContainer, VBtn } from "vuetify/lib/components";
import LogoWrapper from "../LogoWrapper.vue";
export default {
  name: "SignupHomeWrapper",
  components: {
    VContainer,
    VBtn,
    LogoWrapper,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow-y: hidden;
  /* align-items: center; */
  max-width: 450px;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  padding-top: 30px;
}
.new-section {
  width: 100%;
  padding: 0;
}
.signup-title {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #111827;
  text-align: center;
}
.footer {
  flex-grow: 0;
}
.terms-alert {
  background-color: #f3f4f6;
  border-radius: 6px;
  padding: 16px 40px;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: #6b7280;
  letter-spacing: 1px;
}
</style>

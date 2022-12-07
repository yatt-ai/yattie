<template>
  <v-container class="wrapper">
    <div class="header py-4">
      <v-btn
        class="text-capitalize pa-0 back-btn"
        plain
        to="/authentication/signup2"
      >
        <v-icon class="ma-0">mdi-chevron-left</v-icon>Back
      </v-btn>
      <div class="subtitle-1 signup-title text-center">
        <span>Sign Up</span>
      </div>
    </div>
    <div class="content mt-2">
      <v-row>
        <v-col cols="12">
          <div class="subtitle-2 label-text">Start Test As</div>
          <v-radio-group
            v-model="start"
            row
            class="ma-0 pa-0"
            dense
            hide-details
          >
            <v-radio label="Individual" value="individual"></v-radio>
            <v-radio label="Organization" value="organization"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="subtitle-2 label-text">Your Email</div>
          <v-text-field
            placeholder="you@example.com"
            outlined
            dense
            :height="35"
            v-model="email"
            hide-details="true"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="subtitle-2 label-text">Enter Service URL</div>
          <v-text-field
            placeholder="you@example.com"
            outlined
            dense
            :height="35"
            v-model="url"
            hide-details="true"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn
            class="text-capitalize btn_signup"
            color="primary"
            fill
            small
            block
          >
            Sign Up
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div class="footer">
      <v-alert class="terms-alert" dark>
        By signing up, you agree to our
        <span style="color: #000; font-weight: 500">Terms, Data Policy</span>
        and <span style="color: #000; font-weight: 500">Cookies Policy</span>.
      </v-alert>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Signup3Wrapper",
  components: {},
  props: {},
  data() {
    return {
      start: "individual",
      email: "",
      url: "",
    };
  },
  computed: {},
  methods: {},
};
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  max-width: 450px;
}
.header {
  display: flex;
  align-items: center;
  padding: 12px;
}
.header .back-btn {
  flex-grow: 0;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
}
.header .signup-title {
  flex-grow: 1;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #111827;
  text-align: center;
}
.header .signup-title span {
  margin-left: -50px;
}
.content {
  background-color: #fff;
  border-radius: 8px;
  padding: 32px 40px;
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

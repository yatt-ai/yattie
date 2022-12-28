<template>
  <v-container class="wrapper">
    <div class="header py-4">
      <v-btn class="text-capitalize pa-0 back-btn" plain to="/authentication">
        <v-icon class="ma-0">mdi-chevron-left</v-icon>
        {{ $tc("caption.back", 1) }}
      </v-btn>
      <div class="subtitle-1 signup-title text-center">
        <span>{{ $tc("caption.sign_in", 1) }}</span>
      </div>
    </div>
    <div class="content mt-2">
      <v-row>
        <v-col cols="12">
          <v-btn class="mb-4 outline-btn yattie" block outlined color="white">
            <img :src="require('../../assets/icon/yattie.png')" />
            <div class="btn-text">{{ $tc("caption.signin_yattie", 1) }}</div>
          </v-btn>
          <v-btn class="mb-4 outline-btn jira" block outlined color="white">
            <img :src="require('../../assets/icon/jira.png')" />
            <div class="btn-text">{{ $tc("caption.signin_jira", 1) }}</div>
          </v-btn>
          <!--<v-btn class="mb-4 outline-btn" block outlined color="white">
            <img :src="require('../../assets/icon/testrail.png')" />
            <div class="btn-text">{{ $tc("caption.signin_testrail", 1) }}</div>
          </v-btn>
          <v-btn class="mb-4 outline-btn" block outlined color="white">
            <img :src="require('../../assets/icon/qtest.png')" />
            <div class="btn-text">{{ $tc("caption.signin_qtest", 1) }}</div>
          </v-btn>
          <v-btn class="mb-4 outline-btn" block outlined color="white">
            <img :src="require('../../assets/icon/practitest.png')" />
            <div class="btn-text">
              {{ $tc("caption.signin_practitest", 1) }}
            </div>
          </v-btn>-->
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="divider">
          <span></span>
          <div class="divider-text">Or</div>
          <span></span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="d-flex justify-center align-center">
          <div class="text-center signup-text">Don't have an account?</div>
          <v-btn
            class="text-capitalize pa-0 signup-btn"
            color="primary"
            plain
            to="/authentication/signup2"
          >
            {{ $tc("caption.sign_up", 1) }}
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "SigninWrapper",
  components: {},
  props: {},
  data() {
    return {};
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
.outline-btn {
  display: flex;
  border: 1px solid #d1d5db;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  text-transform: none !important;
}
.outline-btn:hover {
  background-color: #d1d5db;
}
.outline-btn .btn-text {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #111827;
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
}
.divider {
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 5px;
}
.divider span {
  flex-grow: 1;
  height: 1px;
  background-color: #d1d5db;
}
.divider-text {
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
}
.signup-text {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  color: #6b7280;
}
.signup-btn {
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  color: #6d28d9;
}
</style>

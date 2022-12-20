import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";

import DefaultLayout from "./layouts/Default.vue";
import MinimizeLayout from "./layouts/Minimize.vue";

import VueMask from "v-mask";
import i18n from "./i18n";

Vue.use(VueMask);

Vue.component("default-layout", DefaultLayout);
Vue.component("minimize-layout", MinimizeLayout);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");

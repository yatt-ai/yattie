import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VTiptap from "@yatt-ai/vuetify-tiptap";
import router from "./router";
import store from "./store";
import integrationHelpers from "./integrations/IntegrationHelpers";

import DefaultLayout from "./layouts/Default.vue";
import MinimizeLayout from "./layouts/Minimize.vue";

import VueMask from "v-mask";
import i18n from "./i18n";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTableList } from "@fortawesome/free-solid-svg-icons";

library.add(faComment);
library.add(faTriangleExclamation);
library.add(faClipboard);
library.add(faLightbulb);
library.add(faCircleQuestion);
library.add(faBookmark);
library.add(faPlus);
library.add(faTableList);

Vue.use(VTiptap);
Vue.use(VueMask);

Vue.component("default-layout", DefaultLayout);
Vue.component("minimize-layout", MinimizeLayout);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

const plugins = {
  install() {
    Vue.integrationHelpers = integrationHelpers;
    Vue.prototype.$integrationHelpers = integrationHelpers;
  },
};
Vue.use(plugins);

new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");

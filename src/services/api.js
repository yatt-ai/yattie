import axios from "axios";
import Vue from "vue";

Vue.mixin({
  beforeCreate() {
    const options = this.$options;
    if (options.api) this.$api = options.api;
    else if (options.parent && options.parent.$api)
      this.$api = options.parent.$api;
  },
});

export default function makeAPI(baseURL) {
  return axios.create({
    baseURL: baseURL,
    withCredentials: true,
  });
}

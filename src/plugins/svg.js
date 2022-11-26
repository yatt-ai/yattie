import svgJs from "svg.js/dist/svg";

export default {
  install(Vue) {
    Vue.prototype.$svg = svgJs;
  },
};

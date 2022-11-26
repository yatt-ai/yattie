import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

const getSavedThemeMod = () =>
  localStorage.getItem("isDarkMode") === "true" ? true : false;

export default new Vuetify({
  theme: {
    dark: getSavedThemeMod(),
    themes: {
      dark: {
        accent: colors.amber.accent1,
        accenttext: colors.amber.lighten4,
        danger: colors.red.accent3,
        darkerblue: "#1d262b",
        componentmain: colors.blueGrey.darken4,
        warning: colors.orange,
      },
      light: {
        default: "#6B7280",
        primary: "#6D28D9",
        accent: colors.indigo.accent2,
        accenttext: colors.indigo.darken2,
        warning: colors.red.accent3,
        componentmain: colors.blueGrey.lighten5,
      },
    },
  },
});

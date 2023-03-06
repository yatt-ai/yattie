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
        default: "#6B7280",
        primary: "#6D28D9",
        secondary: "#FFFFFF",
        black: "#000000",
        danger: colors.red.accent3,
        accent: colors.amber.accent2,
        warning: colors.orange,
        background: "#1F2937",
        // accenttext: colors.amber.lighten4,
        // darkerblue: "#1d262b",
        // componentmain: colors.blueGrey.darken4,
      },
      light: {
        default: "#6B7280",
        primary: "#6D28D9",
        secondary: "#111827",
        black: "#000000",
        danger: colors.red.accent3,
        accent: colors.indigo.accent2,
        warning: colors.red.accent3,
        background: "#FFFFFF",
        // accenttext: colors.indigo.darken2,
        // componentmain: colors.blueGrey.lighten5,
      },
    },
  },
});

import Vue from "vue";
import Vuetify from "vuetify/lib";
import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "md",
  },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#D3613A",
        secondary: "#F6915A",
        tertiary: "#B45231",
        accent: "#39D4B0",
        info: "#5E5E5E",
        error: "#D44315",
        success: "#39D43F",
        warning: "#E8DE1A",
        background: "#F1F2F1",
      },
      dark: {
        // Unimplemented
      },
    },
  },
});

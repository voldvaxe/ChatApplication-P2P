import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import store from "./store";
import router from "./router";
import axios from "axios";
import VueSocketIO from "vue-3-socket.io";
import SocketIO from "socket.io-client";

const optionsVueIO = {
  debug: true,
  connection: SocketIO("http://localhost:8000"),
};

loadFonts();
axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL;
createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(new VueSocketIO(optionsVueIO))
  .mount("#app");

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import VueScreen from "vue-screen";

createApp(App)
  .use(VueScreen, "bootstrap")
  .use(i18n)
  .mount("#app");

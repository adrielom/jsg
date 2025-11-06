import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./pages/router";
import vuetify from "./vuetify";
import SimpleGame from "../examples/SimpleGame.vue";

const app = createApp(SimpleGame);

app.use(createPinia());
app.use(vuetify);
app.use(router);

app.mount("#app");

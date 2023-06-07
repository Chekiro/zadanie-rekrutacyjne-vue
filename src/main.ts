import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
//@ts-ignore
import router from "./router";

createApp(App).use(router).mount("#app");

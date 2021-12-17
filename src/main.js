import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.config.globalProperties.$isDevEnv = () => {
  // Vue CLI Service definisce process.env quando avvia il development server
  // Se trovo process.env e process.env.NODE_ENV è assegnato a development
  return (
    typeof process !== "undefined" &&
    typeof process.env !== "undefined" &&
    typeof process.env.NODE_ENV !== "undefined" &&
    process.env.NODE_ENV === "development");
};

app.config.globalProperties.$apiBaseURL = () => {
  let port = app.config.globalProperties.$isDevEnv()
    ? 8080
    : window.location.port;
  return `http://${window.location.hostname}:${port}/api`
};

app.use(router);
app.mount("#app");

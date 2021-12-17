import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.provide(
  "apiBaseURL",
  (() => {
    if (process?.env?.NODE_ENV === "development")
      return `http://${window.location.hostname}:8080`;
    else return "";
  })()
);

app.use(router);
app.mount("#app");

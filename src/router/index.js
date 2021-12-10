import { createRouter, createWebHashHistory } from "vue-router";
import Ricerca from "../views/Ricerca.vue";

const routes = [
  {
    path: "/",
    name: "Ricerca",
    component: Ricerca,
    props: true,
  },
  {
    path: "/iscrizioni",
    name: "Iscrizioni",
    component: () =>
      import("../views/Iscrizioni.vue"),
  },
  {
    path: "/annunci",
    component: () => import("../views/Annunci.vue")
  },
  {
    path: "/impostazioni",
    component: () => import("../views/Impostazioni.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

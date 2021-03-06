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
    component: () => import("../views/Iscrizioni.vue"),
  },
  {
    path: "/annunci",
    name: "Annunci",
    component: () => import("../views/Annunci.vue"),
  },
  {
    path: "/impostazioni",
    name: "Impostazioni",
    component: () => import("../views/Impostazioni.vue"),
  },
  {
    path: "/annuncio/:id",
    name: "Annuncio",
    component: () => import("../views/Annuncio.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/signup",
    name: "SignUp",
    component: () => import("../views/SignUp.vue"),
  },
  {
    path: "/profilo/:userId",
    name: "Profilo",
    component: () => import("../views/Profilo.vue"),
  },
  {
    path: "/pubblica-annuncio",
    name: "Pubblica annuncio",
    component: () => import("../views/NuovoAnnuncio.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

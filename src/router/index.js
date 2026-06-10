import { createRouter, createWebHistory } from "vue-router";

import DashboardView from "../views/DashboardView.vue";
import ClientsView from "../views/ClientsView.vue";
import TemplatesView from "../views/TemplatesView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: DashboardView,
    },
    {
      path: "/clientes",
      name: "clientes",
      component: ClientsView,
    },
    {
      path: "/templates",
      name: "templates",
      component: TemplatesView,
    },
  ],
});

export default router;

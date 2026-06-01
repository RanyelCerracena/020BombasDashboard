import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "../utils/supabase";

import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { requerAuthentication: false },
    },
    {
      path: "/",
      name: "dashboard",
      component: DashboardView,
      meta: { requerAuthentication: true },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const {data: {session}} = await supabase.auth.getSession();

  if (to.meta.requerAuthentication && !session) {
    next({name: 'login'})
  } else if (to.name === 'login' && session){
    next({ name: 'dashboard'})
  } else {
    next()
  }
})

export default router;

import Vue from 'vue';
import VueRouter from 'vue-router';

import Layout from '@/layouts/Layout.vue';
import Monero from '@/views/Monero.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'monero',
        component: Monero,
        meta: {requiresAuth: false},
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    // Exists when Browser's back/forward pressed
    if (savedPosition) {
      return savedPosition;

      // For anchors
    } else if (to.hash) {
      // 500ms timeout allows the page to load or else
      // smooth scrolling would not scroll to the correct position
      setTimeout(() => {
        const element = document.getElementById(to.hash.replace(/#/, ''));
        if (element && element.scrollIntoView) {
          element.scrollIntoView({block: 'end', behavior: 'smooth'});
        }
      }, 500);

      return {selector: to.hash};

      // By changing queries we are still in the same component, so "from.path" === "to.path" (new query changes just "to.fullPath", but not "to.path").
    } else if (from.path === to.path) {
      return {};
    }

    // Scroll to top
    return {x: 0, y: 0};
  }
});

export default router;

import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/Main.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/external/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "login" */ './views/external/Register.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import(/* webpackChunkName: "login" */ './views/external/ForgotPassword.vue')
    },
    {
      path: '/onboard',
      name: 'onboard',
      component: () => import(/* webpackChunkName: "login" */ './views/onboard/Onboard.vue')
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) next('login')
  else next()
})

export default router

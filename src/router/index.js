import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "login" */ '@/views/Container.vue'),
      meta: {
        requiresAuth: false
      },
      children: [
        {
          path: '/',
          component: () => import(/* webpackChunkName: "login" */ '@/views/dashboard/Dashboard.vue')
        },
        {
          path: 'import',
          component: () => import(/* webpackChunkName: "login" */ '@/views/import/Import.vue')
        }
      ]
    },
    {
      path: '/import',
      component: () => import(/* webpackChunkName: "login" */ '@/views/import/Import.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/external/Login.vue')
    },
    {
      path: '/register',
      component: () => import(/* webpackChunkName: "register" */ '@/views/external/Register.vue')
    },
    {
      path: '/forgot-password',
      component: () => import(/* webpackChunkName: "forgot-password" */ '@/views/external/ForgotPassword.vue')
    },
    {
      path: '/onboarding',
      component: () => import(/* webpackChunkName: "onboard" */ '@/views/onboarding/Onboarding.vue')
    },
    {
      path: '*',
      redirect: '/'
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

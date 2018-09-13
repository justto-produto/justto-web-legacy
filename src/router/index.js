import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "contentContainer" */ '@/views/content/ContentContainer.vue'),
      meta: {
        requiresAuth: false
      },
      children: [
        {
          path: '/',
          component: () => import(/* webpackChunkName: "dashboard" */ '@/views/content/Dashboard.vue')
        },
        {
          path: 'import',
          component: () => import(/* webpackChunkName: "import" */ '@/views/content/Import.vue')
        },
        {
          path: 'negotiation',
          component: () => import(/* webpackChunkName: "negotiation" */ '@/views/content/Negotiation.vue')
        },
        {
          path: 'settings',
          component: () => import(/* webpackChunkName: "settings" */ '@/views/content/Settings.vue')
        }
      ]
    },
    {
      path: '/user',
      component: () => import(/* webpackChunkName: "userContainer" */ '@/views/user/UserContainer.vue'),
      meta: {
        requiresAuth: false
      },
      children: [
        {
          path: '/',
          component: () => import(/* webpackChunkName: "profile" */ '@/views/user/Profile.vue')
        },
        {
          path: 'change-password',
          component: () => import(/* webpackChunkName: "Password" */ '@/views/user/ChangePassword.vue')
        },
        {
          path: 'notifications',
          component: () => import(/* webpackChunkName: "notifications" */ '@/views/user/Notifications.vue')
        }
      ]
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
      component: () => import(/* webpackChunkName: "forgotPassword" */ '@/views/external/ForgotPassword.vue')
    },
    {
      path: '/onboarding',
      component: () => import(/* webpackChunkName: "onboarding" */ '@/views/onboarding/Onboarding.vue')
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

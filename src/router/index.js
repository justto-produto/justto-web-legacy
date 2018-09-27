import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "contentContainer" */ '@/views/content/Container'),
      meta: {
        requiresAuth: false
      },
      children: [
        {
          path: '/',
          component: () => import(/* webpackChunkName: "dashboard" */ '@/views/content/dashboard/Dashboard')
        },
        {
          path: 'import',
          component: () => import(/* webpackChunkName: "importContainer" */ '@/views/content/import/Container'),
          children: [
            {
              path: '/',
              component: () => import(/* webpackChunkName: "import" */ '@/views/content/import/Import')
            },
            {
              path: 'new',
              component: () => import(/* webpackChunkName: "importUpload" */ '@/views/content/import/Upload')
            },
            {
              path: 'new/2',
              component: () => import(/* webpackChunkName: "importUpload" */ '@/views/content/import/Columns')
            },
            {
              path: 'new/3',
              component: () => import(/* webpackChunkName: "importEnrichment" */ '@/views/content/import/Enrichment')
            }
          ]
        },
        {
          path: 'negotiation',
          component: () => import(/* webpackChunkName: "negotiation" */ '@/views/content/negotiation/Negotiation')
        },
        {
          path: 'settings',
          component: () => import(/* webpackChunkName: "settings" */ '@/views/content/settings/Settings')
        }
      ]
    },
    {
      path: '/profile',
      component: () => import(/* webpackChunkName: "profileContainer" */ '@/views/profile/Container'),
      meta: {
        requiresAuth: false
      },
      children: [
        {
          path: '/',
          component: () => import(/* webpackChunkName: "profile" */ '@/views/profile/Profile')
        },
        {
          path: 'notifications',
          component: () => import(/* webpackChunkName: "notifications" */ '@/views/profile/Notifications')
        },
        {
          path: 'activities',
          component: () => import(/* webpackChunkName: "activities" */ '@/views/profile/Activities')
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

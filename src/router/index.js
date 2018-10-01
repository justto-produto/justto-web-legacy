import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "mainContainer" */ '@/views/main/MainContainer'),
      meta: {
        requiresAuth: false
      },
      children: [
        {
          path: '/',
          component: () => import(/* webpackChunkName: "dashboard" */ '@/views/main/dashboard/Dashboard')
        },
        {
          path: 'import',
          component: () => import(/* webpackChunkName: "importContainer" */ '@/views/main/import/ImportContainer'),
          children: [
            {
              path: '/',
              component: () => import(/* webpackChunkName: "import" */ '@/views/main/import')
            },
            {
              path: 'new',
              component: () => import(/* webpackChunkName: "importUpload" */ '@/views/main/import/Upload')
            },
            {
              path: 'new/2',
              component: () => import(/* webpackChunkName: "importUpload" */ '@/views/main/import/Columns')
            },
            {
              path: 'new/3',
              component: () => import(/* webpackChunkName: "importEnrichment" */ '@/views/main/import/Enrichment')
            }
          ]
        },
        {
          path: 'negotiation',
          component: () => import(/* webpackChunkName: "negotiation" */ '@/views/main/negotiation/Negotiation')
        },
        {
          path: 'settings',
          component: () => import(/* webpackChunkName: "settings" */ '@/views/main/settings/Settings')
        }
      ]
    },
    {
      path: '/profile',
      component: () => import(/* webpackChunkName: "profileContainer" */ '@/views/profile/ProfileContainer'),
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

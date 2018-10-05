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
          component: () => import(/* webpackChunkName: "dashboardIndex" */ '@/views/main/dashboard')
        },
        {
          path: 'import',
          component: () => import(/* webpackChunkName: "importContainer" */ '@/views/main/import/ImportContainer'),
          children: [
            {
              path: '/',
              component: () => import(/* webpackChunkName: "importIndex" */ '@/views/main/import')
            },
            {
              path: 'upload',
              component: () => import(/* webpackChunkName: "importUpload" */ '@/views/main/import/Upload')
            },
            {
              path: 'columns',
              component: () => import(/* webpackChunkName: "importColumns" */ '@/views/main/import/Columns')
            },
            {
              path: 'enrichment',
              component: () => import(/* webpackChunkName: "importEnrichment" */ '@/views/main/import/Enrichment')
            },
            {
              path: 'feedback',
              component: () => import(/* webpackChunkName: "importFeedback" */ '@/views/main/import/Feedback')
            }
          ]
        },
        {
          path: 'negotiation',
          component: () => import(/* webpackChunkName: "negotiationIndex" */ '@/views/main/negotiation')
        },
        {
          path: 'settings',
          component: () => import(/* webpackChunkName: "settingsIndex" */ '@/views/main/settings')
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
          component: () => import(/* webpackChunkName: "profileIndex" */ '@/views/profile')
        },
        {
          path: 'notifications',
          component: () => import(/* webpackChunkName: "notificationsIndex" */ '@/views/profile/Notifications')
        },
        {
          path: 'setup',
          component: () => import(/* webpackChunkName: "setupIndex" */ '@/views/profile/Setup')
        },
        {
          path: 'activities',
          component: () => import(/* webpackChunkName: "activitiesIndex" */ '@/views/profile/Activities')
        },
        {
          path: 'users',
          component: () => import(/* webpackChunkName: "usersIndex" */ '@/views/profile/Users')
        }
      ]
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "externalIndex" */ '@/views/external')
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
      path: '/onboarding/',
      component: () => import(/* webpackChunkName: "onboardingIndex" */ '@/views/onboarding')
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

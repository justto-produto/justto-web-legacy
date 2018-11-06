import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
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
          path: 'management',
          component: () => import(/* webpackChunkName: "managementIndex" */ '@/views/main/management')
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
      name: 'login',
      path: '/login',
      component: () => import(/* webpackChunkName: "externalIndex" */ '@/views/external')
    },
    {
      name: 'register',
      path: '/register',
      component: () => import(/* webpackChunkName: "register" */ '@/views/external/Register.vue')
    },
    {
      name: 'forgot-password',
      path: '/forgot-password',
      component: () => import(/* webpackChunkName: "forgotPassword" */ '@/views/external/ForgotPassword.vue')
    },
    {
      name: 'onboarding',
      path: '/onboarding/',
      component: () => import(/* webpackChunkName: "onboardingIndex" */ '@/views/onboarding')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) next('login')
  else next()
})

router.afterEach((to, from) => {
  if (to.name === 'onboarding' || to.name === 'login' || to.name === 'register' || to.name === 'forgot-password') {
    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width,initial-scale=1.0')
  } else {
    document.querySelector('meta[name="viewport"]').setAttribute('content', '')
  }
})

export default router

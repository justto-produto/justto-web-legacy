import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "mainContainer" */ '@/views/main/MainContainer'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          name: 'dashboard',
          path: '/',
          component: () => import(/* webpackChunkName: "dashboardIndex" */ '@/views/main/dashboard/Dashboard')
        },
        {
          name: 'import',
          path: 'import',
          component: () => import(/* webpackChunkName: "importIndex" */ '@/views/main/import/Import')
        },
        {
          path: 'import/new',
          component: () => import(/* webpackChunkName: "importNew" */ '@/views/main/import/new/NewImport')
        },
        {
          name: 'management',
          path: '/management',
          component: () => import(/* webpackChunkName: "managementIndex" */ '@/views/main/management/Management')
        },
        {
          path: 'management/ticket/',
          redirect: {
            name: 'management'
          }
        },
        {
          path: 'management/ticket/:id',
          component: () => import(/* webpackChunkName: "managementIndex" */ '@/views/main/management/Ticket')
        },
        {
          name: 'settings',
          path: 'settings',
          component: () => import(/* webpackChunkName: "settingsIndex" */ '@/views/main/settings/Settings')
        }
      ]
    },
    {
      path: '/profile',
      component: () => import(/* webpackChunkName: "profileContainer" */ '@/views/profile/ProfileContainer'),
      meta: {
        requiresAuth: true
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
      component: () => import(/* webpackChunkName: "externalIndex" */ '@/views/external/Login')
    },
    {
      name: 'register',
      path: '/register',
      component: () => import(/* webpackChunkName: "register" */ '@/views/external/Register')
    },
    {
      name: 'forgot-password',
      path: '/forgot-password',
      component: () => import(/* webpackChunkName: "forgotPassword" */ '@/views/external/ForgotPassword')
    },
    {
      name: 'new-password',
      path: '/new-password',
      component: () => import(/* webpackChunkName: "newPassword" */ '@/views/external/NewPassword')
    },
    {
      name: 'onboarding',
      path: '/onboarding',
      component: () => import(/* webpackChunkName: "onboarding" */ '@/views/onboarding/Onboarding'),
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'error',
      path: '/error',
      component: () => import(/* webpackChunkName: "jusError" */ '@/components/layouts/JusError')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (Store.getters.isLoggedIn) {
      if (Store.getters.hasWorkspace) {
        if (to.name === 'onboarding') {
          next('/')
        } else next()
      } else {
        if (to.name === 'onboarding') {
          next()
        } else next('onboarding')
      }
    } else next('login')
  } else if (from.query.token) next(false)
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

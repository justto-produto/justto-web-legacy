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
        requiresAuth: true,
        requiresTrack: false
      },
      children: [
        {
          name: 'dashboard',
          path: '/',
          // TODO: RETIRAR APÓS IMPLEMENTAR DASHBOARD
          redirect: 'management',
          component: () => import(/* webpackChunkName: "dashboardIndex" */ '@/views/main/dashboard/Dashboard'),
          meta: {
            requiresTrack: true
          }
        },
        {
          name: 'import',
          path: 'import',
          component: () => import(/* webpackChunkName: "importIndex" */ '@/views/main/import/Import'),
          meta: {
            requiresTrack: true
          }
        },
        {
          name: 'NewImport',
          path: 'import/new',
          component: () => import(/* webpackChunkName: "importNew" */ '@/views/main/import/NewImport'),
          meta: {
            requiresTrack: true
          }
        },
        {
          name: 'importLoading',
          path: 'import/loading',
          component: () => import(/* webpackChunkName: "importLoading" */ '@/views/main/import/Loading'),
          meta: {
            requiresTrack: true
          }
        },
        {
          name: 'management',
          path: '/management',
          component: () => import(/* webpackChunkName: "managementIndex" */ '@/views/main/management/Management'),
          meta: {
            requiresTrack: true
          }
        },
        {
          path: 'management/dispute/',
          redirect: {
            name: 'management'
          }
        },
        {
          name: 'dispute',
          path: 'management/dispute/:id',
          component: () => import(/* webpackChunkName: "managementIndex" */ '@/views/main/management/Dispute'),
          meta: {
            requiresTrack: true
          }
        },
        {
          name: 'profile',
          path: 'profile',
          component: () => import(/* webpackChunkName: "managementIndex" */ '@/views/main/profile/Profile'),
          meta: {
            requiresTrack: true
          }
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import(/* webpackChunkName: "externalIndex" */ '@/views/external/Login'),
      meta: {
        requiresTrack: true
      }
    },
    {
      name: 'register',
      path: '/register',
      component: () => import(/* webpackChunkName: "register" */ '@/views/external/Register'),
      meta: {
        requiresTrack: true
      }
    },
    {
      name: 'forgot-password',
      path: '/forgot-password',
      component: () => import(/* webpackChunkName: "forgotPassword" */ '@/views/external/ForgotPassword'),
      meta: {
        requiresTrack: true
      }
    },
    {
      name: 'new-password',
      path: '/new-password/:token',
      component: () => import(/* webpackChunkName: "newPassword" */ '@/views/external/NewPassword'),
      meta: {
        requiresTrack: true
      }
    },
    {
      name: 'onboarding',
      path: '/onboarding',
      component: () => import(/* webpackChunkName: "onboarding" */ '@/views/onboarding/Onboarding'),
      meta: {
        requiresAuth: true,
        requiresTrack: true
      }
    },
    {
      name: 'error',
      path: '/error',
      component: () => import(/* webpackChunkName: "jusError" */ '@/components/layouts/JusError'),
      meta: {
        requiresTrack: false
      }
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
  if (to.matched.some(record => record.meta.requiresTrack)) {
    window.analytics.page(to.name)
  }
  if (to.name === 'onboarding' || to.name === 'login' || to.name === 'register' || to.name === 'forgot-password') {
    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width,initial-scale=1.0')
  } else {
    document.querySelector('meta[name="viewport"]').setAttribute('content', '')
  }
})

export default router

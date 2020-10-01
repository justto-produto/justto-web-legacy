import Router from 'vue-router'
import Store from '@/store'
import Vue from 'vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "mainContainer" */ '@/views/main/MainContainer'),
      meta: {
        requiresAuth: true,
        trackPage: false
      },
      children: [
        {
          name: 'dashboard',
          path: '/',
          component: () => import(/* webpackChunkName: "dashboardIndex" */ '@/views/main/dashboard/Dashboard'),
          meta: {
            trackPage: true,
            title: 'Justto - Dashboard'
          }
        },
        {
          name: 'billingClientList',
          path: '/billing',
          component: () => import(/* webpackChunkName: "billingClientList" */ '@/views/main/billing/BillingClientList'),
          meta: {
            trackPage: true,
            title: 'Justto - Financeiro'
          }
        },
        {
          name: 'billingDashboard',
          path: '/billing/:customerId',
          component: () => import(/* webpackChunkName: "billingDashboard" */ '@/views/main/billing/BillingDashboard'),
          meta: {
            trackPage: true,
            title: 'Justto - Financeiro'
          }
        },
        {
          name: 'import',
          path: 'import',
          component: () => import(/* webpackChunkName: "importIndex" */ '@/views/main/import/Import'),
          meta: {
            trackPage: true,
            title: 'Justto - Importação'
          }
        },
        {
          name: 'NewImport',
          path: 'import/new',
          component: () => import(/* webpackChunkName: "importNew" */ '@/views/main/import/NewImport'),
          meta: {
            trackPage: true,
            title: 'Justto - Nova importação'
          }
        },
        {
          name: 'importLoading',
          path: 'import/loading',
          component: () => import(/* webpackChunkName: "importLoading" */ '@/views/main/import/Loading'),
          meta: {
            trackPage: true,
            title: 'Justto - Carregando...'
          }
        },
        {
          name: 'management',
          path: '/management',
          component: () => import(/* webpackChunkName: "managementIndex" */ '@/views/main/management/Management'),
          meta: {
            trackPage: true,
            title: 'Justto - Gerenciamento'
          }
        },
        {
          name: 'allDisputes',
          path: '/management/all',
          component: () => import(/* webpackChunkName: "managementIndex" */ '@/views/main/management/Management'),
          meta: {
            trackPage: true,
            title: 'Justto - Todas as disputas'
          }
        },
        {
          path: 'management/dispute/',
          redirect: {
            name: 'management',
            title: 'Justto - Disputa'
          }
        },
        {
          name: 'dispute',
          path: 'management/dispute/:id',
          component: () => import(/* webpackChunkName: "managementIndex" */ '@/views/main/management/Dispute'),
          meta: {
            trackPage: true,
            title: 'Justto - Disputa'
          }
        },
        {
          name: 'configuration',
          path: 'configuration',
          component: () => import(/* webpackChunkName: "managementIndex" */ '@/views/main/configuration/Configuration'),
          meta: {
            trackPage: true,
            title: 'Justto - Configurações'
          }
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import(/* webpackChunkName: "externalIndex" */ '@/views/external/Login'),
      meta: {
        trackPage: true,
        title: 'Justto - Login'
      }
    },
    {
      name: 'register',
      path: '/register',
      component: () => import(/* webpackChunkName: "register" */ '@/views/external/Register'),
      meta: {
        trackPage: true,
        title: 'Justto - Cadastre-se'
      }
    },
    {
      name: 'forgot-password',
      path: '/forgot-password',
      component: () => import(/* webpackChunkName: "forgotPassword" */ '@/views/external/ForgotPassword'),
      meta: {
        trackPage: true,
        title: 'Justto - Recuperar senha'
      }
    },
    {
      name: 'new-password',
      path: '/new-password/:token',
      component: () => import(/* webpackChunkName: "newPassword" */ '@/views/external/NewPassword'),
      meta: {
        trackPage: true,
        title: 'Justto - Nova senha'
      }
    },
    {
      name: 'onboarding',
      path: '/onboarding',
      component: () => import(/* webpackChunkName: "onboarding" */ '@/views/onboarding/Onboarding'),
      meta: {
        requiresAuth: true,
        trackPage: true,
        title: 'Justto - Onboarding'
      }
    },
    {
      name: 'admin-panel',
      path: '/admin-panel',
      component: () => import(/* webpackChunkName: "adminPanel" */ '@/views/adminPanel/AdminPanel'),
      meta: {
        trackPage: true,
        title: 'Justto - Configurações do sistema'
      }
    },
    {
      name: 'error',
      path: '/error',
      component: () => import(/* webpackChunkName: "jusError" */ '@/components/layouts/JusError'),
      meta: {
        trackPage: false,
        title: 'Justto - Ops!'
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
        if (to.name === 'onboarding' && !Store.getters.redirectNewWorkspace) {
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
  if (to.matched.some(record => record.meta.trackPage)) {
    const proprieties = {
      userId: Store.getters.accountEmail,
      workspace: Store.getters.workspaceName,
      team: Store.getters.workspaceTeamName,
      source: 'front'
    }
    window.analytics.page(to.name, proprieties, () => {
      if (process.env.NODE_ENV === 'development') {
        console.table({ page: to.name, proprieties })
      }
    })
  }
  if (to.name === 'onboarding' || to.name === 'login' || to.name === 'register' || to.name === 'forgot-password') {
    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width,initial-scale=1.0')
  } else {
    document.querySelector('meta[name="viewport"]').setAttribute('content', '')
  }
})

export default router

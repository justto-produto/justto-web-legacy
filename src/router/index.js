import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store'
import EDITOR_TABS from '@/constants/editor'

import { eventBus, validateLocalWorkspace } from '@/utils'
import events from '@/constants/negotiationEvents'

const vue = () => document.getElementById('app')?.__vue__
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "mainContainer" */ '@/views/main/MainContainer'),
      meta: {
        requiresAuth: true,
        trackPage: false,
        title: 'ProJuris'
      },
      children: [
        {
          name: 'dashboard',
          path: '/',
          component: () => import(/* webpackChunkName: "dashboardIndex" */ '@/views/main/dashboard/Dashboard'),
          meta: {
            requiresAuth: true,
            trackPage: true,
            title: 'Dashboard'
          }
        },
        {
          name: 'billingClientList',
          path: '/billing',
          component: () => import(/* webpackChunkName: "billingClientList" */ '@/views/main/billing/BillingClientList'),
          meta: {
            requiresAuth: true,
            trackPage: true,
            title: 'Financeiro'
          }
        },
        {
          name: 'billingDashboard',
          path: '/billing/:customerId',
          component: () => import(/* webpackChunkName: "billingDashboard" */ '@/views/main/billing/BillingDashboard'),
          meta: {
            requiresAuth: true,
            trackPage: true,
            title: 'Financeiro'
          }
        },
        {
          name: 'import',
          path: 'import',
          component: () => import(/* webpackChunkName: "importIndex" */ '@/views/main/import/Import'),
          meta: {
            requiresAuth: true,
            trackPage: true,
            title: 'Importação'
          }
        },
        {
          name: 'NewImport',
          path: 'import/new',
          component: () => import(/* webpackChunkName: "importNew" */ '@/views/main/import/NewImport'),
          meta: {
            requiresAuth: true,
            trackPage: true,
            title: 'Nova importação'
          }
        },
        {
          name: 'importLoading',
          path: 'import/loading',
          component: () => import(/* webpackChunkName: "importLoading" */ '@/views/main/import/Loading'),
          meta: {
            requiresAuth: true,
            trackPage: true,
            title: 'Carregando...'
          }
        },
        {
          name: 'management',
          path: '/management',
          component: () => import(/* webpackChunkName: "managementIndex" */ '@/views/main/management/Management'),
          meta: {
            requiresAuth: true,
            trackPage: true,
            title: 'Gerenciamento'
          }
        },
        {
          name: 'Whatsapp',
          path: '/whatsapp',
          component: () => import(/* webpackChunkName: "whatsappViews" */ '@/views/main/watsapp/Views'),
          meta: {
            requiresAuth: true,
            trackPage: true,
            title: 'Templates do WhatsApp'
          }
        },
        {
          name: 'allDisputes',
          path: '/management/all',
          component: () => import(/* webpackChunkName: "managementAll" */ '@/views/main/management/Management'),
          meta: {
            requiresAuth: true,
            trackPage: true,
            title: 'Todas as disputas'
          }
        },
        {
          path: 'management/dispute/',
          redirect: {
            name: 'management',
            title: 'Disputa'
          }
        },
        {
          name: 'dispute',
          path: 'management/dispute/:id',
          redirect: ({ params: { id } }) => (`negotiation/${id}`),
          // component: () => import(/* webpackChunkName: "managementDisputeIndex" */ '@/views/main/dispute/Dispute'),
          meta: {
            requiresAuth: true,
            trackPage: true,
            title: 'Disputa'
          }
        },
        {
          name: 'negotiation',
          path: 'negotiation/',
          component: () => import(/* webpackChunkName: "negotiationIndex" */ '@/views/main/negotiation/Negotiation'),
          meta: {
            hideFullHeader: true,
            requiresAuth: true,
            trackPage: true,
            title: 'Negociação'
          },
          children: [
            {
              name: 'ticket',
              path: ':id',
              component: () => import(/* webpackChunkName: "TicketIndex" */ '@/views/main/negotiation/partials/ticket/Ticket'),
              meta: {
                hideFullHeader: true,
                requiresAuth: true,
                trackPage: true,
                title: 'Negociação'
              }
            }
          ]
        },
        {
          name: 'print',
          path: 'print',
          component: () => import(/* webpackChunkName: "print" */ '@/views/main/print/index'),
          children: [
            {
              name: 'printTicket',
              path: 'negotiation/:id',
              component: () => import(/* webpackChunkName: "printTicket" */ '@/views/main/print/Ticket'),
              meta: {
                requiresAuth: true,
                trackPage: true,
                title: 'Imprimir Negociação'
              }
            }
          ]
        },
        {
          name: 'configuration',
          path: 'configuration',
          redirect: 'configurations',
          component: () => import(/* webpackChunkName: "configurationIndex" */ '@/views/main/configuration/Configuration'),
          meta: {
            requiresAuth: true,
            trackPage: true,
            title: 'Configurações'
          }
        },
        {
          name: 'configurations',
          path: 'configurations',
          component: () => import(/* webpackChunkName: "configurationsIndex" */ '@/views/main/configurations/Configurations'),
          meta: {
            hideFullHeader: true,
            requiresAuth: true,
            trackPage: true,
            title: 'Configurações'
          }
        },
        {
          name: 'workspaces',
          path: 'workspaces',
          component: () => import(/* webpackChunkName: "workspaces" */ '@/views/main/configurations/partials/WorkspaceList'),
          meta: {
            requiresAuth: true,
            trackPage: true,
            title: 'Workspaces'
          }
        },
        {
          name: 'relatorios',
          path: 'reports',
          component: () => import(/* webpackChunkName: "ReportsList" */ '@/views/main/reports/ReportsList'),
          meta: {
            requiresAuth: true,
            trackPage: true,
            title: 'Relatórios'
          },
          children: [
            {
              name: 'managementReport',
              path: 'management',
              component: () => import(/* webpackChunkName: "ManagementReport" */ '@/views/main/reports/partials/Management'),
              meta: {
                requiresAuth: true,
                trackPage: true,
                title: 'Relatório Gerêncial'
              }
            },
            {
              name: 'managerialReport',
              path: 'managerial',
              component: () => import(/* webpackChunkName: "managerialReport" */ '@/views/main/reports/partials/Managerial'),
              meta: {
                requiresAuth: true,
                trackPage: true,
                title: 'Relatório Gestão'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import(/* webpackChunkName: "externalIndex" */ '@/views/external/Login'),
      meta: {
        requiresAuth: false,
        trackPage: true,
        title: 'ProJuris - Login'
      }
    },
    {
      name: 'redirect',
      path: '/redirect',
      component: () => import(/* webpackChunkName: "redirect" */ '@/views/main/Redirect'),
      meta: {
        title: 'Redirecionando'
      }
    },
    {
      name: 'register',
      path: '/register',
      component: () => import(/* webpackChunkName: "register" */ '@/views/external/Register'),
      meta: {
        requiresAuth: false,
        trackPage: true,
        title: 'ProJuris - Cadastre-se'
      }
    },
    {
      name: 'forgot-password',
      path: '/forgot-password',
      component: () => import(/* webpackChunkName: "forgotPassword" */ '@/views/external/ForgotPassword'),
      meta: {
        requiresAuth: false,
        trackPage: true,
        title: 'ProJuris - Recuperar senha'
      }
    },
    {
      name: 'new-password',
      path: '/new-password/:token',
      component: () => import(/* webpackChunkName: "newPassword" */ '@/views/external/NewPassword'),
      meta: {
        requiresAuth: false,
        trackPage: true,
        title: 'ProJuris - Nova senha'
      }
    },
    {
      name: 'onboarding',
      path: '/onboarding',
      component: () => import(/* webpackChunkName: "onboarding" */ '@/views/onboarding/Onboarding'),
      meta: {
        requiresAuth: true,
        trackPage: true,
        title: 'Onboarding'
      }
    },
    {
      name: 'admin-panel',
      path: '/admin-panel',
      component: () => import(/* webpackChunkName: "adminPanelUpdated" */ '@/views/adminPanel/AdminPanel'),
      meta: {
        requiresAuth: false,
        trackPage: true,
        title: 'Painel administrativo'
      }
    },
    {
      name: 'admin-panel@2',
      path: '/admin-panel-2',
      component: () => import(/* webpackChunkName: "adminPanelUpdatedV2" */ '@/views/adminPanel/AdminPanelV2'),
      meta: {
        requiresAuth: false,
        trackPage: true,
        title: 'Painel administrativo'
      },
      children: [{
        name: 'Estratégias',
        path: 'strategies',
        component: () => import(/* webpackChunkName: "PanelStrategies" */ '@/views/adminPanel/partials/Strategy'),
        meta: {
          requiresAuth: true,
          trackPage: true,
          title: 'Estratégias'
        },
        children: [{
          name: 'strategy',
          path: ':id',
          component: () => import(/* webpackChunkName: "StrategyBaseIndex" */ '@/views/adminPanel/partials/partials/StrategyBase'),
          meta: {
            hideFullHeader: true,
            requiresAuth: true,
            trackPage: true,
            title: 'Editar Estratégia'
          }
        }]
      }, {
        name: 'Workspaces',
        path: 'workspaces',
        component: () => import(/* webpackChunkName: "PanelWorkspaceList" */ '@/views/adminPanel/partials/WorkspaceList'),
        meta: {
          requiresAuth: true,
          trackPage: true,
          title: 'Workspaces'
        }
      }, {
        name: 'Templates WhatsApp',
        path: 'whatsapp',
        component: () => import(/* webpackChunkName: "PanelWhatsApp" */ '@/views/main/watsapp/Views'),
        meta: {
          requiresAuth: true,
          trackPage: true,
          title: 'Templates WhatsApp'
        }
      }, {
        name: 'Busca Global',
        path: 'search',
        component: () => import(/* webpackChunkName: "PanelGlobalSearch" */ '@/views/adminPanel/partials/PanelGlobalSearch'),
        meta: {
          requiresAuth: true,
          trackPage: true,
          title: 'Busca Global'
        }
      }, {
        name: 'Onboarding',
        path: 'onboarding',
        component: () => import(/* webpackChunkName: "onboarding" */ '@/views/onboarding/Onboarding'),
        meta: {
          hideLeftMenu: true,
          requiresAuth: true,
          trackPage: true,
          title: 'Onboarding'
        }
      }]
    },
    // {
    //   name: 'auth',
    //   path: '/auth',
    //   component: () => import(/* webpackChunkName: "ExternalAuth" */ '@/views/external/ExternalAuth'),
    //   meta: {
    //     requiresAuth: false,
    //     trackPage: true,
    //     title: 'External Auth'
    //   }
    // },
    {
      name: 'recover-account',
      path: '/recover-account',
      component: () => import(/* webpackChunkName: "recoverAccount" */ '@/views/external/RecoverAccount'),
      meta: {
        requiresAuth: false,
        trackPage: true,
        title: 'ProJuris - Recuperar senha'
      }
    },
    {
      name: 'error',
      path: '/error',
      component: () => import(/* webpackChunkName: "jusError" */ '@/components/layouts/JusError'),
      meta: {
        trackPage: false,
        title: 'ProJuris - Ops!'
      }
    },
    {
      name: 'icons',
      path: '/icons',
      component: () => import(/* webpackChunkName: "adminPanel" */ '@/views/icons/Icons'),
      meta: {
        title: 'ProJuris - Icons'
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
    if (!validateLocalWorkspace()) {
      next('login')
    } else if (Store.getters.isLoggedIn) {
      if (Store.getters.hasWorkspace) {
        if (to.name === 'workspaces') {
          if (!Store.getters.isJusttoAdmin) {
            if (localStorage.getItem('jusprofile') === 'ADMINISTRATOR') {
              next('dashboard')
            } else {
              next('negotiation')
            }
          }
        }

        if (Store.getters?.showNegotiationTypeMenu) {
          if (to.name === 'management') {
            next({ name: 'negotiation' })
          }
        }

        if (from.name === 'ticket' && from.params?.id) {
          eventBus.$emit(events.TICKET_WEB_SOCKET_DISCONNECT.callback, 'unsubscribe', from?.params?.id)
          // TODO: Resetar aba de tickets
          Store.commit('setOmnichannelActiveTab', EDITOR_TABS.MESSAGES)
        }

        if (to.name === 'onboarding' && !Store.getters.redirectNewWorkspace) {
          next('/')
        } else next()
      } else {
        if (to.name === 'onboarding') {
          next()
        } else next('login')
      }
    } else if (to?.query['external-login'] === 'cognito') {
      // TODO: Analizar como conseguir o Token para fazer o Login.
      next('login')
    } else {
      next('login')
    }
  } else if (from.query.token) next(false)
  else next()

  if (to.name === 'ticket') {
    eventBus.$emit(events.TICKET_CHANGE.callback, to.params.id, from?.params?.id)

    if (from.name !== 'ticket' && to.params?.id) {
      eventBus.$emit(events.TICKET_CHANGE.callback, to.params.id, from?.params?.id)
    }
  }
})

router.afterEach((to) => {
  if (['justto.app'].includes(window.location?.hostname)) {
    const message =
    `<p>
      Oi, só queríamos te avisar que o endereço da nossa plataforma mudou.
      <br>
      <br>
      Agora você deve utilizar o nosso novo endereço <a href="https://acordos.projuris.com.br">acordos.projuris.com.br</a>.
      <br>
      <br>
      Não esqueça de adicionar esse novo endereço aos seus favoritos para poder acessar facilmente.
    </p>`

    vue().$alert(message, 'Atenção', {
      confirmButtonText: 'OK',
      dangerouslyUseHTMLString: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      closeOnHashChange: false,
      showClose: false,
      callback: () => {
        window.location.replace('https://acordos.projuris.com.br')
      }
    })
  }

  if (to.matched.some(record => record.meta.trackPage)) {
    const properties = {
      userId: Store.getters.accountEmail,
      workspace: Store.getters.workspaceName,
      team: Store.getters.workspaceTeamName,
      source: 'front'
    }
    window.analytics.page(to.name, properties, () => {
      if (process.env.NODE_ENV === 'development') {
        console.table({ page: to.name, properties })
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

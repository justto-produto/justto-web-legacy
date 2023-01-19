<template>
  <el-container>
    <el-aside
      class="container-aside"
      width="auto"
    >
      <div
        class="container-aside__logo"
        :class="{'has-ghost-mode': isJusttoAdmin}"
      >
        <el-tooltip
          v-if="isJusttoAdmin"
          :open-delay="500"
          content="Modo anônimo"
          placement="right"
        >
          <JusIcon
            icon="ghost-mode"
            class="ghost-mode"
            :is-active="ghostMode"
            @click="setGhostMode(!ghostMode)"
          />
        </el-tooltip>
      </div>

      <el-menu
        ref="sideMenu"
        class="container-aside__menu el-menu--main-menu"
        :class="{ 'container-aside__menu--collapsed': isTeamSectionExpanded }"
        :default-active="$route.path"
        collapse
        router
      >
        <div
          v-for="(menuItem, menuItemIndex) in menuItems.filter(({ isVisible }) => isVisible)"
          :key="`${menuItem.index}-${menuItemIndex}`"
          class="container-aside__menu-item"
          @click="menuItem.action"
        >
          <el-menu-item
            v-show="menuItem.isVisible"
            :index="menuItem.index"
          >
            <JusIcon :icon="menuItem.icon" />

            <span slot="title">
              {{ menuItem.title }}
            </span>
          </el-menu-item>

          <CustomHome :value="menuItem" />
        </div>
      </el-menu>

      <JusTeamMenu
        v-if="isAdminProfile"
        :is-team-section-expanded="isTeamSectionExpanded"
        class="container-aside__team"
        @toggle-expand-team-section="toggleExpandTeamSection"
      />
    </el-aside>

    <el-container direction="vertical">
      <JusHeaderMain />

      <el-main>
        <transition name="fade">
          <router-view />
        </transition>
      </el-main>
    </el-container>

    <JusShortchts />

    <jusMessagePreview />

    <ThamirisAlerts :is-visible="areThamirisAlertsVisible" />

    <BuyDialerDialog />
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { eventBus } from '@/utils'
import { TICKET, MANAGEMENT } from '@/constants/ticketListMode'

import MenuItem from '@/models/main/menuItem'

export default {
  name: 'MainContainer',

  components: {
    jusMessagePreview: () => import('@/components/dialogs/JusMessagePreviewDialog'),
    JusHeaderMain: () => import('@/components/layouts/JusHeaderMain'),
    JusTeamMenu: () => import('@/components/layouts/JusTeamMenu'),
    JusShortchts: () => import('@/components/others/JusShortcuts'),
    ThamirisAlerts: () => import('@/components/dialogs/ThamirisAlerts.vue'),
    BuyDialerDialog: () => import('@/components/dialogs/BuyDialerDialog'),
    CustomHome: () => import('@/components/buttons/CustomHome')
  },

  data() {
    return {
      timer: null,
      subscriptions: [],
      drawer: true,
      isTeamSectionExpanded: false
    }
  },

  computed: {
    ...mapGetters({
      accountId: 'accountId',
      ghostMode: 'ghostMode',
      personId: 'loggedPersonId',
      workspaceId: 'workspaceId',
      authorization: 'accountToken',
      isJusttoAdmin: 'isJusttoAdmin',
      notifications: 'notifications',
      workspace: 'workspaceSubdomain',
      isAdminProfile: 'isAdminProfile',
      isRecovery: 'isWorkspaceRecovery',
      userPreferences: 'userPreferences',
      ticketListMode: 'getTicketListMode',
      workspaceMembersSorted: 'workspaceMembersSorted',
      areNotificationsVisible: 'areNotificationsVisible',
      showNegotiationTypeMenu: 'showNegotiationTypeMenu',
      areThamirisAlertsVisible: 'areThamirisAlertsVisible'
    }),

    canAccessNegotiationScreen() {
      return this.isJusttoAdmin || this.userPreferences?.properties?.NEGOTIATION_SCREEN === 'true'
    },

    isInNegotiation() {
      return ['negotiation', 'ticket'].includes(this.$route.name)
    },

    menuItems() {
      const basicDashboardMenuItem = new MenuItem({
        index: '/',
        title: 'Dashboard',
        icon: 'logo-justto'
      })

      const basicNegotiationMenuItem = new MenuItem({
        index: '/negotiation',
        title: 'Negociação',
        icon: 'negotiation-window',
        isVisible: !this.showNegotiationTypeMenu
      })

      const customNegotiationMenuItem = new MenuItem({
        index: '/negotiation',
        title: 'Negociação',
        icon: 'negotiation-window',
        isVisible: this.showNegotiationTypeMenu && this.ticketListMode === (this.isInNegotiation ? MANAGEMENT : TICKET),
        action: () => { if (this.isInNegotiation) this.setAccountProperty({ TICKET_LIST_MODE: TICKET }) }
      })

      const basicManagementMenuItem = new MenuItem({
        index: '/management',
        title: 'Gerenciamento',
        icon: 'list-app',
        isVisible: !this.showNegotiationTypeMenu,
        action: () => this.setTabQuery('management')
      })

      const customManagementMenuItem = new MenuItem({
        index: '/negotiation',
        title: 'Gerenciamento',
        icon: 'negotiation-window',
        customHome: '/management',
        isVisible: this.showNegotiationTypeMenu && this.ticketListMode === (this.isInNegotiation ? TICKET : MANAGEMENT),
        action: () => { if (this.isInNegotiation) this.setAccountProperty({ TICKET_LIST_MODE: MANAGEMENT }) }
      })

      const basicManagementAllMenuItem = new MenuItem({
        index: '/management/all',
        title: 'Todas as disputas',
        icon: 'full-folder',
        action: () => this.setTabQuery('allDisputes')
      })

      const basicImportMenuItem = new MenuItem({
        index: '/import',
        title: 'Importação',
        icon: 'import',
        isVisible: true,
        action: () => {}
      })

      return [
        basicDashboardMenuItem,
        basicNegotiationMenuItem,
        customNegotiationMenuItem,
        basicManagementMenuItem,
        customManagementMenuItem,
        basicManagementAllMenuItem,
        basicImportMenuItem
      ]
    }
  },

  watch: {
    workspace(_workspace) {
      this.subscribe()
    }
  },

  beforeCreate() {
    this.$store.commit('clearDisputeQuery')
  },

  created() {
    this.pollData()
  },

  beforeMount() {
    this.subscribe()
    window.addEventListener('resize', this.handleResize)
    eventBus.$on('SEE-PREVIEW', this.getPreview)
  },

  beforeDestroy() {
    eventBus.$off('SEE-PREVIEW', this.getPreview)
    window.removeEventListener('resize', this.handleResize)
    this.subscriptions.forEach(s => this.$socket.emit('unsubscribe', s))
    this.subscriptions.length = 0
  },

  mounted() {
    this.getAccountProperty('TOUR_STEPS_COMPLETED').then(({ TOUR_STEPS_COMPLETED = '' }) => {
      if (!(TOUR_STEPS_COMPLETED.includes('JUSTTO_DASHBOARD_ICON'))) {
        setTimeout(this.setTour, 1000)
      }
    })
  },

  sockets: {
    reconnect() {
      this.subscribe()
    }
  },

  methods: {
    ...mapActions({
      loadAccountProperty: 'loadAccountProperty',
      getAccountProperty: 'getAccountProperty',
      setAccountProperty: 'setAccountProperty',
      setWindowGeometry: 'setWindowGeometry',
      getPreview: 'getMessageToPreview',
      getThamirisAlerts: 'getThamirisAlerts',
      setGhostMode: 'setGhostMode',
      initTicketListModeProperty: 'initTicketListModeProperty'
    }),

    pollData() {
      if (this.workspaceId?.length !== 0 && !['admin-panel'].includes(this.$route.name)) {
        this.getThamirisAlerts()
      }

      this.timer = setInterval(() => {
        if (this.workspaceId.length !== 0 && !['admin-panel'].includes(this.$route.name)) {
          this.getThamirisAlerts()
        }
      }, 2 * 60 * 1000)
    },

    handleResize({ target }) {
      this.setWindowGeometry(target)
    },

    subscribe() {
      if (this.workspace) {
        const headers = {
          Authorization: this.authorization,
          Workspace: this.workspace
        }
        const baseUrl = `/topic/${this.workspace}`

        this.subscriptions.forEach(subscription => this.$socket.emit('unsubscribe', subscription))
        this.subscriptions.length = 0

        // this.subscriptions.push({ headers, channel: `${baseUrl}/alert` })
        // this.subscriptions.push({ headers, channel: `${baseUrl}/whatsapp` })
        this.subscriptions.push({
          headers,
          channel: `${baseUrl}/person-status`
        })
        this.subscriptions.push({
          headers,
          channel: `${baseUrl}/${this.personId}/dispute`
        })
        this.subscriptions.push({
          headers,
          channel: `${baseUrl}/${this.personId}/dispute/summary`
        })
        this.subscriptions.push({
          headers,
          channel: `/topic/account/${this.accountId}`
        })

        this.subscriptions.forEach(subscription => this.$socket.emit('subscribe', subscription))
        this.loadAccountProperty().then(this.checkAcceptterms).finally(this.initTicketListModeProperty)
      }
    },

    checkAcceptterms(response) {
      const key = 'LAST_ACCEPTED_DATE'
      const lastTermDate = this.$moment('13/10/2022', 'DD/MM/YYYY')
      let lastAcceptedDate = response[key] ? this.$moment(response[key], 'DD/MM/YYYY') : Boolean(response[key])

      if (!lastAcceptedDate || lastTermDate.isAfter(lastAcceptedDate, 'day')) {
        const docs = [
          {
            label: 'Termos Gerais e Condições de Uso',
            href: 'https://justto.com.br/termos-de-uso',
            isVisible: true
          },
          {
            label: 'Termos Gerais de Contratação de Licenciamento de Uso de Tecnologia',
            href: 'https://justto.com.br/termos-de-contratacao/',
            isVisible: this.isAdminProfile
          },
          {
            label: 'Política de privacidade',
            href: 'https://justto.com.br/politica-privacidade',
            isVisible: true
          }
        ]

        const confirmText = `
        <p>Olá, tudo bem?</p><br>
        <p>Atualizamos nossos documentos de uso da plataforma. Os documentos alterados são:</p>
        <ul>${docs.filter(({ isVisible }) => isVisible).map(item => {
          return `<li><a href="${item.href}" target="_blank">${item.label}</a></li>`
        }).join('')}</ul>
        <p>Por favor, leia os documentos nos links acima e clique em <b>Ciente</b> para prosseguir com o uso dos serviços!</p>`

        this.$confirm(confirmText, 'Atualização nos documentos de uso da plataforma', {
          dangerouslyUseHTMLString: true,
          closeOnPressEscape: false,
          closeOnClickModal: false,
          showCancelButton: false,
          showClose: false,
          customClass: 'terms-confirm',
          confirmButtonText: 'Ciente'
        }).then(() => {
          if (!lastAcceptedDate) {
            lastAcceptedDate = this.$moment().format('DD/MM/YYYY')
          }
          this.setAccountProperty({
            LAST_ACCEPTED_DATE: lastAcceptedDate
          })
        })
      }
    },

    setTabQuery(target) {
      this.$store.commit('clearDisputeQuery')
      this.$store.commit('clearDisputeTab')
      if (target === 'allDisputes') {
        this.$store.commit('setDisputesTab', '9')
        this.$store.commit('updateDisputeQuery', {
          key: 'status',
          value: []
        })
        this.$store.commit('updateDisputeQuery', {
          key: 'sort',
          value: ['id,desc']
        })
      }
    },

    toggleExpandTeamSection() {
      this.isTeamSectionExpanded = !this.isTeamSectionExpanded
    },

    setTour() {
      const tour = this.$shepherd({
        useModalOverlay: false
      })

      const { setAccountProperty, userPreferences } = this

      tour.addStep({
        text: 'Ao clicar aqui você acessará o Dashboard operacional.',
        id: 'JUSTTO_DASHBOARD_ICON',
        attachTo: { element: document.querySelector('.container-aside__menu-item'), on: 'right' },
        buttons: [
          {
            action() {
              const TOUR_STEPS_COMPLETED = userPreferences?.properties?.TOUR_STEPS_COMPLETED || ''

              setAccountProperty({
                TOUR_STEPS_COMPLETED: [...(TOUR_STEPS_COMPLETED.split(',')), 'JUSTTO_DASHBOARD_ICON'].join(',')
              })

              return this.complete()
            },
            classes: 'el-button el-button--secondary el-button--mini',
            text: 'Entendi'
          }
        ]
      })

      tour.start()
    }
  }
}

</script>

<style lang="scss">
@import '@/styles/colors.scss';
@import '~shepherd.js/dist/css/shepherd.css';

.terms-confirm {
  width: 50vw;
}

.el-container.is-vertical {
  .el-main {
    display: flex;
  }
}

.el-submenu__icon-arrow.el-icon-arrow-right {
  display: none;
}

.container-aside {
  background-color: $--color-white;
  box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.1);
  z-index: 2;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .container-aside__logo {
    width: 58px;
    height: auto;
    padding: 9px 18px;
    text-align: center;

    &.has-ghost-mode {
      padding-top: 8px;
    }

    .ghost-mode {
      height: 16px;
      margin-left: -4px;
      cursor: pointer;
    }
  }

  .container-aside__team {
    flex: 1;
    overflow: hidden;
  }

  .container-aside__menu {
    .container-aside__menu-item {
      position: relative;

      .menu-item-pin {
        display: flex;
        position: absolute;
        top: 2px;
        right: 2px;
        height: 12px;
        width: 12px;
        box-sizing: content-box;

        .menu-item-pin__button {
          padding: 0;
          cursor: pointer;
          height: 12px;
          width: 12px;
          border: none;
          background-color: #ff9300;
          background-color: transparent;

          img {
            height: 12px;
            width: 12px;
          }
        }
      }

      &:hover {
        .menu-item-pin {
          .menu-item-pin__button {
            display: block;
          }
        }
      }
    }

    .el-menu-item {
      transition: all 0.3s;
    }

    &.container-aside__menu--collapsed {
      .el-menu-item {
        overflow: hidden;
        height: 0;
      }
    }
  }

  .container-aside__menu:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
}

@media (max-width: 900px) {
  .container-aside {
    display: none;
  }
}
</style>

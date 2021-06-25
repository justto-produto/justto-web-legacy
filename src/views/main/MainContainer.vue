<template>
  <el-container>
    <el-aside
      class="container-aside"
      width="auto"
    >
      <div class="container-aside__logo">
        <router-link to="/">
          <img src="@/assets/logo-small.svg">
        </router-link>
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
          v-for="menuItem in menuItems"
          :key="menuItem.index"
        >
          <el-submenu
            v-if="menuItem.isGroup"
            index="menuItem.index"
          >
            <template slot="title">
              <jus-icon
                icon="management"
              />
            </template>
            <el-menu-item
              v-for="subMenu in menuItem.childs"
              v-show="subMenu.isVisible"
              :key="subMenu.index"
              :index="subMenu.index"
              @click="subMenu.action"
            >
              <JusIcon
                :icon="subMenu.icon"
                class=""
              />
              <span slot="title">
                {{ subMenu.title }}
              </span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item
            v-else
            v-show="menuItem.isVisible"
            :index="menuItem.index"
            @click="menuItem.action"
          >
            <JusIcon
              :icon="menuItem.icon"
              class=""
            />
            <span slot="title">
              {{ menuItem.title }}
            </span>
          </el-menu-item>
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
    <!-- <NotificationDrawer :is-visible="areNotificationsVisible" /> -->
  </el-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { eventBus } from '@/utils'

export default {
  name: 'MainContainer',
  components: {
    jusMessagePreview: () => import('@/components/dialogs/JusMessagePreviewDialog'),
    JusHeaderMain: () => import('@/components/layouts/JusHeaderMain'),
    JusTeamMenu: () => import('@/components/layouts/JusTeamMenu'),
    JusShortchts: () => import('@/components/others/JusShortcuts'),
    ThamirisAlerts: () => import('@/components/dialogs/ThamirisAlerts.vue'),
    // NotificationDrawer: () => import('@/components/drawer/NotificationDrawer')
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
      isAdminProfile: 'isAdminProfile',
      isJusttoAdmin: 'isJusttoAdmin',
      workspaceMembersSorted: 'workspaceMembersSorted',
      personId: 'loggedPersonId',
      workspace: 'workspaceSubdomain',
      authorization: 'accountToken',
      userPreferences: 'userPreferences',
      notifications: 'notifications',
      areThamirisAlertsVisible: 'areThamirisAlertsVisible',
      areNotificationsVisible: 'areNotificationsVisible'
    }),

    canAccessNegotiationScreen() {
      return this.isJusttoAdmin || this.userPreferences?.properties?.NEGOTIATION_SCREEN === 'true'
    },

    menuItems() {
      const itemsMenu = []
      itemsMenu.push({
        index: '/negotiation',
        title: 'Negociação',
        icon: 'negotiation-window',
        isVisible: true,
        action: () => {}
      })
      itemsMenu.push({
        index: '/',
        title: 'Dashboard',
        icon: 'dashboard',
        isVisible: true,
        action: () => {
        }
      })
      itemsMenu.push({
        isGroup: true,
        index: 'disputes',
        name: 'Todas as disputas',
        childs: [
          {
            index: '/management',
            title: 'Gerenciamento',
            icon: 'list-app',
            isVisible: true,
            action: () => this.setTabQuery('management')
          },
          {
            index: '/management/all',
            title: 'Todas as disputas',
            icon: 'full-folder',
            isVisible: true,
            action: () => this.setTabQuery('allDisputes')
          }
        ]
      })
      itemsMenu.push({
        index: '/import',
        title: 'Importação',
        icon: 'import',
        isVisible: true,
        action: () => {
        }
      })
      return itemsMenu
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

  sockets: {
    reconnect() {
      this.subscribe()
    }
  },

  methods: {
    ...mapActions({
      loadAccountProperty: 'loadAccountProperty',
      setAccountProperty: 'setAccountProperty',
      setWindowGeometry: 'setWindowGeometry',
      getPreview: 'getMessageToPreview',
      getThamirisAlerts: 'getThamirisAlerts'
    }),

    ...mapMutations({
      setNotifications: 'setNotifications'
    }),

    pollData() {
      this.setNotifications(this.notifications)
      this.timer = setInterval(() => {
        this.setNotifications(this.notifications)
      }, 120000)
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

        this.subscriptions.forEach(subscription => this.$socket.emit('subscribe', subscription))
        this.loadAccountProperty().then(this.checkAcceptterms)
      }
    },

    checkAcceptterms(response) {
      const key = 'LAST_ACCEPTED_DATE'
      const lastTermDate = this.$moment('20/04/2021', 'DD/MM/YYYY')
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
            href: 'https://justto.com.br/poilitica-privacidade',
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
    }
  }
}

</script>

<style lang="scss">
@import '@/styles/colors.scss';

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
    height: 58px;
    padding: 18px;
    text-align: center;
  }

  .container-aside__team {
    flex: 1;
    overflow: hidden;
  }

  .container-aside__menu {
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

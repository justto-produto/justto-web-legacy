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
        <el-menu-item
          v-for="menuItem in menuItems"
          v-show="menuItem.isVisible"
          :key="menuItem.index"
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

    <!-- <el-footer>
      <el-menu
        ref="sideMenu"
        :default-active="$route.path"
        mode="horizontal"
        class="el-menu--main-menu"
        router
      >
        <el-menu-item
          v-for="menuItem in menuItems"
          :key="menuItem.index"
          :index="menuItem.index"
          @click="menuItem.action"
        >
          <JusIcon
            :icon="menuItem.icon"
            class="el-menu__icon"
          />
        </el-menu-item>
      </el-menu>
    </el-footer> -->
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MainContainer',
  components: {
    JusHeaderMain: () => import('@/components/layouts/JusHeaderMain'),
    JusTeamMenu: () => import('@/components/layouts/JusTeamMenu')
  },
  data() {
    return {
      subscriptions: [],
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
      authorization: 'accountToken'
    }),

    menuItems() {
      return [
        {
          index: '/',
          title: 'Dashboard',
          icon: 'dashboard',
          isVisible: true,
          action: () => {}
        },
        {
          index: '/negotiation',
          title: 'Negociação',
          icon: 'negotiation-window',
          isVisible: this.isJusttoAdmin,
          action: () => {}
        },
        {
          index: '/management',
          title: 'Gerenciamento',
          icon: 'management',
          isVisible: true,
          action: () => this.setTabQuery('management')
        },
        {
          index: '/management/all',
          title: 'Todas as disputas',
          icon: 'full-folder',
          isVisible: true,
          action: () => this.setTabQuery('allDisputes')
        },
        {
          index: '/import',
          title: 'Importação',
          icon: 'import',
          isVisible: true,
          action: () => {}
        }
      ]
    }
  },
  watch: {
    workspace(workspace) {
      this.subscribe()
    }
  },
  beforeCreate() {
    this.$store.commit('clearDisputeQuery')
  },
  beforeMount() {
    this.subscribe()
  },
  beforeDestroy() {
    this.subscriptions.forEach(s => this.$socket.emit('unsubscribe', s))
    this.subscriptions.length = 0
  },
  sockets: {
    reconnect() {
      this.subscribe()
    }
  },
  methods: {
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
        this.subscriptions.push({ headers, channel: `${baseUrl}/person-status` })
        this.subscriptions.push({ headers, channel: `${baseUrl}/${this.personId}/dispute` })
        this.subscriptions.push({ headers, channel: `${baseUrl}/${this.personId}/dispute/summary` })

        this.subscriptions.forEach(subscription => this.$socket.emit('subscribe', subscription))
      }
    },

    setTabQuery(target) {
      this.$store.commit('clearDisputeQuery')
      this.$store.commit('clearDisputeTab')
      if (target === 'allDisputes') {
        this.$store.commit('setDisputesTab', '9')
        this.$store.commit('updateDisputeQuery', { key: 'status', value: [] })
        this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['id,desc'] })
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
.el-container.is-vertical {
  .el-main {
    display: flex;
  }
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
    .el-menu-item { transition: all 0.3s; }

    &.container-aside__menu--collapsed {
      .el-menu-item { overflow: hidden; height: 0; }
    }
  }
}

@media (max-width: 900px) {
  .container-aside {
    display: none;
  }
}
</style>

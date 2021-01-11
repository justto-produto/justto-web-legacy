<template>
  <el-container>
    <el-aside
      class="container-aside"
      width="auto"
    >
      <div
        :class="{'aside-logo--colapsed': isCollapse}"
        class="aside-logo"
      >
        <router-link to="/">
          <img
            class="aside-logo__logo"
            src="@/assets/logo-small.svg"
          >
        </router-link>
      </div>
      <el-menu
        ref="sideMenu"
        class="el-menu--main-menu aside__menu"
        :class="{ teamOpen: isTeamSectionOpen }"
        :collapse-transition="false"
        :collapse="isCollapse"
        :default-active="$route.path"
        router
      >
        <el-menu-item index="/">
          <jus-icon
            icon="dashboard"
            class="el-menu__icon"
          />
          <span slot="title">Dashboard</span>
        </el-menu-item>
        <el-menu-item
          index="/management"
          data-testid="menu-management"
          @click="setTabQuery('management')"
        >
          <jus-icon
            icon="management"
            class="el-menu__icon"
          />
          <span slot="title">Gerenciamento</span>
        </el-menu-item>
        <el-menu-item
          index="/management/all"
          data-testid="menu-allDisputes"
          @click="setTabQuery('allDisputes')"
        >
          <jus-icon
            icon="full-folder"
            class="el-menu__icon"
          />
          <span slot="title">Todas as disputas</span>
        </el-menu-item>
        <el-menu-item
          index="/import"
          data-testid="menu-import"
        >
          <jus-icon
            icon="import"
            class="el-menu__icon"
          />
          <span slot="title">Importação</span>
        </el-menu-item>
      </el-menu>
      <div
        v-show="workspaceMembersSorted.length && isAdminProfile"
        class="jus-team-menu__title"
        @click="toggleOpenTeamSection"
      >
        <span class="avatar-menu__title">
          TIME
        </span>
      </div>
      <vue-perfect-scrollbar v-if="isAdminProfile">
        <jus-team-menu />
      </vue-perfect-scrollbar>
    </el-aside>
    <el-container direction="vertical">
      <jus-header-main />
      <el-main>
        <transition name="fade">
          <router-view />
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MainContainer',
  components: {
    JusHeaderMain: () => import('@/components/layouts/JusHeaderMain'),
    JusTeamMenu: () => import('@/components/layouts/JusTeamMenu'),
    VuePerfectScrollbar: () => import('vue-perfect-scrollbar')
  },
  data() {
    return {
      subscriptions: [],
      isCollapse: true,
      isTeamSectionOpen: true
    }
  },
  computed: {
    ...mapGetters([
      'isAdminProfile',
      'workspaceMembersSorted'
    ]),
    workspace() {
      return this.$store.getters.workspaceSubdomain
    },
    personId() {
      return this.$store.getters.loggedPersonId
    },
    headers() {
      return {
        Authorization: this.$store.getters.accountToken,
        Workspace: this.workspace
      }
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
        this.subscriptions.forEach(s => this.$socket.emit('unsubscribe', s))
        this.subscriptions.length = 0
        // this.subscriptions.push({ headers: this.headers, channel: '/topic/' + this.workspace + '/whatsapp' })
        this.subscriptions.push({ headers: this.headers, channel: '/topic/' + this.workspace + '/' + this.personId + '/dispute' })
        this.subscriptions.push({ headers: this.headers, channel: '/topic/' + this.workspace + '/alert' })
        this.subscriptions.push({ headers: this.headers, channel: `/topic/${this.workspace}/person-status` })
        this.subscriptions.push({ headers: this.headers, channel: '/topic/' + this.workspace + '/' + this.personId + '/dispute/summary' })
        this.subscriptions.forEach(s => this.$socket.emit('subscribe', s))
      }
    },
    toggleOpenTeamSection() {
      this.isTeamSectionOpen = !this.isTeamSectionOpen
    },
    setTabQuery(target) {
      this.$store.commit('clearDisputeQuery')
      this.$store.commit('clearDisputeTab')
      if (target === 'allDisputes') {
        this.$store.commit('setDisputesTab', '9')
        this.$store.commit('updateDisputeQuery', { key: 'status', value: [] })
        this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['id,desc'] })
      }
    }
  }
}

</script>

<style lang="scss">
.el-menu-item {
  height: 32px !important;
}

.avatar-menu__title {
  font-size: 12px;
}

.container-aside {
  width: 32px;
  background-color: #fff;
  box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.1);
  z-index: 2;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.aside-logo {
  padding: 40px 20px;
  width: 280px;
  top: 0px;
  left: 0px;
  z-index: 1;
  background-color: #ffffff;
  &:not(.aside-logo--colapsed) {
    .aside-logo__icon{
      float: right;
    }
  }
  &.aside-logo--colapsed {
    padding: 18px 0;
    width: 64px;
    text-align: center;
    .aside-logo__icon {
      margin: 20px 0 0;
      display: block;
    }
  }
}

.aside-logo__logo {
  z-index: 2;
  height: 24px;
  vertical-align: middle;
}

.jus-team-menu__title {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.aside__menu {
  li {
    transition: all 0.3s;
  }

  &.teamOpen {
    li {
      overflow: hidden;
      height: 0;
    }
  }
}
</style>

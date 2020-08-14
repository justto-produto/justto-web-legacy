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
        :collapse-transition="false"
        :collapse="isCollapse"
        :default-active="$route.path"
        router
        class="el-menu--main-menu"
      >
        <el-menu-item index="/">
          <jus-icon
            icon="dashboard"
            class="el-menu__icon"
          />
          <span slot="title">Dashboard</span>
        </el-menu-item>
        <!-- <transition name="fade">
          <li v-if="!isCollapse" class="el-menu__title">
            <span>GERENCIAMENTO</span>
          </li>
        </transition> -->
        <el-menu-item
          index="/management"
          data-testid="menu-management"
        >
          <jus-icon
            icon="management"
            class="el-menu__icon"
          />
          <span slot="title">Gerenciamento</span>
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
        <el-menu-item
          v-if="isJusttoAdmin || isAdminProfile"
          index="/billing"
          data-testid="menu-financial"
        >
          <jus-icon
            icon="coins"
            class="el-menu__icon"
          />
          <span slot="title">Financeiro</span>
        </el-menu-item>
      </el-menu>
      <div
        v-show="workspaceMembers.length && isAdminProfile"
        class="jus-team-menu__title"
      >
        TIME
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
    VuePerfectScrollbar: () => import('vue-perfect-scrollbar'),
  },
  data() {
    return {
      subscriptions: [],
      isCollapse: true,
    }
  },
  computed: {
    ...mapGetters([
      'isJusttoAdmin',
      'isAdminProfile',
      'workspaceMembers',
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
        Workspace: this.workspace,
      }
    },
  },
  watch: {
    workspace(workspace) {
      this.subscribe()
    },
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
    },
  },
  methods: {
    subscribe() {
      if (this.workspace) {
        this.subscriptions.forEach(s => this.$socket.emit('unsubscribe', s))
        this.subscriptions.length = 0
        // this.subscriptions.push({ headers: this.headers, channel: '/topic/' + this.workspace + '/whatsapp' })
        this.subscriptions.push({ headers: this.headers, channel: '/topic/' + this.workspace + '/' + this.personId + '/dispute' })
        this.subscriptions.push({ headers: this.headers, channel: '/topic/' + this.workspace + '/alert' })
        this.subscriptions.push({ headers: this.headers, channel: '/topic/' + this.workspace + '/' + this.personId + '/dispute/summary' })
        this.subscriptions.forEach(s => this.$socket.emit('subscribe', s))
      }
    },
  },
}

</script>

<style lang="scss">
.container-aside {
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

.container-header {
  background-color: #fff;
  box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.1);
  z-index: 1;
  display: flex;
}

.container-search {
  display: flex;
  width: 100%;
  input {
    border: 0;
    outline: 0;
    height: 58px;
    font-size: 16px;
    opacity: .75;
    width: 98%;
  }
}

.container-info {
  .el-dropdown-link {
    display: flex;
    align-items: center;
    margin: 8px 0;
    cursor: pointer;
  }
}

.container-info__name {
  margin: 0 10px;
  div {
    white-space: nowrap;
    font-weight: 600;
  }
  span {
    font-size: 12px;
    color: #666666;
  }
}
</style>

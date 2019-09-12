<template>
  <el-container>
    <el-aside class="container-aside" width="auto">
      <div :class="{'aside-logo--colapsed': isCollapse}" class="aside-logo">
        <router-link to="/">
          <img class="aside-logo__logo" src="@/assets/logo-small.svg" title="aaaaa">
        </router-link>
      </div>
      <el-menu
        ref="sideMenu"
        :collapse-transition="false"
        :collapse="isCollapse"
        :default-active="$route.path"
        router
        class="el-menu--main-menu">
        <!-- <el-menu-item index="/">
          <jus-tip />
          <jus-icon icon="dashboard" class="el-menu__icon"/>
          <span slot="title">Dashboard</span>
        </el-menu-item> -->
        <!-- <transition name="fade">
          <li v-if="!isCollapse" class="el-menu__title">
            <span>GERENCIAMENTO</span>
          </li>
        </transition> -->
        <el-menu-item index="/management" data-testid="menu-management">
          <jus-icon icon="management" class="el-menu__icon"/>
          <span slot="title">Gerenciamento</span>
        </el-menu-item>
        <el-menu-item index="/import" data-testid="menu-import">
          <jus-icon icon="import" class="el-menu__icon"/>
          <span slot="title">Importação</span>
        </el-menu-item>
      </el-menu>
      <div v-show="$store.getters.workspaceMembers.length" class="jus-team-menu__title">
        TIME
      </div>
      <vue-perfect-scrollbar>
        <jus-team-menu />
      </vue-perfect-scrollbar>
    </el-aside>
    <el-container direction="vertical">
      <jus-header-main />
      <el-main>
        <transition name="fade">
          <router-view/>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'MainContainer',
  components: {
    JusHeaderMain: () => import('@/components/layouts/JusHeaderMain'),
    JusTeamMenu: () => import('@/components/layouts/JusTeamMenu'),
    VuePerfectScrollbar: () => import('vue-perfect-scrollbar')
  },
  data () {
    return {
      isCollapse: true,
      workspace: '',
      headers: ''
    }
  },
  beforeCreate () {
    this.$store.dispatch('getWhatsappStatus').then((whatsapp) => {
      if (whatsapp.status === 'OFFLINE') {
        this.$store.dispatch('whatsappStart')
      } else {
        this.$store.commit('SOCKET_refresh', whatsapp)
      }
    })
  },
  beforeMount () {
    this.workspace = this.$store.getters.workspaceSubdomain
    this.headers = {
      Authorization: this.$store.getters.accountToken,
      Workspace: this.workspace
    }
    this.subscribe()
  },
  beforeDestroy () {
    this.$socket.emit('unsubscribe', { headers: this.headers, channel: '/topic/' + this.workspace + '/whatsapp' })
    this.$socket.emit('unsubscribe', { headers: this.headers, channel: '/topic/' + this.$store.getters.workspaceSubdomain + '/' + this.$store.getters.workspacePerson.id + '/dispute' })
    this.$socket.emit('unsubscribe', { headers: this.headers, channel: '/topic/' + this.$store.getters.workspaceSubdomain + '/' + this.$store.getters.workspacePerson.id + '/alert' })
    this.$socket.emit('unsubscribe', { headers: this.headers, channel: '/topic/' + this.$store.getters.workspaceSubdomain + '/' + this.$store.getters.workspacePerson.id + '/summary' })
  },
  sockets: {
    reconnect () {
      this.subscribe()
    }
  },
  methods: {
    subscribe () {
      if (this.workspace) {
        this.$socket.emit('subscribe', { headers: this.headers, channel: '/topic/' + this.workspace + '/whatsapp' })
        this.$socket.emit('subscribe', { headers: this.headers, channel: '/topic/' + this.workspace + '/' + this.$store.getters.workspacePerson.id + '/dispute' })
        this.$socket.emit('subscribe', { headers: this.headers, channel: '/topic/' + this.workspace + '/alert' })
        this.$socket.emit('subscribe', { headers: this.headers, channel: '/topic/' + this.workspace + '/' + this.$store.getters.workspacePerson.id + '/summary' })
      }
    }
  }
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
  box-shadow: 0px -12px 24px 0 rgba(37, 38, 94, 0.1);
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

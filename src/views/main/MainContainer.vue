<template>
  <el-container>
    <el-aside class="container-aside" width="auto">
      <div :class="{'aside-logo--colapsed': isCollapse}" class="aside-logo">
        <router-link to="/">
          <img class="aside-logo__logo" src="@/assets/logo-small.svg">
        </router-link>
      </div>
      <el-menu
        ref="sideMenu"
        :collapse-transition="false"
        :collapse="isCollapse"
        :default-active="$route.path"
        router
        class="el-menu--main-menu">
        <el-menu-item index="/">
          <!-- <jus-tip /> -->
          <jus-icon icon="dashboard" class="el-menu__icon"/>
          <span slot="title">Dashboard</span>
        </el-menu-item>
        <transition name="fade">
          <li v-if="!isCollapse" class="el-menu__title">
            <span>GERENCIAMENTO</span>
          </li>
        </transition>
        <el-menu-item index="/import">
          <jus-icon icon="import" class="el-menu__icon"/>
          <span slot="title">Importação de casos</span>
        </el-menu-item>
        <el-menu-item index="/management">
          <jus-icon icon="management" class="el-menu__icon"/>
          <span slot="title">Gerenciamento</span>
        </el-menu-item>
        <el-menu-item index="/profile" style="display: none">
          <span slot="title">Perfil</span>
        </el-menu-item>
      </el-menu>
      <div class="jus-team-menu__title">TIME</div>
      <vue-perfect-scrollbar>
        <jus-team-menu />
      </vue-perfect-scrollbar>
    </el-aside>
    <el-container direction="vertical">
      <JusHeaderMain/>
      <el-main>
        <transition name="fade">
          <router-view/>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import JusHeaderMain from '@/components/layouts/JusHeaderMain'
import JusTeamMenu from '@/components/layouts/JusTeamMenu'
import JusTip from '@/components/others/JusTip'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  name: 'MainContainer',
  components: {
    JusHeaderMain,
    JusTeamMenu,
    JusTip,
    VuePerfectScrollbar
  },
  data () {
    return {
      isCollapse: true
    }
  },
  beforeMount () {
    this.$store.dispatch('myPerson')
    this.$store.dispatch('getWorkspaceMembers')
  }
}
</script>

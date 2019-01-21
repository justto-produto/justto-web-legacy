<template>
  <el-container>
    <el-aside class="container-aside" width="auto">
      <div :class="{'aside-logo--colapsed': isCollapse}" class="aside-logo">
        <img class="aside-logo__logo" src="@/assets/logo-small.svg">
      </div>
      <el-menu
        :collapse-transition="false"
        :default-active="$route.path"
        :collapse="isCollapse"
        router
        class="el-menu--main-menu">
        <el-menu-item ref="dashboard" index="/">
          <jus-icon :is-active="$route.path === '/'" icon="dashboard" class="el-menu__icon"/>
          <jus-tip/>
          <span slot="title">Dashboard</span>
        </el-menu-item>
        <transition name="fade">
          <li v-if="!isCollapse" class="el-menu__title">
            <span>GERENCIAMENTO</span>
          </li>
        </transition>
        <el-menu-item index="/import">
          <jus-icon :is-active="$route.path.startsWith('/import')" icon="import" class="el-menu__icon"/>
          <span slot="title">Importação de casos</span>
        </el-menu-item>
        <el-menu-item index="/management">
          <jus-icon :is-active="$route.path.startsWith('/management')" icon="negotiation" class="el-menu__icon"/>
          <span slot="title">Gerenciamento</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <jus-icon :is-active="$route.path.startsWith('/settings')" icon="settings" class="el-menu__icon"/>
          <span slot="title">Configurações</span>
        </el-menu-item>
      </el-menu>
      <span class="el-menu__title">TIME</span>
      <vue-perfect-scrollbar>
        <el-menu :collapse-transition="false" :collapse="isCollapse" class="el-menu--team-menu">
          <el-menu-item index="1">
            <jus-avatar-user
              size="sm"
              shape="circle"
              class="el-menu__avatar"
              src="https://i.ytimg.com/vi/7s6YIIZjfrQ/maxresdefault.jpg"/>
            <span slot="title">Mariana Rondino</span>
            <span class="el-menu__counter">0</span>
          </el-menu-item>
          <el-menu-item index="2">
            <jus-avatar-user
              size="sm"
              shape="circle"
              class="el-menu__avatar"
              src="http://www.abc.net.au/reslib/201011/r679209_5007178.jpg"/>
            <span slot="title">Henrique Liberato</span>
            <span class="el-menu__counter">0</span>
          </el-menu-item>
          <el-menu-item index="3">
            <jus-avatar-user
              size="sm"
              shape="circle"
              class="el-menu__avatar"
              name-initials="MS"/>
            <span slot="title">Mateus Santos </span>
            <span class="el-menu__counter">0</span>
          </el-menu-item>
          <el-menu-item index="4">
            <jus-avatar-user
              size="sm"
              shape="circle"
              class="el-menu__avatar"
              src="http://3.bp.blogspot.com/-XHJdhVNa_Ok/Ww6-vSfNzuI/AAAAAAAASiU/WjSucjgrNp8tLP0nQPvSHK6SfQrn86MzACK4BGAYYCw/s1600/Muppet%2BThought%2Bof%2Bthe%2BWeek-Animal.jpg"/>
            <span slot="title">Michelle Morcos</span>
            <span class="el-menu__counter">0</span>
          </el-menu-item>
          <el-menu-item index="5">
            <jus-avatar-user
              size="sm"
              shape="circle"
              class="el-menu__avatar"
              name-initials="GG"/>
            <span slot="title">Graziele Galvão</span>
            <span class="el-menu__counter">0</span>
          </el-menu-item>
          <el-menu-item index="6">
            <jus-avatar-user
              size="sm" shape="circle"
              class="el-menu__avatar"
              src="https://vignette.wikia.nocookie.net/parody/images/8/8c/Kermit-2011.png/revision/latest?cb=20150530035135"/>
            <span slot="title">Bruno Moreno</span>
            <span class="el-menu__counter">0</span>
          </el-menu-item>
          <!-- <el-menu-item v-for="index in [7,8,9,10,11,12]" :index="index">
            <jus-avatar-user
              size="sm" shape="circle"
              class="el-menu__avatar"
              src="https://vignette.wikia.nocookie.net/parody/images/8/8c/Kermit-2011.png/revision/latest?cb=20150530035135"/>
            <span slot="title">Bruno Moreno</span>
            <span class="el-menu__counter">0</span>
          </el-menu-item> -->
        </el-menu>
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
import JusTip from '@/components/others/JusTip'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  name: 'MainContainer',
  components: {
    JusHeaderMain,
    JusTip,
    VuePerfectScrollbar
  },
  data () {
    return {
      isCollapse: true
    }
  }
}
</script>

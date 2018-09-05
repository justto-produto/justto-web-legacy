<template>
  <el-container>
    <el-aside class="container-aside">
      <img class="container-aside__logo" src="@/assets/logo.svg"/>
      <el-menu :router="true" :default-active="$route.path" class="el-menu--main-menu" :collapse="isCollapse">
        <el-menu-item ref="dashboard" index="/" class="border-top-bottom">
          <jus-icon icon="dashboard" :is-active="true" class="el-menu__icon"/>
          <span slot="title">Dashboard</span>
        </el-menu-item>
        <li class="el-menu__title">
          GERENCIAMENTO
        </li>
        <el-menu-item index="/import">
          <jus-icon icon="import" is-active class="el-menu__icon"></jus-icon>
          <span slot="title">Importação</span>
        </el-menu-item>
        <el-menu-item index="/negotiation">
          <jus-icon icon="negotiation" is-active class="el-menu__icon"></jus-icon>
          <span slot="title">Negociação</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <jus-icon icon="settings" is-active class="el-menu__icon"></jus-icon>
          <span slot="title">Configurações</span>
        </el-menu-item>
      </el-menu>
      <el-menu class="el-menu--team-menu" :collapse="isCollapse">
        <li class="el-menu__title">
          TIME BONK E RIZZO
          <i class="el-icon-plus"></i>
        </li>
        <el-menu-item index="1">
          <img src="https://i.ytimg.com/vi/7s6YIIZjfrQ/maxresdefault.jpg" class="el-menu__avatar">
          <span slot="title">Mariana Rondino</span>
          <span class="el-menu__counter">0</span>
        </el-menu-item>
        <el-menu-item index="2">
          <img src="http://www.abc.net.au/reslib/201011/r679209_5007178.jpg" class="el-menu__avatar">
          <span slot="title">Henrique Liberato</span>
          <span class="el-menu__counter">0</span>
        </el-menu-item>
        <el-menu-item index="3">
          <img src="http://3.bp.blogspot.com/-XHJdhVNa_Ok/Ww6-vSfNzuI/AAAAAAAASiU/WjSucjgrNp8tLP0nQPvSHK6SfQrn86MzACK4BGAYYCw/s1600/Muppet%2BThought%2Bof%2Bthe%2BWeek-Animal.jpg" class="el-menu__avatar">
          <span slot="title">Michelle Morcos</span>
          <span class="el-menu__counter">0</span>
        </el-menu-item>
        <el-menu-item index="4">
          <img src="https://vignette.wikia.nocookie.net/parody/images/8/8c/Kermit-2011.png/revision/latest?cb=20150530035135" class="el-menu__avatar">
          <span slot="title">Bruno Moreno</span>
          <span class="el-menu__counter">0</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="container-header">
        <div class="container-search">
          <jus-icon icon="search" is-active class="el-menu__icon"/>
          <input type="text" name="" value="" placeholder="Buscar">
        </div>
        <div class="container-info">
          <div class="container-info__avatar">
            <user-avatar></user-avatar>
          </div>
          <div class="container-info__name">
            <div>
              Mariana rondino
            </div>
            <span>UX Designer</span>
          </div>
          <el-dropdown trigger="click" placement="bottom">
            <span class="el-dropdown-link">
              <jus-icon icon="expand-dropdown"/>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>Times</el-dropdown-item>
              <el-dropdown-item>Informações</el-dropdown-item>
              <el-dropdown-item>Ajuda</el-dropdown-item>
              <el-dropdown-item divided>Sair</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <transition name="fade">
          <router-view/>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import UserAvatar from '@/components/images/UserAvatar'

export default {
  name: 'Main',
  components: {
    UserAvatar
  },
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
  },
  mounted: function () {
    this.$nextTick(function () {
      // console.log(this.$refs['dashboard'].active = true)
    })
  }
}
</script>

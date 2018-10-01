<template>
  <el-container>
    <el-aside class="container-aside" width="auto">
      <div class="aside-logo" :class="{'aside-logo--colapsed': isCollapse}">
        <transition name="fade-absolute">
          <img class="aside-logo__logo" v-if="!isCollapse" src="@/assets/logo.svg"/>
        </transition>
        <img class="aside-logo__logo" v-if="isCollapse" src="@/assets/logo-small.svg"/>
        <a href="" class="aside-logo__icon" v-if="isCollapse" @click.prevent="isCollapse = !isCollapse">
          <JusIcon v-if="isCollapse" icon="expand-menu"/>
        </a>
        <a href="" class="aside-logo__icon" v-if="!isCollapse" @click.prevent="isCollapse = !isCollapse">
          <JusIcon icon="colapse-menu"/>
        </a>
      </div>
      <el-menu :collapse-transition="false" :router="true" :default-active="$route.path" class="el-menu--main-menu" :collapse="isCollapse">
        <el-menu-item ref="dashboard" index="/" class="border-top-bottom">
          <JusIcon icon="dashboard" :is-active="$route.path === '/'" class="el-menu__icon"/>
          <span slot="title">Dashboard</span>
        </el-menu-item>
        <transition name="fade-absolute">
          <li v-if="!isCollapse" class="el-menu__title">
            <span>GERENCIAMENTO</span>
          </li>
        </transition>
        <el-menu-item index="/import">
          <JusIcon icon="import" :is-active="$route.path === '/import'" class="el-menu__icon"/>
          <span slot="title">Importação</span>
        </el-menu-item>
        <el-menu-item index="/negotiation">
          <JusIcon icon="negotiation" :is-active="$route.path === '/negotiation'" class="el-menu__icon"/>
          <span slot="title">Negociação</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <JusIcon icon="settings" :is-active="$route.path === '/settings'" class="el-menu__icon"/>
          <span slot="title">Configurações</span>
        </el-menu-item>
      </el-menu>
      <el-menu :collapse-transition="false" class="el-menu--team-menu" :collapse="isCollapse">
        <li class="el-menu__title">
          <span v-if="!isCollapse">
            TIME BONK E RIZZO
            <i class="el-icon-plus"></i>
          </span>
        </li>
        <el-menu-item index="1">
          <JusAvatarUser size="sm" rounded class="el-menu__avatar" src="https://i.ytimg.com/vi/7s6YIIZjfrQ/maxresdefault.jpg"/>
          <span slot="title">Mariana Rondino</span>
          <span class="el-menu__counter">0</span>
        </el-menu-item>
        <el-menu-item index="2">
          <JusAvatarUser size="sm" rounded class="el-menu__avatar" src="http://www.abc.net.au/reslib/201011/r679209_5007178.jpg"/>
          <span slot="title">Henrique Liberato</span>
          <span class="el-menu__counter">0</span>
        </el-menu-item>
        <el-menu-item index="3">
          <JusAvatarUser size="sm" rounded class="el-menu__avatar" nameInitials="M S"/>
          <span slot="title">Mateus Santos </span>
          <span class="el-menu__counter">0</span>
        </el-menu-item>
        <el-menu-item index="4">
          <JusAvatarUser size="sm" rounded class="el-menu__avatar" src="http://3.bp.blogspot.com/-XHJdhVNa_Ok/Ww6-vSfNzuI/AAAAAAAASiU/WjSucjgrNp8tLP0nQPvSHK6SfQrn86MzACK4BGAYYCw/s1600/Muppet%2BThought%2Bof%2Bthe%2BWeek-Animal.jpg"/>
          <span slot="title">Michelle Morcos</span>
          <span class="el-menu__counter">0</span>
        </el-menu-item>
        <el-menu-item index="5">
          <JusAvatarUser size="sm" rounded class="el-menu__avatar" nameInitials="A B"/>
          <span slot="title">Ana Beatriz</span>
          <span class="el-menu__counter">0</span>
        </el-menu-item>
        <el-menu-item index="6">
          <JusAvatarUser size="sm" rounded class="el-menu__avatar" src="https://vignette.wikia.nocookie.net/parody/images/8/8c/Kermit-2011.png/revision/latest?cb=20150530035135"/>
          <span slot="title">Bruno Moreno</span>
          <span class="el-menu__counter">0</span>
        </el-menu-item>
      </el-menu>
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

export default {
  name: 'MainContainer',
  components: {
    JusHeaderMain
  },
  data () {
    return {
      isCollapse: false
    }
  }
}
</script>

<style lang="scss">
  .settings-container{
    margin: 10px 20px 20px;
  }
</style>

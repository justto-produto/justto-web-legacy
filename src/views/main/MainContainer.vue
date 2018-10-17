<template>
  <el-container>
    <el-aside class="container-aside" width="auto">
      <div :class="{'aside-logo--colapsed': isCollapse}" class="aside-logo">
        <transition name="fade-absolute">
          <img v-if="!isCollapse" src="@/assets/logo.svg" class="aside-logo__logo">
        </transition>
        <img v-if="isCollapse" class="aside-logo__logo" src="@/assets/logo-small.svg">
        <a v-if="isCollapse" href="" class="aside-logo__icon" @click.prevent="isCollapse = !isCollapse">
          <jus-icon v-if="isCollapse" icon="expand-menu"/>
        </a>
        <a v-if="!isCollapse" href="" class="aside-logo__icon" @click.prevent="isCollapse = !isCollapse">
          <jus-icon icon="colapse-menu"/>
        </a>
      </div>
      <el-menu :collapse-transition="false" :router="true" :default-active="$route.path" :collapse="isCollapse" class="el-menu--main-menu">
        <el-menu-item ref="dashboard" index="/" class="border-top-bottom">
          <jus-icon :is-active="$route.path === '/'" icon="dashboard" class="el-menu__icon"/>
          <span slot="title">Dashboard</span>
        </el-menu-item>
        <transition name="fade-absolute">
          <li v-if="!isCollapse" class="el-menu__title">
            <span>GERENCIAMENTO</span>
          </li>
        </transition>
        <el-menu-item index="/import">
          <jus-icon :is-active="$route.path === '/import'" icon="import" class="el-menu__icon"/>
          <span slot="title">Novos casos</span>
        </el-menu-item>
        <el-menu-item index="/management">
          <jus-icon :is-active="$route.path === '/management'" icon="negotiation" class="el-menu__icon"/>
          <span slot="title">Gerenciamento</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <jus-icon :is-active="$route.path === '/settings'" icon="settings" class="el-menu__icon"/>
          <span slot="title">Configurações</span>
        </el-menu-item>
      </el-menu>
      <el-menu :collapse-transition="false" :collapse="isCollapse" class="el-menu--team-menu">
        <li class="el-menu__title">
          <span v-if="!isCollapse">
            TIME BONK E RIZZO
            <i class="el-icon-plus"/>
          </span>
        </li>
        <el-menu-item index="1">
          <jus-avatar-user size="sm" shape="circle" class="el-menu__avatar" src="https://i.ytimg.com/vi/7s6YIIZjfrQ/maxresdefault.jpg"/>
          <span slot="title">Mariana Rondino</span>
          <span class="el-menu__counter">0</span>
        </el-menu-item>
        <el-menu-item index="2">
          <jus-avatar-user size="sm" shape="circle" class="el-menu__avatar" src="http://www.abc.net.au/reslib/201011/r679209_5007178.jpg"/>
          <span slot="title">Henrique Liberato</span>
          <span class="el-menu__counter">0</span>
        </el-menu-item>
        <el-menu-item index="3">
          <jus-avatar-user size="sm" shape="circle" class="el-menu__avatar" name-initials="M S"/>
          <span slot="title">Mateus Santos </span>
          <span class="el-menu__counter">0</span>
        </el-menu-item>
        <el-menu-item index="4">
          <jus-avatar-user size="sm" shape="circle" class="el-menu__avatar" src="http://3.bp.blogspot.com/-XHJdhVNa_Ok/Ww6-vSfNzuI/AAAAAAAASiU/WjSucjgrNp8tLP0nQPvSHK6SfQrn86MzACK4BGAYYCw/s1600/Muppet%2BThought%2Bof%2Bthe%2BWeek-Animal.jpg"/>
          <span slot="title">Michelle Morcos</span>
          <span class="el-menu__counter">0</span>
        </el-menu-item>
        <el-menu-item index="5">
          <jus-avatar-user size="sm" shape="circle" class="el-menu__avatar" name-initials="A B"/>
          <span slot="title">Ana Beatriz</span>
          <span class="el-menu__counter">0</span>
        </el-menu-item>
        <el-menu-item index="6">
          <jus-avatar-user size="sm" shape="circle" class="el-menu__avatar" src="https://vignette.wikia.nocookie.net/parody/images/8/8c/Kermit-2011.png/revision/latest?cb=20150530035135"/>
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

.container-aside {
  background-color: #fff;
  box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.1);
  z-index: 2;
  margin-top: 98px;
}

.aside-logo {
  padding: 40px 20px;
  width: 280px;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 1;
  background-color: #ffffff;
  border-bottom: 1px solid #eeeeee;
  box-shadow: 0px -12px 24px 0 rgba(37, 38, 94, 0.1);
  &:not(.aside-logo--colapsed) {
    .aside-logo__icon{
      float: right;
    }
  }
  &.aside-logo--colapsed {
    padding: 22px 20px;
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
  height: 16px;
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

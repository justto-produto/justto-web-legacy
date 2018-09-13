<template>
  <el-container>
    <el-aside class="container-aside" width="auto">
      <div class="aside-logo">
        <img class="aside-logo__logo" src="@/assets/logo.svg"/>
      </div>
      <el-menu :router="true" :default-active="$route.path" class="el-menu--main-menu">
        <el-menu-item ref="dashboard" index="/" class="border-top-bottom">
          <jus-icon icon="back"/>
          <span slot="title"> Voltar</span>
        </el-menu-item>
        <li class="el-menu__title">
          <span>PERFIL</span>
        </li>
        <el-menu-item index="/user">
          <jus-icon icon="settings" :is-active="$route.path === '/user'" class="el-menu__icon"></jus-icon>
          <span slot="title">Meus dados</span>
        </el-menu-item>
        <el-menu-item index="/user/change-password">
          <jus-icon icon="import" :is-active="$route.path === '/user/change-password'" class="el-menu__icon"></jus-icon>
          <span slot="title">Alterar senha</span>
        </el-menu-item>
        <el-menu-item index="/user/notifications">
          <jus-icon icon="negotiation" :is-active="$route.path === '/user/notifications'" class="el-menu__icon"></jus-icon>
          <span slot="title">Notificações</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container direction="vertical">
      <content-header/>
      <el-main>
        <transition name="fade-absolute">
          <router-view/>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import ContentHeader from '@/components/layouts/ContentHeader'

export default {
  name: 'UserContainer',
  components: {
    ContentHeader
  }
}
</script>

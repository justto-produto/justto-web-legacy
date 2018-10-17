<template>
  <el-container>
    <el-aside class="container-aside" width="auto">
      <div class="aside-logo">
        <img class="aside-logo__logo" src="@/assets/logo.svg">
      </div>
      <el-menu :router="true" :default-active="$route.path" class="el-menu--main-menu">
        <el-menu-item ref="dashboard" index="/" class="border-top-bottom">
          <jus-icon icon="back"/>
          <span slot="title"> Voltar</span>
        </el-menu-item>
        <li class="el-menu__title">
          <span>PERFIL</span>
        </li>
        <el-menu-item index="/profile">
          <jus-icon :is-active="$route.path === '/profile'" icon="profile" class="el-menu__icon"/>
          <span slot="title">Informações</span>
        </el-menu-item>
        <el-menu-item index="/profile/setup">
          <jus-icon :is-active="$route.path === '/profile/setup'" icon="profile" class="el-menu__icon"/>
          <span slot="title">Configurações</span>
        </el-menu-item>
        <el-menu-item index="/profile/users">
          <jus-icon :is-active="$route.path === '/profile/users'" icon="profile" class="el-menu__icon"/>
          <span slot="title">Configurações</span>
        </el-menu-item>
        <el-menu-item index="/profile/notifications">
          <jus-icon :is-active="$route.path === '/profile/notifications'" icon="notification" class="el-menu__icon"/>
          <span slot="title">Notificações</span>
        </el-menu-item>
        <el-menu-item index="/profile/activities">
          <jus-icon :is-active="$route.path === '/profile/activities'" icon="my-activities" class="el-menu__icon"/>
          <span slot="title">Minhas atividades</span>
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
  name: 'ProfileContainer',
  components: {
    JusHeaderMain
  }
}
</script>

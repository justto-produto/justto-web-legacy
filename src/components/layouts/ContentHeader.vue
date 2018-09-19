<template lang="html">
  <el-header class="container-header">
    <div class="container-search">
      <jus-icon icon="search" is-active class="el-menu__icon"/>
      <input type="text" name="" value="" placeholder="Buscar">
    </div>
    <div class="container-info">
      <el-dropdown trigger="click" placement="bottom-start">
        <span class="el-dropdown-link">
          <user-avatar size="sm" :notifications="1" src="https://i.ytimg.com/vi/7s6YIIZjfrQ/maxresdefault.jpg"></user-avatar>
          <div class="container-info__name">
            <div>
              Mariana Rondino
            </div>
            <span>UX Designer</span>
          </div>
          <jus-icon icon="expand-dropdown"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <a @click="$router.push('/profile')">Perfil</a>
          </el-dropdown-item>
          <el-dropdown-item>
            <a @click="$router.push('/profile/notifications')">Notificações</a>
            </el-dropdown-item>
          <el-dropdown-item>
            <a @click="$router.push('/profile/activities')">Minhas atividades</a>
          </el-dropdown-item>
          <el-dropdown-item>
            <a href="http://ajuda.justto.com.br/" target="_blank">
              Central de ajuda
            </a>
          </el-dropdown-item>
          <el-dropdown-item divided>Sair</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
export default {
  name: 'ContentHeader'
}
</script>

<style lang="css">
</style>

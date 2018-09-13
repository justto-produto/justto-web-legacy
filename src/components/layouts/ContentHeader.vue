<template lang="html">
  <el-header class="container-header">
    <div class="container-search">
      <jus-icon icon="search" is-active class="el-menu__icon"/>
      <input type="text" name="" value="" placeholder="Buscar">
    </div>
    <div class="container-info">
      <el-dropdown trigger="click" placement="bottom-start">
        <span class="el-dropdown-link">
          <div class="container-info__avatar">
            <user-avatar></user-avatar>
          </div>
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
            <span @click="$router.push('/user')">Perfil</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="$router.push('/user/change-password')">Trocar senha</span>
            </el-dropdown-item>
          <el-dropdown-item>
            <span @click="$router.push('/user/notifications')">Notificações</span>
          </el-dropdown-item>
          <el-dropdown-item>Ajuda</el-dropdown-item>
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

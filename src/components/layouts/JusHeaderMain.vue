<template lang="html">
  <el-header class="main-header">
    <div class="main-header__search">
      <jus-icon icon="search" class="el-menu__icon-search"/>
      <input type="text" placeholder="Busque aqui os seus casos">
    </div>
    <div class="main-header__notification">
      <jus-icon icon="notification"/>
    </div>
    <div class="main-header__info">
      <el-dropdown trigger="click" placement="bottom-start">
        <span class="el-dropdown-link">
          <jus-avatar-user
            size="sm"
            src="https://i.ytimg.com/vi/7s6YIIZjfrQ/maxresdefault.jpg"/>
          <div class="main-info__name">
            <div>
              {{ $store.state.auth.user.name ? $store.state.auth.user.name : 'Mariana Rondino' }}
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
          <el-dropdown-item divided>
            <a @click="logout">
              Sair
            </a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
export default {
  name: 'JusHeaderMain',
  methods: {
    logout () {
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
    }
  }
}
</script>

<style lang="scss">
.main-header {
  background-color: #fff;
  box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.1);
  z-index: 1;
  display: flex;
}
.main-header__search {
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
.main-header__notification {
  margin: auto;
  margin-right: 32px;
}
.main-header__info {
  .el-dropdown-link {
    display: flex;
    align-items: center;
    margin: 8px 0;
    cursor: pointer;
  }
}
.main-info__name {
  margin: 0 10px;
  div {
    white-space: nowrap;
    font-weight: 600;
  }
  span {
    font-size: 12px;
    color: #666666;
    white-space: nowrap;
  }
}
</style>

<template>
  <el-header class="jus-header-main">
    <div class="jus-header-main__search">
      <jus-icon icon="search" class="el-menu__icon-search"/>
      <input type="text" placeholder="Busque aqui os seus casos">
    </div>
    <div class="jus-header-main__notification">
      <el-dropdown trigger="click" placement="bottom">
        <jus-icon icon="notification"/>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="e">Notificação importante 1</el-dropdown-item>
          <el-dropdown-item command="e">Notificação importante 2</el-dropdown-item>
          <el-dropdown-item command="e">Notificação importante 3</el-dropdown-item>
          <el-dropdown-item command="e">Notificação importante 4</el-dropdown-item>
          <el-dropdown-item command="e">Notificação importante 5</el-dropdown-item>
          <el-dropdown-item command="e">Notificação importante 6</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="jus-header-main__info">
      <el-dropdown trigger="click" placement="bottom-start">
        <span class="el-dropdown-link">
          <jus-avatar-user
            size="sm"
            src="https://i.ytimg.com/vi/7s6YIIZjfrQ/maxresdefault.jpg"/>
          <div class="main-info__name">
            <div>
              {{ name }}
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
  computed: {
    name () {
      return this.$store.state.accountModule.name ? this.$store.state.accountModule.name : 'Mariana Rondino'
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style lang="scss">
.jus-header-main {
  background-color: #fff;
  box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.1);
  z-index: 1;
  display: flex;
}
.jus-header-main__search {
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
.jus-header-main__notification {
  margin: auto;
  margin-right: 32px;
  cursor: pointer;
}
.jus-header-main__info {
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

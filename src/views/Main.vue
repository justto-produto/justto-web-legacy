<template>
  <el-container class="main">
    <el-aside>
      <img class="logo" src="@/assets/logo.svg">
        <el-menu default-active="2" class="menu-vertical main-menu" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
          <el-menu-item index="1" class="dashboard-item">
            <img class="menu-icon" src="@/assets/icons/ic-dashboard-inativo.svg">
            <span slot="title">Dashboard</span>
          </el-menu-item>
          <li class="menu-title">
            GERENCIAMENTO
          </li>
          <el-menu-item index="2">
            <img class="menu-icon" src="@/assets/icons/ic-importar-ativo.svg">
            <span slot="title">Importação</span>
          </el-menu-item>
          <el-menu-item index="3">
            <img class="menu-icon" src="@/assets/icons/ic-negociacao-inativo.svg">
            <span slot="title">Negociação</span>
          </el-menu-item>
          <el-menu-item index="4">
            <img class="menu-icon" src="@/assets/icons/ic-configuracoes-inativo.svg">
            <span slot="title">Configurações</span>
          </el-menu-item>
        </el-menu>
        <el-menu class="menu-vertical team-menu" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
          <li class="menu-title">
            TIME BONK E RIZZO
            <i class="el-icon-plus" style="float: right; font-size: 16px"></i>
          </li>
          <el-menu-item index="2">
            <img class="image-icon no-image">
            <span slot="title">Mariana Rondino</span>
            <span class="counter">0</span>
          </el-menu-item>
          <el-menu-item index="3">
            <img class="image-icon no-image">
            <span slot="title">Henrique Liberato</span>
            <span class="counter">12</span>
          </el-menu-item>
          <el-menu-item index="4">
            <img class="image-icon no-image">
            <span slot="title">Michelle Morcos</span>
            <span class="counter">3</span>
          </el-menu-item>
          <el-menu-item index="4">
            <img class="image-icon no-image">
            <span slot="title">Bruno Moreno</span>
            <span class="counter">22</span>
          </el-menu-item>
        </el-menu>
    </el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="scss">
.main{
  img{
    &.logo{
      margin: 40px 20px;
    }
    &.menu-icon{
      margin-right: 16px;
    }
    &.image-icon{
      width: 40px;
      height: 40px;
      margin-right: 10px;
      &.no-image{
        background-color: #c4c4c4;
        border-radius: 50%;
      }
    }
  }
  .menu-vertical{
    height: 2px;
    border-top: solid 1px #eeeeee;
    height: 2px;
    display: unset;
    &.main-menu{
      li:first-of-type{
        border-top: solid 1px #eeeeee;
      }
      li:last-of-type{
        border-bottom: solid 1px #eeeeee;
      }
      .menu-title{
        margin: 58px 20px 10px;
        font-size: 12px;
      }
    }
    &.team-menu{
      .menu-title{
        margin: 48px 20px 10px;
        font-size: 12px;
      }
      .counter{
        float: right;
      }
    }
  }
  .dashboard-item{
    border-bottom: solid 1px #eeeeee;
  }
  .el-menu-item{
    height: 64px;
    line-height: 64px;
    &.is-active{
      color: #323c47;
      font-weight: 500;
      background-color: #fafafa;
    }
    &:hover{
      background-color: #fafafa;
    }
  }
  .el-aside{
    background-color: #ffffff;
    box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.1);
    z-index: 2;
  }
  .el-header{
    background-color: #ffffff;
    box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.1);
    z-index: 1;
  }
  .el-main{
    background-color: #f9fafc;
  }
}
</style>

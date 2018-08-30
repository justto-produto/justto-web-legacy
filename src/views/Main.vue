<template>
  <el-container class="main">
    <el-aside>
      <img class="logo" src="@/assets/logo.svg"/>
      <el-menu default-active="1" class="menu-vertical main-menu" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
        <el-menu-item index="1" class="dashboard-item">
          <jus-icon icon="dashboard-active" is-active class="menu-icon"/>
          <span slot="title">Dashboard</span>
        </el-menu-item>
        <li class="menu-title">
          GERENCIAMENTO
        </li>
        <el-menu-item index="2">
          <jus-icon icon="import" is-active class="menu-icon"></jus-icon>
          <span slot="title">Importação</span>
        </el-menu-item>
        <el-menu-item index="3">
          <jus-icon icon="negotiation" is-active class="menu-icon"></jus-icon>
          <span slot="title">Negociação</span>
        </el-menu-item>
        <el-menu-item index="4">
          <jus-icon icon="settings" is-active class="menu-icon"></jus-icon>
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
      <el-header>
        <div class="search">
          <jus-icon icon="search" is-active class="menu-icon"/>
          <input type="text" name="" value="" placeholder="Buscar">
        </div>
        <div class="user-info">
          <div class="">
            <user-avatar></user-avatar>
          </div>
          <div class="info">
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
        <div style="pointer-events: none;width:100%;height:0;padding-bottom:100%;position:relative;"><iframe src="https://giphy.com/embed/PoImGf3Takz1BtpNSG" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import JusIcon from '@/components/images/JusIcon'
import UserAvatar from '@/components/images/UserAvatar'

export default {
  name: 'Main',
  components: {
    JusIcon,
    UserAvatar
  },
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
      border-left: 3px solid #7c4cf3;
      padding-left: 17px !important;
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
    display: flex;
    .search{
      display: flex;
      width: 100%;
      input{
        border: 0;
        outline: 0;
        height: 58px;
        font-size: 16px;
        opacity: .75;
        width: 98%;
      }
    }
    .user-info{
      display: flex;
      align-items: center;
      .info{
        margin: 0 10px;
        div{
          white-space: nowrap;
          font-weight: 600;
        }
        span{
          font-size: 12px;
          color: #666666;
        }
      }
    }
  }
  .el-main{
    background-color: #f9fafc;
  }
}
</style>

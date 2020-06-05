<template lang="html">
  <el-row class="admin-panel-view">
    <el-col
      :span="left"
      style="transition: width ease 1s;">
      <jus-sidenav-external show-exit>
        <el-menu
          default-active="0"
          class="el-menu-vertical-demo"
          background-color="#f7f7f7"
          @select="changeMenuIndex">
          <el-menu-item index="0">
            <i class="el-icon-s-cooperation" /> Equipes
          </el-menu-item>
          <!-- <el-menu-item index="1">
            <i class="el-icon-s-data" /> Dashboard
          </el-menu-item> -->
          <!-- <el-menu-item index="2">
            <i class="el-icon-user-solid" /> Usuários
          </el-menu-item> -->
          <el-menu-item index="3">
            <i class="el-icon-s-operation" /> Estratégias
          </el-menu-item>
          <!-- <el-menu-item index="4">
            <i class="el-icon-document" /> Minutas
          </el-menu-item>
          <el-menu-item index="5">
            <i class="el-icon-s-finance" /> Cobrança
          </el-menu-item> -->
        </el-menu>
      </jus-sidenav-external>
    </el-col>
    <transition name="swiper-fade">
      <el-col
        v-if="right > 0"
        :span="right"
        class="content">
        <h1>
          {{ $t('panel.' + menuIndex) }}
          <!-- <el-button
            v-if="['1', '2', '3', '4', '5'].includes(menuIndex)"
            type="primary"
            icon="el-icon-plus"
            style="float: right;"
            @click="add">
            Adicionar
          </el-button> -->
        </h1>
        <panel-workspace
          v-if="menuIndex === '0'"
          ref="panel1"/>
        <panel-dashboard
          v-if="menuIndex === '1'"
          ref="panel0"/>
        <panel-user
          v-if="menuIndex === '2'"
          ref="panel2"/>
        <panel-strategy
          v-if="menuIndex === '3'"
          ref="panel3"/>
        <panel-minute
          v-if="menuIndex === '4'"
          ref="panel4"/>
        <panel-billing
          v-if="menuIndex === '5'"
          ref="panel5"/>
      </el-col>
    </transition>
  </el-row>
</template>

<script>
import PanelStrategy from './partials/Strategy/PanelStrategy'

export default {
  name: 'AdminPanel',
  components: {
    JusSidenavExternal: () => import('@/components/layouts/JusSidenavExternal'),
    PanelDashboard: () => import('./partials/PanelDashboard'),
    PanelWorkspace: () => import('./partials/PanelWorkspace'),
    PanelUser: () => import('./partials/PanelUser'),
    PanelStrategy,
    PanelMinute: () => import('./partials/PanelMinute'),
    PanelBilling: () => import('./partials/PanelBilling'),
  },
  data() {
    return {
      menuIndex: '0',
      left: 12,
      right: 0,
    }
  },
  created() {
    setTimeout(function() {
      this.left = 5
    }.bind(this), 400)
    setTimeout(function() {
      this.right = 19
    }.bind(this), 1200)
  },
  methods: {
    changeMenuIndex(index) {
      this.menuIndex = index
    },
    add() {
      this.$refs[`panel${this.menuIndex}`].add()
    },
  },
}
</script>

<style lang="scss">
.admin-panel-view {
  height: 100%;
  background-color: #fff;
  >.el-col {
    height: 100%
  }
  .el-col.content {
    h1 {
      margin-left: 40px;
    }
    padding: 40px 0 30px;
    display: flex;
    flex-direction: column;
  }
  .el-backtop {
    right: 100px !important;
    bottom: 30px !important;
  }
  .el-pagination {
    text-align: center;
    margin-top: 38px;
  }
  .el-select {
    width: 100%;
  }
}
</style>

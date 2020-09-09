<template lang="html">
  <el-row class="admin-panel-view">
    <el-col
      :span="left"
      style="transition: width ease 1s;"
    >
      <jus-sidenav-external show-exit>
        <el-menu
          default-active="0"
          class="el-menu-vertical-demo"
          background-color="#f7f7f7"
          @select="changeMenuIndex"
        >
          <el-menu-item index="0">
            <i class="el-icon-s-cooperation" /> Equipes
          </el-menu-item>
          <!-- <el-menu-item index="1">
            <i class="el-icon-s-data" /> Dashboard
          </el-menu-item> -->
          <!-- <el-menu-item index="2">
            <i class="el-icon-user-solid" /> Usuários
          </el-menu-item> -->
          <el-menu-item
            v-if="havepermission.includes(accountEmail)"
            index="3"
          >
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
        class="content"
      >
        <div class="admin-panel-view__panel-header">
          <h1>{{ $t(`panel.${menuIndex}`) }}</h1>
          <div class="admin-panel-view__header-options">
            <el-input
              v-model="filterTerm"
              prefix-icon="el-icon-search"
              placeholder="Buscar"
              clearable
            />
            <el-button
              v-if="['1', '2', '3', '4', '5'].includes(menuIndex)"
              type="primary"
              icon="el-icon-plus"
              class="admin-panel-view__header-button"
              @click="mainButtonHandler"
            >
              Adicionar
            </el-button>
          </div>
        </div>
        <div v-if="!menuIndex" />
        <panel-workspace
          v-if="menuIndex === '0'"
          ref="panel1"
          :filter-term="filterTerm"
        />
        <panel-dashboard
          v-if="menuIndex === '1'"
          ref="panel0"
          :filter-term="filterTerm"
        />
        <panel-user
          v-if="menuIndex === '2'"
          ref="panel2"
          :filter-term="filterTerm"
        />
        <panel-strategy
          v-if="menuIndex === '3'"
          ref="panel3"
          :filter-term="filterTerm"
          @set-filter="setFilter"
        />
        <panel-minute
          v-if="menuIndex === '4'"
          ref="panel4"
          :filter-term="filterTerm"
        />
        <panel-billing
          v-if="menuIndex === '5'"
          ref="panel5"
          :filter-term="filterTerm"
        />
      </el-col>
    </transition>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AdminPanel',
  components: {
    JusSidenavExternal: () => import('@/components/layouts/JusSidenavExternal'),
    PanelDashboard: () => import('./partials/PanelDashboard'),
    PanelWorkspace: () => import('./partials/PanelWorkspace'),
    PanelUser: () => import('./partials/PanelUser'),
    PanelMinute: () => import('./partials/PanelMinute'),
    PanelBilling: () => import('./partials/PanelBilling'),
    PanelStrategy: () => import('./partials/Strategy/PanelStrategy'),
  },
  data() {
    return {
      menuIndex: -1,
      left: 12,
      right: 0,
      filterTerm: '',
      havepermission: ['lucas@justto.com.br', 'kelvin@justto.com.br', 'aline@justto.com.br', 'helio@justto.com.br'],
    }
  },
  computed: {
    ...mapGetters(['accountEmail']),
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
    mainButtonHandler() {
      this.$refs[`panel${this.menuIndex}`].mainButtonHandler()
    },
    setFilter(value) {
      this.filterTerm = value
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
  &__panel-header {
    display: flex;
    justify-content: space-between;

  }
  &__header-options {
    display: flex;
    margin: 20px 0;
    margin-right: 40px;

    .admin-panel-view__header-button {
      margin-left: 16px;
    }
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

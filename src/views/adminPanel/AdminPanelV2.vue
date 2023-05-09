<template>
  <el-container class="admin-panel-view">
    <el-aside class="admin-panel-view__aside">
      <el-menu class="admin-panel-view__menu">
        <el-menu-item
          v-for="(item, index) in menuItems.filter(({ isVisible }) => isVisible)"
          :key="index"
          :index="index"
          class="admin-panel-view__menu-item"
          @click="() => item.action()"
        >
          <i
            v-if="item.iconType === 'el'"
            :class="item.icon"
            class="admin-panel-view__menu-item__icon"
          />

          <JusIcon
            v-else
            icon="logo-menu-dark"
            size="1.75rem"
            svg-family="light"
            class="admin-panel-view__menu-item__icon"
          />
        </el-menu-item>
      </el-menu>
    </el-aside>
  </el-container>
  <!-- <el-row class="admin-panel-view">
    <el-col
      :span="left"
      style="transition: width ease 1s;"
    >
      <jus-sidenav-external
        show-exit
        :redirect-to="getCustomHome || '/'"
      >
        <el-menu
          default-active="0"
          class="el-menu-vertical-demo"
          background-color="#f7f7f7"
          @select="changeMenuIndex"
        >
          <el-menu-item index="0">
            <i class="el-icon-s-cooperation" /> Equipes
          </el-menu-item>

          <el-menu-item
            v-if="havepermission.includes(accountEmail)"
            index="3"
          >
            <i class="el-icon-s-operation" /> Estratégias
          </el-menu-item>

          <el-menu-item
            v-if="testers.includes(accountEmail)"
            index="6"
          >
            <i class="el-icon-s-order" /> Workspaces
          </el-menu-item>

          <el-menu-item index="7">
            <i class="el-icon-chat-line-round" /> WhatsApp
          </el-menu-item>

          <el-menu-item index="8">
            <i class="el-icon-search" /> Buscar
          </el-menu-item>
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
              v-if="!['6', '7', '8'].includes(menuIndex)"
              v-model="filterTerm"
              prefix-icon="el-icon-search"
              placeholder="Buscar"
              size="small"
              clearable
            />
            <el-button
              v-if="['1', '2', '3', '4', '5'].includes(menuIndex)"
              type="primary"
              size="small"
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

        <WorkspaceList
          v-if="menuIndex === '6'"
          ref="panel6"
          class="workspace-panel"
        />

        <PanelWhatsApp
          v-if="menuIndex === '7'"
          ref="panel7"
          :filter-term="filterTerm"
        />

        <PanelGlobalSearch
          v-if="menuIndex === '8'"
          ref="panel8"
        />
      </el-col>
    </transition>
  </el-row> -->
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AdminPanel',
  components: {
    // Workspace: () => import('@/views/main/configurations/partials/WorkspaceList'),
    // JusSidenavExternal: () => import('@/components/layouts/JusSidenavExternal'),
    // PanelStrategy: () => import('./partials/Strategy/PanelStrategy'),
    // PanelGlobalSearch: () => import('./partials/PanelGlobalSearch'),
    // PanelDashboard: () => import('./partials/PanelDashboard'),
    // PanelWorkspace: () => import('./partials/PanelWorkspace'),
    // PanelWhatsApp: () => import('@/views/main/watsapp/Views'),
    // WorkspaceList: () => import('./partials/WorkspaceList'),
    // PanelBilling: () => import('./partials/PanelBilling'),
    // PanelMinute: () => import('./partials/PanelMinute'),
    // PanelUser: () => import('./partials/PanelUser')
  },
  data() {
    return {
      menuIndex: -1,
      left: 12,
      right: 0,
      filterTerm: '',
      havepermission: [
        'lucas@justto.com.br',
        'michelle@justto.com.br',
        'kelvin@justto.com.br',
        'josewilliam@justto.com.br',
        'daniel@justto.com.br',
        'deivid@justto.com.br'
      ],
      testers: [
        'lucas@justto.com.br',
        'josewilliam@justto.com.br',
        'daniel@justto.com.br',
        'deivid@justto.com.br'
      ]
    }
  },
  computed: {
    ...mapGetters([
      'accountEmail',
      'getCustomHome'
    ]),

    menuItems() {
      return [{
        isVisible: true,
        iconType: 'ic',
        icon: 'logo-menu-dark',
        action: () => {
          this.$router.push({ name: 'dashboard' })
        }
      }, {
        isVisible: this.havepermission.includes(this.accountEmail),
        iconType: 'el',
        icon: 'el-icon-s-operation',
        action: () => {
          // DO SOME THING
        }
      }, {
        isVisible: this.testers.includes(this.accountEmail),
        iconType: 'el',
        icon: 'el-icon-s-order',
        action: () => {
          // DO SOME THING
        }
      }, {
        isVisible: true,
        iconType: 'el',
        icon: 'el-icon-chat-line-round',
        action: () => {
          // DO SOME THING
        }
      }, {
        isVisible: true,
        iconType: 'el',
        icon: 'el-icon-search',
        action: () => {
          // DO SOME THING
        }
      }]
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

    mainButtonHandler() {
      this.$refs[`panel${this.menuIndex}`].mainButtonHandler()
    },

    setFilter(value) {
      this.filterTerm = value
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

.admin-panel-view{
  width: 58px;
  height: 100vh;
  padding: 9px 18px;
  text-align: center;
  padding-right: 0;
  padding-left: 0;
  background-color: $--pj-color-blue;

  .admin-panel-view__aside {
    width: 100% !important;

    .admin-panel-view__menu {
      width: 100%;
      background-color: $--pj-color-blue;

      .admin-panel-view__menu-item {
        background-color: $--pj-color-blue;
        padding: 0 !important;

        .admin-panel-view__menu-item__icon {
          filter: invert(1);

          &::before {
            font-size: 1.75rem;
            color: black;
          }
        }

        &.is-active, &:hover {
          background-color: rgba(255, 255, 255, 0.2) !important;
          border-left: solid thick $--color-white !important;
        }
      }
    }
  }
}
// .admin-panel-view {
//   height: 100%;
//   background-color: #fff;
//   >.el-col {
//     height: 100%
//   }

//   &__panel-header {
//     display: flex;
//     justify-content: space-between;
//   }

//   &__header-options {
//     display: flex;
//     margin: 20px 0;
//     margin-right: 40px;

//     .admin-panel-view__header-button {
//       margin-left: 16px;
//     }
//   }

//   .el-col.content {
//     h1 {
//       margin-left: 40px;
//     }
//     padding: 0;
//     display: flex;
//     flex-direction: column;
//   }

//   .el-backtop {
//     right: 100px !important;
//     bottom: 30px !important;
//   }

//   .el-pagination {
//     text-align: center;
//     margin-top: 38px;
//   }

//   .el-select {
//     width: 100%;
//   }

//   .workspace-panel {
//     height: 100%;
//     width: 100%;
//     overflow-y: scroll;

//     .workspace-container__table {
//       height: calc(100vh - 70px) !important;
//     }
//   }

//   .whatsapp-views {
//     overflow-y: scroll;
//   }
// }
</style>

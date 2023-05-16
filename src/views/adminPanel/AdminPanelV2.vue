<template>
  <el-container class="new-admin-panel">
    <el-aside class="new-admin-panel__aside">
      <el-menu
        class="new-admin-panel__menu"
        :default-active="menuIndex"
        @select="handleSelectMenuItem"
      >
        <el-menu-item
          v-for="(item, index) in menuItems.filter(({ isVisible }) => isVisible)"
          :key="index"
          :index="'' + index"
          class="new-admin-panel__menu-item"
          @click="() => item.action()"
        >
          <el-tooltip
            :content="item.name"
            :open-delay="500"
            placement="right"
          >
            <i
              v-if="item.iconType === 'el'"
              :class="item.icon"
              class="new-admin-panel__menu-item__icon"
            />

            <JusIcon
              v-else
              icon="logo-menu-dark"
              size="1.75rem"
              svg-family="light"
              class="new-admin-panel__menu-item__icon"
            />
          </el-tooltip>
        </el-menu-item>
      </el-menu>

      <el-button
        type="text"
        class="new-admin-panel__exit"
        @click="logout"
      >
        Sair
      </el-button>
    </el-aside>

    <el-container class="new-admin-panel__container">
      <el-header class="new-admin-panel__container__header">
        <div class="el-input">
          <input
            type="text"
            class="el-input__inner"
            placeholder="Buscar:"
          >
          <!-- Implementar Busca. -->
        </div>
      </el-header>

      <el-main class="new-admin-panel__container__main">
        <div v-if="menuIndex === '1'">
          Nova listagem de estratégia aqui
        </div>

        <WorkspaceList
          v-if="menuIndex === '2'"
          ref="panel2"
          class="workspace-panel"
        />

        <PanelWhatsApp
          v-if="menuIndex === '3'"
          ref="panel3"
          :filter-term="filterTerm"
        />

        <PanelGlobalSearch
          v-if="menuIndex === '4'"
          ref="panel4"
        />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AdminPanel',
  components: {
    // Workspace: () => import('@/views/main/configurations/partials/WorkspaceList'),
    // JusSidenavExternal: () => import('@/components/layouts/JusSidenavExternal'),
    // PanelStrategy: () => import('./partials/Strategy/PanelStrategy'),
    PanelGlobalSearch: () => import('./partials/PanelGlobalSearch'),
    // PanelDashboard: () => import('./partials/PanelDashboard'),
    // PanelWorkspace: () => import('./partials/PanelWorkspace'),
    PanelWhatsApp: () => import('@/views/main/watsapp/Views'),
    WorkspaceList: () => import('./partials/WorkspaceList')
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
        name: 'Plataforma',
        isVisible: true,
        iconType: 'ic',
        icon: 'logo-menu-dark',
        action: () => {
          this.$router.push({ name: 'dashboard' })
        }
      }, {
        name: 'Estratégias',
        isVisible: this.havepermission.includes(this.accountEmail),
        iconType: 'el',
        icon: 'el-icon-s-operation',
        action: () => {}
      }, {
        name: 'Workspaces',
        isVisible: this.testers.includes(this.accountEmail),
        iconType: 'el',
        icon: 'el-icon-s-order',
        action: () => {}
      }, {
        name: 'WhatsApp',
        isVisible: true,
        iconType: 'el',
        icon: 'el-icon-chat-line-round',
        action: () => {}
      }, {
        name: 'Busca Global',
        isVisible: true,
        iconType: 'el',
        icon: 'el-icon-search',
        action: () => {}
      }]
    }
  },

  methods: {
    ...mapActions(['logout']),

    changeMenuIndex(index) {
      this.menuIndex = index
    },

    mainButtonHandler() {
      this.$refs[`panel${this.menuIndex}`].mainButtonHandler()
    },

    setFilter(value) {
      this.filterTerm = value
    },

    handleSelectMenuItem(index) {
      this.menuIndex = index
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.new-admin-panel{
  display: flex;
  width: 100vw;
  overflow: hidden;

  .new-admin-panel__aside {
    width: 58px;
    max-width: 58px;
    height: 100vh;
    padding: 9px 18px;
    text-align: center;
    padding-right: 0;
    padding-left: 0;
    background-color: $--pj-color-blue;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .new-admin-panel__menu {
      width: 100%;
      background-color: $--pj-color-blue;

      .new-admin-panel__menu-item {
        background-color: $--pj-color-blue;
        padding: 0 !important;

        .new-admin-panel__menu-item__icon {
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

    .new-admin-panel__exit {
      cursor: pointer;

      span {
        color: $--color-white !important;
      }
    }
  }

  .new-admin-panel__container {
    width: 100%;
    height: 100vh;
  }
}
</style>

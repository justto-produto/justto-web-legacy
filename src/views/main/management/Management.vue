<template>
  <jus-view-main class="view-management">
    <template slot="title">
      <h1>Gerenciamento</h1>
    </template>
    <template slot="main">
      <div class="view-management__filters">
        <el-tabs
          ref="disputeTabs"
          :before-leave="handleChangeTab"
          v-model="activeTab"
          class="view-management__tabs">
          <el-tab-pane name="0">
            <span slot="label">
              Sem resposta
              <el-badge
              :hidden="!engagementLength"
              :value="engagementLength"
              :max="99"
              class="el-badge--absolute" />
            </span>
          </el-tab-pane>
          <el-tab-pane name="1">
            <span slot="label">
              Em negociação
              <el-badge
              :hidden="!interactionLength"
              :value="interactionLength"
              :max="99"
              class="el-badge--absolute" />
            </span>
          </el-tab-pane>
          <el-tab-pane name="2" label="Com Interação">
            <span slot="label">
              Proposta aceita
              <el-badge
              :hidden="!newDealsLength"
              :value="newDealsLength"
              :max="99"
              class="el-badge--absolute" />
            </span>
          </el-tab-pane>
          <el-tab-pane name="3" label="Com Interação">
            <span slot="label">Todos</span>
          </el-tab-pane>
        </el-tabs>
        <div class="view-management__buttons">
          <el-input prefix-icon="el-icon-search" />
          <el-button plain @click="filtersVisible = true">
            <jus-icon :is-white="false" icon="filter" />
            Filtros
          </el-button>
          <el-button
            :loading="loadingExport"
            :disabled="disputes.length === 0"
            plain
            icon="el-icon-download"
            data-testid="export-disputes"
            @click="exportDisputes">
            Exportar
          </el-button>
        </div>
      </div>
      <management-table :disputes="[]" />
    </template>
  </jus-view-main>
</template>

<script>
export default {
  name: 'Management',
  components: {
    JusDisputeResume: () => import('@/components/layouts/JusDisputeResume'),
    ManagementTable: () => import('./partials/ManagementTable')
  },
  data () {
    return {
      activeTab: '0',
      loadingExport: false,
      filtersVisible: false
    }
  },
  computed: {
    engagementLength () {},
    interactionLength () {},
    newDealsLength () {},
    filters () {},
    disputes () {
      return  []
    }
  },
  methods: {
    handleChangeTab () {},
    exportDisputes () {}
  }
}
</script>

<style lang="scss">
.view-management {
  &__filters {
    display: flex;
    justify-content: space-between;
  }
  &__tabs {

  }
  &__buttons {
    .el-input + button {
      margin-left: 10px;
    }
    .el-input {
      width: 200px;
    }
    img {
      margin: -3px 0px;
      width: 14px;
    }
  }
}
</style>

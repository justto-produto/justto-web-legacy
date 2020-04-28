<template>
  <jus-view-main class="dashboard-view">
    <template slot="main">
      <el-row :gutter="20">
        <el-col :span="12">
          <jus-chart-bar class="dashboard-view__dataset" ref="line" :data="chartsDatasets[1].data" :options="opt" />
        </el-col>
        <el-col :span="12">
          <jus-chart-line class="dashboard-view__dataset" ref="line" :data="chartsDatasets[0].data" :options="opt" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <jus-chart-line class="dashboard-view__dataset" ref="line" :data="chartsDatasets[3].data" :options="opt" />
        </el-col>
        <el-col :span="12">
        </el-col>
      </el-row>
      <el-button type="" @click="reload('DISPUTE_AVG_RESPONSE_TIME')">Teste</el-button>
    </template>
  </jus-view-main>
</template>

<script>
export default {
  name: 'Dashboard',
  components: {
    JusChartLine: () => import('@/components/charts/JusChartLine'),
    JusChartBar: () => import('@/components/charts/JusChartBar')
  },
  data () {
    return {
      opt: {
        onClick: this.filter
      }
    }
  },
  computed: {
    chartsDatasets () {
      return this.$store.getters.chartsDatasets
    }
  },
  methods: {
    reload (chartName) {
      this.$store.dispatch('getDashboard', chartName)
    },
    filter (event, array) {
      const element = this.$refs.line.getElement(event)
      const filters = (element && element.filter) || null
      if (filters) {
        this.$confirm(
          'Deseja ver as disputas no painel de gerenciamento?',
          'Ir para gerenciamento', {
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
            cancelButtonClass: 'is-plain',
            type: 'info'
          }).then(() => {
          this.$store.commit('clearDisputeQuery')
          for (let key in filters) {
            if (filters.hasOwnProperty(key)) {
              this.$store.commit('updateDisputeQuery', { key, value: filters[key] })
            }
          }
          this.$store.commit('setDisputeHasFilters', true)
          this.$store.commit('setDisputesTab', '3')
          this.$router.push('/management')
        })
      }
    }
  }
}
</script>

<style lang="scss">
.dashboard-view {
  .el-card__body {
    height: 100%
  }
  &__dataset {
    width: 100%;
    height: 100%;
  }
}
</style>

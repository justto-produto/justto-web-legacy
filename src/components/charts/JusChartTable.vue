<template lang="html">
  <el-table
    :data="disputeStatusSummaryWithWarn"
    :header-row-class-name="headerRowClassName"
    max-height="100%"
    size="medium"
    show-summary
    class="jus-chart-table"
    @cell-click="cellClick">
    <el-table-column
      prop="label"
      class-name="status"
      label="Status"/>
    <el-table-column
      :index="0"
      align="center"
      class-name="withoutAlert"
      prop="withoutAlert"
      label="Sem alerta"/>
    <el-table-column
      :index="1"
      align="center"
      class-name="withAlert"
      prop="withAlert"
      label="Com alerta"/>
    <el-table-column
      :index="2"
      align="center"
      prop="total"
      class-name="total"
      label="Total"/>
  </el-table>
</template>

<script>
export default {
  name: 'JusChartTable',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    disputeStatusSummaryWithWarn () {
      let self = this
      let disputeStatusSummaryWithWarn = []
      this.data.labels.forEach((label, index) => {
        disputeStatusSummaryWithWarn.push({
          label,
          withoutAlert: self.data.datasets[0].data[index],
          withAlert: self.data.datasets[1].data[index],
          total: self.data.datasets[2].data[index],
          statusIndex: index
        })
      })
      return disputeStatusSummaryWithWarn
    },
    selectedMemberId () {
      return this.$store.getters.dashboardSelectedMemberId
    }
  },
  methods: {
    headerRowClassName ({ row, rowIndex }) {
      return 'header'
    },
    cellClick (row, column, cell, event) {
      let statusIndex = row.statusIndex
      let cellIndex = cell.cellIndex
      let columnIndex = column.index
      let statusFilters = this.data.filter[statusIndex]
      let datasetFilters = this.data.datasets[columnIndex] ? this.data.datasets[columnIndex].filter[cellIndex] : null
      if (datasetFilters) {
        const filters = Object.assign(statusFilters, datasetFilters)
        this.$confirm(
          'Deseja ver as disputas no painel de gerenciamento?',
          'Ir para gerenciamento', {
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
            cancelButtonClass: 'is-plain',
            type: 'info'
          }).then(() => {
          this.$store.commit('clearDisputeQuery')
          this.$store.commit('updateDisputeQuery', { key: 'status', value: [] })
          for (let key in filters) {
            if (filters.hasOwnProperty(key)) {
              this.$store.commit('updateDisputeQuery', { key, value: filters[key] })
            }
          }
          if (this.selectedMemberId) {
            this.$store.commit('updateDisputeQuery', { key: 'persons', value: [this.selectedMemberId] })
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
@import '@/styles/colors.scss';

.jus-chart-table {
  padding-right: 10px;
  .header th{
    background: #f6f6f6;
  }
  td.status {
    background: #f6f6f6;
    font-weight: bold;
  }
  td.withoutAlert {
    background: #1abc9c !important;
    color: #fff !important;
  }
  td.withAlert {
    background: #e74c3c !important;
    color: #fff !important;
  }
  td.total {
    background: #f1c40f !important;
    color: #fff !important;
  }
  .el-table__footer td {
    font-weight: bold;
    background: #f6f6f6 !important;
    color: #adadad !important;
  }
  &::before {
    background: #fff;
  }
}
</style>

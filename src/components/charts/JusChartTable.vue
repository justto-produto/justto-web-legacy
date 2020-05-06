<template lang="html">
  <el-table
    :data="disputeStatusSummaryWithWarn"
    :header-row-class-name="headerRowClassName"
    height="100%"
    size="medium"
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
      label="Sem alerta">
      <template slot-scope="scope">
        <el-tooltip :disabled="scope.row.withoutAlert < 1" content="Clique para ver estas disputas">
          <span>{{ scope.row.withoutAlert }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column
      :index="1"
      align="center"
      class-name="withAlert"
      prop="withAlert"
      label="Com alerta">
      <template slot-scope="scope">
        <el-tooltip :disabled="scope.row.withAlert < 1" content="Clique para ver estas disputas">
          <span>{{ scope.row.withAlert }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column
      :index="2"
      align="center"
      prop="total"
      class-name="total"
      label="Total">
      <template slot-scope="scope">
        <el-tooltip :disabled="scope.row.total < 1" content="Clique para ver estas disputas">
          <span>{{ scope.row.total }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
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
      let sumWithoutAlert = 0
      let sumWithAlert = 0
      let sumTotal = 0
      this.data.labels.forEach((label, index) => {
        sumWithoutAlert += self.data.datasets[0].data[index]
        sumWithAlert += self.data.datasets[1].data[index]
        sumTotal += self.data.datasets[2].data[index]
        disputeStatusSummaryWithWarn.push({
          label,
          withoutAlert: self.data.datasets[0].data[index],
          withAlert: self.data.datasets[1].data[index],
          total: self.data.datasets[2].data[index],
          statusIndex: index
        })
      })
      disputeStatusSummaryWithWarn.push({
        label: 'TOTAL',
        withoutAlert: sumWithoutAlert,
        withAlert: sumWithAlert,
        total: sumTotal,
        statusIndex: 4
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
      if (cell.textContent !== '0') {
        let statusIndex = row.statusIndex
        let cellIndex = cell.cellIndex
        let columnIndex = column.index
        let statusFilters
        if (statusIndex === 4) statusFilters = { [Object.keys(this.data.filter[0])[1]]: Object.values(this.data.filter[0])[1] }
        else statusFilters = this.data.filter[statusIndex]
        let datasetFilters = this.data.datasets[columnIndex] ? this.data.datasets[columnIndex].filter[cellIndex] : null
        if (columnIndex !== undefined && (datasetFilters || statusFilters)) {
          const filters = Object.assign(statusFilters || {}, datasetFilters || {})
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
        }
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
    background: #1abc9c80 !important;
  }
  td.withAlert {
    background: #f1c40f80 !important;
  }
  td.total {
    font-weight: bold;
    background: #f6f6f6 !important;
    color: #424242 !important;
  }
  .el-table__footer td {
    font-weight: bold;
    background: #f6f6f6;
    color: #424242;
  }
  &::before {
    background: #fff;
  }
  .el-tooltip  {
    display: block;
    width: 100%;
    cursor: pointer;
  }
  .el-table__body {
    height: 100%;
  }
}
</style>

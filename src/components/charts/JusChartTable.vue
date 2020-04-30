<template lang="html">
  <el-table
    :data="disputeStatusSummaryWithWarn"
    :header-row-class-name="headerRowClassName"
    max-height="100%"
    size="medium"
    show-summary
    class="jus-chart-table">
    <el-table-column
      prop="label"
      class-name="status"
      label="Status"/>
    <el-table-column
      align="center"
      class-name="withoutAlert"
      prop="withoutAlert"
      label="Sem alerta"/>
    <el-table-column
      align="center"
      class-name="withAlert"
      prop="withAlert"
      label="Com alerta"/>
    <el-table-column
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
      let disputeStatusSummaryWithWarn = []
      for (const label in this.data.labels) {
        disputeStatusSummaryWithWarn.push({
          label: this.data.labels[label],
          withoutAlert: this.data.datasets[0].data[label],
          withAlert: this.data.datasets[1].data[label],
          total: this.data.datasets[2].data[label]
        })
      }
      return disputeStatusSummaryWithWarn
    }
  },
  methods: {
    headerRowClassName ({ row, rowIndex }) {
      return 'header'
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

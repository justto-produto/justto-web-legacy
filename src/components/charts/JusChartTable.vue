<template lang="html">
  <el-table
    :data="disputeStatusSummaryWithWarn"
    border>
    <el-table-column
      prop="label"
      label="Status"/>
    <el-table-column
      prop="withoutAlert"
      label="Sem alerta"/>
    <el-table-column
      prop="withAlert"
      label="Com alerta"/>
    <el-table-column
      prop="total"
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
  }
}
</script>

<style lang="scss">
</style>

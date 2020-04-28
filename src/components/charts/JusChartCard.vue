<template lang="html">
  <div class="chart-Card-view">
    <el-card v-for="dataset in data.datasets">
      {{ dataset.label }}
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'JusChartCard',
  props: {  
    data: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss">
.chart-Card-view {

}
</style>

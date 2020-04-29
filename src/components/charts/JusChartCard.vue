<template lang="html">
  <div class="chart-card-view">
    <el-card v-for="dataset in datasets" :key="dataset.label" class="chart-card-view__card">
      <div class="chart-card-view__icon">
        <!-- <jus-icon :icon="" /> -->
      </div>
      <div class="chart-card-view__info">
        <span class="chart-card-view__label">{{ dataset.label }}</span>
        <span class="chart-card-view__value">{{ dataset.data[0] | currency }}</span>
      </div>
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
  },
  computed: {
    datasets () {
      return this.data && this.data.datasets ? this.data.datasets : []
    }
  }
}
</script>

<style lang="scss">
.chart-card-view {
  display: flex;
  flex-direction: column;
  &__card {
    flex: 1;
    margin-top: 16px;
    display: flex;
    align-items: center;
    &:first-child {
      margin-top: 0px;
    }
  }
  .el-card__body {
    display: flex;
    align-items: center;
  }
  &__info {
    display: flex;
    flex-direction: column;
    font-weight: bold;
  }
  &__label {
    font-size: 16px;
  }
  &__value {
    font-size: 22px;
    margin-top: 8px;
  }
}
</style>

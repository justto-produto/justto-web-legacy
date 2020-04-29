<template lang="html">
  <div class="chart-card-view">
    <el-card v-for="dataset in datasets" :key="dataset.label" :style="'background:' + getIcon(dataset.label).color" class="chart-card-view__card" shadow="never">
      <div class="chart-card-view__icon">
        <i :class="getIcon(dataset.label).icon" />
      </div>
      <div class="chart-card-view__info">
        <span class="chart-card-view__label">{{ $t('dashboard.' + dataset.label) | capitalize }}</span>
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
    },
    colors () {
      return this.$store.state.tagModule.colors
    }
  },
  methods: {
    getIcon (label) {
      switch (label) {
        case 'AMOUNT_RESTRICTION_AVG':
          return {
            icon: 'el-icon-s-ticket',
            color: this.colors[0]
          }
        case 'AMOUNT_PROPOSED_AVG':
          return {
            icon: 'el-icon-s-finance',
            color: this.colors[3]
          }
        case 'AMOUNT_SAVED_AVG':
          return {
            icon: 'el-icon-s-marketing',
            color: this.colors[4]
          }
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.chart-card-view {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  &__card {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    &+ .chart-card-view__card {
      margin-top: 10px;
    }
  }
  .el-card__body {
    display: flex;
    align-items: center;
    padding: 12px 15px;
  }
  &__icon {
    position: absolute;
    bottom: -50px;
    left: 0px;
    opacity: .2;
    font-size: 130px;
    z-index: 1;
  }
  &__info {
    display: flex;
    flex-direction: column;
    text-align: right;
    color: $--color-white;
    z-index: 2;
  }
  &__label {
    font-size: 14px;
  }
  &__value {
    font-weight: 500;
    font-size: 28px;
    margin-top: 4px;
  }
}
</style>

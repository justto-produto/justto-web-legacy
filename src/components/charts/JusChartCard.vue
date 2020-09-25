<template lang="html">
  <div class="chart-card-view">
    <el-card
      v-for="dataset in datasets"
      :key="dataset.label"
      :style="'background:' + dataset.color"
      class="chart-card-view__card"
    >
      <div :class="'chart-card-view__icon ' + dataset.label">
        <i :class="dataset.icon" />
      </div>
      <el-tooltip content="Valor referente a todo o período desse time">
        <div class="chart-card-view__info">
          <span class="chart-card-view__label">{{ $t('dashboard.' + dataset.label) | capitalize }}</span>
          <span class="chart-card-view__value">
            {{ dataset.data[0] | currency }}
            <span v-if="dataset.savingsPercentage">({{ dataset.savingsPercentage }}%)</span>
          </span>
        </div>
      </el-tooltip>
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
    datasets() {
      return this.data && this.data.datasets
        ? this.data.datasets.filter(ds => ds.label !== 'SAVINGS_PERCENTAGE').map(ds => {
          switch (ds.label) {
            case 'UPPER_RANGE_AVG':
              ds.icon = 'el-icon-s-ticket'
              ds.color = this.colors[0]
              break
            case 'SETTLED_DEALS_AVG':
              ds.icon = 'el-icon-s-finance'
              ds.color = this.colors[3]
              break
            case 'SAVINGS_TOTAL':
              ds.icon = 'el-icon-s-marketing'
              ds.color = this.colors[4]
              ds.savingsPercentage = this.savingsPercentage
              break
          }
          return ds
        })
        : []
    },
    savingsPercentage() {
      return this.data && this.data.datasets
        ? this.data.datasets.find(ds => ds.label === 'SAVINGS_PERCENTAGE').data[0] : null
    },
    colors() {
      return this.$store.state.tagModule.colors
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.chart-card-view {
  display: flex;
  flex-direction: column;
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
    padding: 5px 15px;
  }
  &__icon {
    position: absolute;
    bottom: -50px;
    left: 0px;
    opacity: .2;
    font-size: 130px;
    z-index: 1;
    text-align: center;
    width: 130px;
    &.UPPER_RANGE_AVG {
      bottom: -40px;
    }
    .el-icon-s-ticket {
      font-size: 112px;
    }
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

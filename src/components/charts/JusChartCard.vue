<template lang="html">
  <div class="chart-card-view">
    <el-card v-for="dataset in datasets" :key="dataset.label" class="chart-card-view__card">
      <div :style="'color:' + getIcon(dataset.label).color" class="chart-card-view__icon">
        <i :class="getIcon(dataset.label).icon" />
        <!-- <jus-icon :icon="" /> -->
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
  &__card {
    flex: 1;
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    &:first-child {
      margin-top: 0px;
    }
  }
  .el-card__body {
    display: flex;
    align-items: center;
  }
  &__icon {
    position: absolute;
    bottom: -56px;
    left: 16px;
    opacity: .5;
    font-size: 160px;
  }
  &__info {
    display: flex;
    flex-direction: column;
    text-align: right;
  }
  &__label {
    font-size: 16px;
  }
  &__value {
    font-size: 24px;
    margin-top: 4px;
  }
}
</style>

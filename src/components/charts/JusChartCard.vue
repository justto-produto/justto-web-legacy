<template>
  <div class="chart-card-view">
    <el-row ref="chartViewRow">
      <el-col
        v-for="dataset in datasets"
        :key="dataset.label"
        :style="`width: ${dataset.width}%;`"
      >
        <el-card
          :id="dataset.label"
          :style="`background: ${dataset.color};`"
          class="chart-card-view__card"
          :class="{'center': dataset.isGraph}"
          shadow="never"
        >
          <div
            v-if="!dataset.isGraph"
            :class="'chart-card-view__icon ' + dataset.label"
          >
            <jus-icon :icon="dataset.icon" />
          </div>
          <el-tooltip content="Valor referente a todo o período desse time">
            <div
              v-if="!dataset.isGraph"
              class="chart-card-view__info"
              :class="{ 'dark-text': dataset.labelDark }"
            >
              <span class="chart-card-view__label">
                {{ $t('dashboard.' + dataset.label) | capitalize }}
              </span>
              <span class="chart-card-view__value">
                <span v-if="!dataset.isPercentage">
                  {{ dataset.data[0] | currency }}
                </span>
                <span v-else>
                  {{ dataset.data[0] }}%
                </span>
                <span v-if="dataset.savingsPercentage">({{ dataset.savingsPercentage }}%)</span>
              </span>
            </div>
            <div
              v-else
              class="chart-card-view__info"
              :class="{ 'dark-text': dataset.labelDark }"
            >
              <el-progress
                type="dashboard"
                :width="npsWidth"
                :color="colors"
                :percentage="dataset.data[0]"
                :format="(value) => `${value}`"
              />
              <span class="progress-label">
                nps
              </span>
            </div>
          </el-tooltip>
        </el-card>
      </el-col>
    </el-row>
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
            case 'NPS_PROMOTER_PERCENTAGE':
              ds.icon = 'nps-promoter-emoji'
              ds.width = 25
              ds.isPercentage = true
              ds.labelDark = false
              ds.color = '#14CC30'
              break
            case 'NPS':
              ds.isGraph = true
              ds.labelDark = true
              ds.width = 25
              break
            case 'NPS_DETRACTOR_PERCENTAGE':
              ds.icon = 'nps-detractor-emoji'
              ds.width = 25
              ds.isPercentage = true
              ds.labelDark = false
              ds.color = '#FF4B54'
              break
            case 'NPS_PASSIVE_PERCENTAGE':
              ds.icon = 'nps-passive-emoji'
              ds.width = 25
              ds.isPercentage = true
              ds.labelDark = true
              ds.color = '#F5F5F5'
              break
            case 'UPPER_RANGE_AVG':
              ds.icon = 'upper-range-emoji'
              ds.width = 50
              ds.isPercentage = false
              ds.labelDark = false
              ds.color = '#FED300'
              break
            case 'SETTLED_DEALS_AVG':
              ds.icon = 'settled-deals-emoji'
              ds.width = 50
              ds.isPercentage = false
              ds.labelDark = false
              ds.color = '#30A4F2'
              break
            case 'SAVINGS_TOTAL':
              ds.icon = 'savings-total-emoji'
              ds.width = 100
              ds.isPercentage = false
              ds.labelDark = false
              ds.color = '#00DBAE'
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
      return [
        { color: '#FF4B54', percentage: 20 },
        { color: '#707070', percentage: 60 },
        { color: '#14CC30', percentage: 100 }
      ]
    },
    npsWidth() {
      return (document.querySelector('#NPS')?.clientHeight || 50) - 5
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.chart-card-view {
  .el-row {
    .el-col {
      min-height: 70px;
      padding: 5px;
      height: 33%;

      .chart-card-view__card {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        position: relative;
        border: none;

        &.center {
          margin-bottom: 0;
          justify-content: center;
        }

        &+ .chart-card-view__card {
          margin-top: 10px;
        }

        .el-card__body {
          display: flex;
          align-items: center;
          padding: 5px 15px;

          .chart-card-view__icon {
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1;
            margin: 0 0 4px 8px;

            img {
              width: 30px;
              height: 30px;
            }
          }

          .chart-card-view__info {
            display: flex;
            flex-direction: column;
            text-align: right;
            color: $--color-white;
            z-index: 2;

            &.dark-text {
              color: $--color-text-primary;
            }

            .chart-card-view__label {
              font-size: 14px;
            }

            .chart-card-view__value {
              font-weight: bold;
              margin-top: 4px;
            }

            .el-progress {
              .el-progress__text {
                color: $--color-text-primary;
                font-size: 12px !important;
                font-weight: 600;
              }
            }

            .progress-label {
              width: 100%;
              display: flex;
              justify-content: center;

              position: absolute;
              bottom: 0;
              left: 0;

              text-transform: uppercase;
              font-size: 12px;
              font-weight: 600;
              color: $--color-text-primary;
            }
          }
        }
      }
    }
  }
}

/*
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
*/
</style>

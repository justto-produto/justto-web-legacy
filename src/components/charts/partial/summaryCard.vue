<template>
  <el-card
    :id="dataset.label"
    :style="`background: ${dataset.color};`"
    class="chart-card-view__card"
    :class="{'center': dataset.isGraph}"
  >
    <div
      v-if="!dataset.isGraph"
      :class="'chart-card-view__icon ' + dataset.label"
    >
      <i :class="dataset.icon" />
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
      <div v-else>
        <el-progress
          type="circle"
          :percentage="dataset.data[0]"
        />
      </div>
    </el-tooltip>
  </el-card>
</template>

<script>
export default {
  props: {
    dataset: {
      type: Object,
      required: true
    }
  }
}
</script>

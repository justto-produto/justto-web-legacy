<template>
  <el-card
    :class="{
      'jus-financial-card--highlighted': highlighted,
    }"
    shadow="hover"
    class="jus-financial-card">
    <div class="jus-financial-card__actions">
      <el-tooltip
        v-for="(action, index) in actions"
        :content="action.label"
        :key="index">
        <jus-icon
          :icon="action.icon"
          class="jus-financial-card__icon"
          @click.native="emitAction(action.trigger)"
        />
      </el-tooltip>
    </div>

    <span class="jus-financial-card__title">
      {{ cardTitle | capitalize }}
    </span>

    <span class="jus-financial-card__cash">
      {{ data.revenue | currency }}
    </span>
  </el-card>
</template>

<script>
export default {
  name: 'JusFinancialCard',
  props: {
    data: {
      type: Object,
      required: true,
    },
    actions: {
      type: Array,
      default: null,
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cardTitle() {
      const total = this.data.total
      const computedTotal = total >= 0 ? `: ${+total}` : ''
      const title = this.$t(`billing.${this.data.title}`)

      return title + computedTotal
    },
  },
  methods: {
    emitAction(trigger) {
      this.$emit('cardAction', {
        eventName: 'JusFinancialCard',
        eventProps: {
          trigger,
          customProps: this.data,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.jus-financial-card {
  color: $--color-text-primary;
  text-align: center;

  &:hover {
    .jus-financial-card__actions {
      align-items: center;
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(auto-fit, 16px);
      justify-content: end;
      padding: 0 10px;
      position: absolute;
      right: 0;
      top: 10px;
      width: 100%;

      .jus-financial-card__icon {
        cursor: pointer;
        width: 100%;
      }
    }
  }

  &.jus-financial-card--highlighted {
    background-color: $--color-primary-light-9
  }

  .jus-financial-card__actions {
    display: none;
  }

  .jus-financial-card__title {
    font-size: 16px;
    font-weight: 700;
  }

  .jus-financial-card__cash {
    color: $--color-primary-light-3;
    font-size: 32px;
    font-weight: 700;
  }
}
</style>

<style lang="scss">
.jus-financial-card {
  & > .el-card__body {
    align-content: center;
    display: grid;
    gap: 8px;
    grid-template-rows: repeat(2, auto);
    height: 100%;
    padding: 24px;
    position: relative;
  }
}
</style>

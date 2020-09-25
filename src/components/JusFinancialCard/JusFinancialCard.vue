<template>
  <el-card
    :class="{
      'jus-financial-card--highlighted': highlighted,
    }"
    shadow="hover"
    class="jus-financial-card"
  >
    <div class="jus-financial-card__actions">
      <el-tooltip
        v-for="(action, index) in actions"
        :key="index"
        :content="action.label"
      >
        <jus-icon
          v-if="action.visible"
          :icon="action.icon"
          class="jus-financial-card__icon"
          @click.native="emitAction(action.trigger)"
        />
      </el-tooltip>
    </div>

    <span class="jus-financial-card__title">
      {{ cardTitle | capitalize }}
    </span>

    <div class="jus-financial-card__cash">
      <span>{{ data.revenue | currency }}</span>
      <span
        v-if="data.archived"
        class="jus-financial-card__alerts"
      >
        <el-tooltip :content="totalArchivedTooltip">
          <span class="jus-financial-card__span">
            {{ totalArchived }}
          </span>
        </el-tooltip>
      </span>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'JusFinancialCard',
  props: {
    data: {
      type: Object,
      required: true
    },
    actions: {
      type: Array,
      default: null
    },
    highlighted: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cardTitle() {
      const total = this.data.total
      const computedTotal = total >= 0 ? `: ${+total}` : ''
      const title = this.data.title

      return title + computedTotal
    },

    totalArchivedTooltip() {
      return `${this.data.archived.total} disputa${this.isPlural} exluída${this.isPlural} correspondente${this.isPlural} a ${this.archivedRevenue}`
    },

    totalArchived() {
      return `${this.data.archived.total} disputa${this.isPlural} excluída${this.isPlural} (${this.archivedRevenue})`
    },

    archivedRevenue() {
      return this.$options.filters.currency(this.data.archived.revenue)
    },

    isPlural() {
      return this.data.archived.total > 1 ? 's' : ''
    }
  },
  methods: {
    emitAction(trigger) {
      this.$emit('cardAction', {
        eventName: 'JusFinancialCard',
        eventProps: {
          trigger,
          customProps: this.data
        }
      })
    }
  }
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
    font-size: 28px;
    font-weight: 700;
    display: flex;
    flex-direction: column;

    .jus-financial-card__alerts {
      line-height: 0;
      margin-top: 4px;

      .jus-financial-card__span {
        color: $--color-text-primary;
        font-size: 12px;
        font-style: italic;
        font-weight: normal;
      }

      .jus-financial-card__icon {
        margin-right: 2px;
      }
    }
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
    padding: 32px 24px;
    position: relative;
  }
}
</style>

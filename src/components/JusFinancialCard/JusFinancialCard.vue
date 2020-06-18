<template>
  <el-card
    shadow="hover"
    class="jus-financial-card"
  >
    <div class="jus-financial-card__actions">
      <el-tooltip
        v-for="(action, index) in actions"
        :content="action.label"
        :key="index"
        @click.native="action.handler"
      >
        <jus-icon
          :icon="action.icon"
          class="jus-financial-card__icon"
        />
      </el-tooltip>
    </div>

    <span class="jus-financial-card__title">
      {{ title }}
    </span>

    <span class="jus-financial-card__cash">
      R$ {{ value }}
    </span>
  </el-card>
</template>

<script>
export default {
  name: 'JusFinancialCard',
  props: {
    actions: {
      type: Array,
      default: null,
    },
    title: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '00,00',
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
      padding: 0 8px;
      position: absolute;
      right: 0;
      top: 8px;
      width: 100%;

      .jus-financial-card__icon {
        cursor: pointer;
        width: 100%;
      }
    }
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
    display: grid;
    gap: 8px;
    grid-template-rows: repeat(2, auto);
    padding: 24px;
    position: relative;
  }
}
</style>

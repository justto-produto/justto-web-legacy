<template>
  <el-card class="strategy-card">
    <div class="strategy-card__icon-area">
      <i
        :class="{
          [`el-icon-${strategyData.isPrivate ? 'lock' : 'unlock'}`]: true
      }"/>
    </div>

    <div class="strategy-card__name-area">
      <jus-text-editable
        :value="strategyData.name"
        type="title"
        @hasEdition="changeEstrategyData($event, 'name')"
      />
    </div>
    <div class="strategy-card__workspaces-area">
      <jus-tag-container
        :tag-list="strategyData.workspaces"
        title="Times"
        @change="changeEstrategyData($event, 'workspaces')"
      />
    </div>
    <div class="strategy-card__messages-area"/>
    <div class="strategy-card__strategies-area"/>
  </el-card>
</template>

<script>
import { JusTagContainer } from '@/components/JusTagContainer'
import { JusTextEditable } from '@/components/JusTextEditable'

export default {
  name: 'PanelStrategy',
  components: {
    JusTagContainer,
    JusTextEditable,
  },
  props: {
    strategy: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      strategyData: this.strategy,
    }
  },
  methods: {
    changeEstrategyData(val, key) {
      this.strategyData[key] = val
      this.$emit('changeEstrategyData', this.strategyData)
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.panel-strategy {
  padding: 40px;

  .strategy-card {
    &:hover {
      border: 1px solid $--color-primary;
      color: $--color-primary;
    }

    & > .el-card__body {
      display: grid;
      grid-template-areas:
        'icon-area name-area name-area name-area'
        'icon-area workspaces-area messages-area strategies-area';
      grid-template-columns: 32px repeat(3, 1fr);
      grid-template-rows: repeat(2, minmax(40px, auto));
      gap: 16px;

      .strategy-card__icon-area {
        grid-area: icon-area;

        & > i {
          font-size: 32px;
        }
      }

      .strategy-card__name-area {
        grid-area: name-area;
      }

      .strategy-card__workspaces-area {
        grid-area: workspaces-area;
      }

      .strategy-card__messages-area {
        grid-area: messages-area;
        background: gold;
      }

      .strategy-card__strategies-area {
        grid-area: strategies-area;
        background: aquamarine;
      }
    }
  }
}
</style>

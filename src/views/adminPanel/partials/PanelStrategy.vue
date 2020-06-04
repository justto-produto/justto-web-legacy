<template lang="html">
  <div class="panel-strategy">
    <el-card class="panel-strategy-card">
      <div class="panel-strategy-card__icon-area"/>
      <div class="panel-strategy-card__name-area"/>
      <div class="panel-strategy-card__workspaces-area"/>
      <div class="panel-strategy-card__messages-area"/>
      <div class="panel-strategy-card__strategies-area"/>
    </el-card>
  </div>
</template>

<script>
import { VueNestable, VueNestableHandle } from 'vue-nestable'

export default {
  name: 'PanelStrategy',
  components: {
    VueNestable,
    VueNestableHandle,
  },
}
</script>

<style lang="scss">
@import '@/styles/nestable.scss';

.panel-strategy {
  padding: 40px;

  .panel-strategy-card {
    & > .el-card__body {
      display: grid;
      grid-template-areas:
        'icon-area name-area name-area name-area'
        'icon-area workspaces-area messages-area strategies-area';
      grid-template-columns: 32px repeat(3, 1fr);
      grid-template-rows: repeat(2, minmax(40px, auto));
      gap: 16px;

      .panel-strategy-card__icon-area {
        grid-area: icon-area;
        background: aqua;
      }

      .panel-strategy-card__name-area {
        grid-area: name-area;
        background: tomato;
      }

      .panel-strategy-card__workspaces-area {
        grid-area: workspaces-area;
        background: slateblue;
      }

      .panel-strategy-card__messages-area {
        grid-area: messages-area;
        background: gold;
      }

      .panel-strategy-card__strategies-area {
        grid-area: strategies-area;
        background: aquamarine;
      }
    }
  }
}
</style>

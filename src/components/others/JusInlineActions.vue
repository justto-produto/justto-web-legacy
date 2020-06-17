<template>
  <div class="inline-actions">>
    <div
      v-for="action in actions"
      :key="action.name">
      <el-tooltip
        v-if="true"
        :content="action.label">
        <el-button
          type="text"
          @click="emmitAction(name)">
          <jus-icon :icon="action.icon"/>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JusInlineActions',
  props: {
    actions: {
      type: Array,
      required: true,
    },
    scope: {
      type: Object,
      required: true,
    }
  },
  computed: {

  },
  methods: {
    emitAction(action) {
      this.$emit('eventHandler', {
        action,
        scope: this.scope,
      })
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.inline-actions {
  padding: 11px 0px 11px 20px;
  box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.06);
  z-index: 1;
  .el-button {
    border-radius: 5px;
    padding: 11px;
    &.el-button--text {
      color: #424242;
      padding: 7px 10px 0;
      float: right;
      border-color: transparent !important;
      i {
        font-size: 26px;
      }
    }
  }
  .back {
    margin-right: 20px;
    vertical-align: text-top;
  }
  .el-button + span, span + .el-button {
    margin-left: 10px;
  }
}
</style>

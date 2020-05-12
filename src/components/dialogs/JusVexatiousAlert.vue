<template lang="html">
  <el-popover
    width="422"
    trigger="click"
    class="jus-vexatious-alert"
    popper-class="jus-vexatious-alert el-popover--dark">
    <div class="title">
      Advogado com disputas acima da média na plataforma
    </div>
    <div
      v-loading="true"
      v-if="true"
      element-loading-spinner="el-icon-loading"
      element-loading-text="Buscando detalhes..."
      element-loading-background="rgba(255, 255, 255, 0)"
      class="body">
      teste
    </div>
    <jus-icon v-if="visible" slot="reference" icon="alert-active" />
  </el-popover>
</template>

<script>
export default {
  name: 'JusVexatiousAlert',
  props: {
    visible: {
      default: true,
      type: Boolean
    }
  }
}
</script>

<style lang="scss">
.jus-vexatious-alert {
  margin: auto 0 auto auto;
  .title {
    font-weight: 600;
    font-size: 14px;
  }
  .body {
    margin-top: 20px;
    min-height: 60px;
  }
  .el-loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    i  {
      font-size: 15px;
      margin-right: 8px;
    }
  }
  .el-popover__reference {
    cursor: pointer;
  }
}
</style>

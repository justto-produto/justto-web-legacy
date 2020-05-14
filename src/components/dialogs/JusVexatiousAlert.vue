<template lang="html">
  <el-popover
    width="300"
    trigger="click"
    class="jus-vexatious-alert"
    popper-class="jus-vexatious-alert el-popover--dark"
    @show="fetchAlerts">
    <div class="title">
      Provável litigante
    </div>
    <div
      v-loading="true"
      element-loading-spinner="el-icon-loading"
      element-loading-text="Buscando detalhes..."
      class="body">
      Disputas acima da média na plataforma: <b>14</b>
      <br>
      Disputas acima da média nesta equipe: <b>6</b>
    </div>
    <jus-icon slot="reference" icon="alert-active" />
  </el-popover>
</template>

<script>
export default {
  name: 'JusVexatiousAlert',
  props: {
    documentNumber: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    fetchAlerts () {
      this.loading = true
      this.$store.dispatch('getDisputePartyAnalysis', this.documentNumber).finally(() => {
        this.loading = false
      })
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
    margin-top: 10px;
    min-height: 32px;
  }
  .el-loading-mask {
    background-color: rgb(52, 60, 75);
  }
  .el-loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -15px;
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

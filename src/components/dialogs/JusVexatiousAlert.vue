<template lang="html">
  <el-popover
    width="314"
    trigger="click"
    class="jus-vexatious-alert"
    popper-class="jus-vexatious-alert el-popover--dark"
    @show="fetchAlerts"
  >
    <div class="title">
      Muitas disputas envolvendo esta pessoa
    </div>
    <div
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="Buscando detalhes..."
      class="body"
    >
      <div v-if="alerts">
        {{ name | firstName }} possui <b>{{ Math.round(alerts.globalTotalValue) }}</b> disputas em nossa plataforma.
        <span v-if="alerts.globalTotalValue === alerts.workspaceTotalValue">
          Todas elas em sua equipe.
        </span>
        <span v-else>
          <b>{{ Math.round(alerts.workspaceTotalValue) }}</b> delas somente em sua equipe.
        </span>
      </div>
    </div>
    <jus-icon
      slot="reference"
      icon="alert-active"
    />
  </el-popover>
</template>

<script>
export default {
  name: 'JusVexatiousAlert',
  props: {
    documentNumber: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      alerts: {}
    }
  },
  methods: {
    fetchAlerts() {
      this.alerts = this.$store.getters.partyAnalysisByDocument(this.documentNumber)
      if (!this.alerts) {
        this.loading = true
        this.$store.dispatch('getDisputePartyAnalysis', this.documentNumber).then(() => {
          this.alerts = this.$store.getters.partyAnalysisByDocument(this.documentNumber)
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>

<style lang="scss">
.jus-vexatious-alert {
  margin-right: 8px;

  .title {
    font-weight: 600;
    font-size: 14px;
  }

  .body {
    word-break: break-word;
    margin-top: 6px;
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

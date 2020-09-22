<template>
  <div class="check-lines-step">
    <div class="new-import-view__title">
      <h2>Número de disputas</h2>
      <p>Verifique abaixo se sua planilha possui o número correto de disputas</p>
    </div>
    <el-card
      data-testid="import-checklines"
      class="el-card--dashed"
      shadow="never"
    >
      <h4>Disputas prontas para importação: {{ lines }}</h4>
      <el-collapse
        accordion
        class="el-collapse--bordered el-collapse--active"
      >
        <el-collapse-item name="1">
          <template slot="title">
            <strong>Sua planilha tinha mais linhas do que o número acima?</strong>
          </template>
          <div>
            Caso existam mais casos do que você tinha planejado, verifique se foi aplicado algum filtro na sua
            planilha. Clique em voltar, retire as linhas indesejadas e importe a planilha novamente.
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'CheckLinesStep',
  computed: {
    lines() {
      if (this.$store.state.importModule.file) {
        return this.$store.state.importModule.file.rows
      } else return 0
    }
  }
}
</script>

<style lang="scss">
.check-lines-step {
  h4 {
    margin-bottom: 30px;
  }
  .el-collapse-item__header {
    height: 100%;
    line-height: inherit;
    padding: 10px 0;
    font-size: 14px;
  }
  .el-collapse {
    width: 500px;
  }
  .el-collapse-item__arrow {
    line-height: 20px;
    margin: 0;
  }
  strong {
    width: 100%;
  }
}
</style>

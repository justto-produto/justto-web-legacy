<template>
  <div class="check-lines-step">
    <div class="new-import-view__title">
      <h2>Número de casos</h2>
      <p>
        Caso hajam mais casos do que você tinha planejado, verifique se foi aplicado algum filtro na sua planilha.
        Clique em voltar, retire as linhas indesejadas e importe a planilha novamente.
      </p>
    </div>
    <el-card class="el-card--dashed" shadow="never">
      <h4>Casos prontos para importação: {{ $store.state.importModule.file.rows }}</h4>
      <el-collapse accordion class="el-collapse--bordered el-collapse--active">
        <el-collapse-item name="1">
          <template slot="title">
            <strong>Sua planilha tinha mais linhas do que o número acima?</strong>
          </template>
          <div>
            Caso hajam mais casos do que você tinha planejado, verifique se foi aplicado algum filtro na sua
            planilha. Clique em voltar, retire as linhas indesejadas e importe a planilha novamente.
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'CheckLinesStep'
}
</script>

<style lang="scss">
.check-lines-step {
  h4 {
    margin-bottom: 30px;
  }
}
</style>

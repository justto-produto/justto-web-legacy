<template>
  <div class="check-lines-step">
    <h2>Número de casos</h2>
    <el-card class="el-card--dashed" shadow="never">
      <h4>Casos prontos para importação: 100</h4>
      <el-collapse accordion class="el-collapse--bordered">
        <el-collapse-item name="1">
          <template slot="title">
            Sua planilha tinha <strong>mais</strong> linhas do que o número acima?
          </template>
          <div>
            Caso hajam mais casos do que você tinha planejado, verifique se foi aplicado algum filtro na sua
            planilha. Clique em voltar, retire as linhas indesejadas e importe a planilha novamente.
          </div>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            Sua planilha tinha <strong>menos</strong> linhas do que o número acima?
          </template>
          <div>
            Verifique se foi aplicado algum filtro na sua planilha.
            Clique em voltar, retire as linhas indesejadas e importe a planilha novamente.
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
</style>

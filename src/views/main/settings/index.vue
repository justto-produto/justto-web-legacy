<template>
  <JusViewMain class="settings-container">
    <template slot="title">
      <h1>Configurações</h1>
    </template>
    <template slot="main"/>
    <!-- <template slot="main-right">
      <jus-icon icon="best-practices"/>
      <h3>
        Melhores práticas para importar casos
      </h3>
      <br>
      <p>Ao escolher uma opção para importação, certifique-se de que os dados estão inseridos corretamente. Dessa forma, o sistema irá reconhecer mais rapidamente os dados, e além disso, enriquecer com informações complementares colhidas diretamente do TJ.<br><br> Não se esqueça de preencher os dados mínimos da planilha <br><br> • Número do processo<br> • Empresa<br> • Alçadas da negociação <br> • Nome e CPF das partes
      </p>
    </template> -->
  </JusViewMain>
</template>

<script>
export default {
  name: 'Management'
}
</script>

<style lang="scss">
  .dashboard-container{
    margin: 10px 20px 20px;
  }
</style>

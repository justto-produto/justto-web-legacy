<template>
  <content-view>
    <template slot="content-title">
      <h1>Notificações</h1>
    </template>
    <template slot="content-left">
    </template>
    <!-- <template slot="content-right">
      <jus-icon icon="best-practices"/>
      <h3>
        Melhores práticas para importar casos
      </h3>
      <br>
      <p>Ao escolher uma opção para importação, certifique-se de que os dados estão inseridos corretamente. Dessa forma, o sistema irá reconhecer mais rapidamente os dados, e além disso, enriquecer com informações complementares colhidas diretamente do TJ.<br><br> Não se esqueça de preencher os dados mínimos da planilha <br><br> • Número do processo<br> • Empresa<br> • Alçadas da negociação <br> • Nome e CPF das partes
      </p>
    </template> -->
  </content-view>
</template>

<script>
import ContentView from '@/components/layouts/ContentView'

export default {
  name: 'Notifications',
  components: {
    ContentView
  }
}
</script>

<style lang="scss">
</style>

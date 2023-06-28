<template>
  <article class="config-view__container">
    <el-result
      v-for="(card, cIcon) in cards"
      :key="cIcon"
      :title="card.title"
      :sub-title="card.subTitle"
      class="config-view__card"
    >
      <JusIcon
        slot="icon"
        :icon="card.icon"
        size="48px"
      />
    </el-result>
  </article>
</template>

<script>
export default {
  name: 'ProjurisSoapConfigView',

  props: {
    fields: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    cards: [{
      title: 'Endereço',
      subTitle: 'Configurar URL de gerenciamento com o Projuris Empresa.',
      icon: 'power-plug'
    }, {
      title: 'Webhook',
      subTitle: 'Configurar chamadas webhook.',
      icon: 'webhook'
    }, {
      title: 'Políticas de inportação',
      subTitle: 'Configurar políticas de importação dos casos.',
      icon: 'garage'
    }]
  })
}
</script>

<style lang="scss">
.config-view__container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  .config-view__card {
    flex: 1;
    min-width: 56px;
    border: solid lightgray thin;
    padding: 0;
  }
}
</style>

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

      <el-button
        slot="extra"
        type="primary"
        size="mini"
        @click="card.callback"
      >
        Configurar
      </el-button>
    </el-result>

    <IntegrationWebhookConfig ref="webhook" />
    <IntegrationImportPolicyConfig ref="import" />
  </article>
</template>

<script>
export default {
  name: 'ProjurisSoapConfigView',

  components: {
    IntegrationWebhookConfig: () => import('./IntegrationWebhookConfig'),
    IntegrationImportPolicyConfig: () => import('./IntegrationImportPolicyConfig')
  },

  props: {
    fields: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      cards: [{
        title: 'Endereço',
        subTitle: 'Configurar URL de gerenciamento com o Projuris Empresa.',
        icon: 'power-plug',
        callback: this.handleResetField
      }, {
        title: 'Webhook',
        subTitle: 'Configurar chamadas webhook.',
        icon: 'webhook',
        callback: this.handleOpenWebhook
      }, {
        title: 'Políticas de importação',
        subTitle: 'Configurar políticas de importação dos casos.',
        icon: 'garage',
        callback: this.handleOpenImportPolicy
      }]
    }
  },

  methods: {
    handleResetField() {
      this.$emit('reset')
    },

    handleOpenWebhook() {
      this.$refs.webhook.open()
    },

    handleOpenImportPolicy() {
      this.$refs.import.open()
    }
  }

}
</script>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

.config-view__container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  .config-view__card {
    flex: 1;
    min-width: 136px;
    border: solid lightgray thin;
    padding: 8px;
    border-radius: 1rem;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>

<template>
  <header class="api-integration__container">
    <span class="api-integration__text">
      <span class="api-integration__text-title">{{ state.title }}</span>

      <span
        v-if="state.subtitle"
        class="api-integration__text-subtitle"
      >
        {{ state.subtitle }}
      </span>
    </span>

    <span />

    <JusIcon
      v-if="state.icon"
      :icon="state.icon"
      class="api-integration__icon"
    />
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      configurations: 'getApiIntegrationConfiguration',
      fields: 'getApiIntegrationFields'
    }),

    hasFields() {
      return this.fields?.FINCH_ACTIVE || this.fields?.PROJURIS_SOAP_ACTIVE || this.fields?.JUSTTO_WEBHOOK_ACTIVE
    },

    disable() {
      return (this.configurations?.properties || []).filter(({ key = '', value = '' }) => (key.includes('_ACTIVE') && value === String(true))).length > 0
    },

    state() {
      if (this.hasFields && !this.disable) {
        return {
          title: 'Assistente de configuração',
          subtitle: `Integração com ${this.integrationType} detectada`,
          icon: 'power-plug'
        }
      }

      if (this.disable && this.fields.FINCH_ACTIVE) return { title: 'Integração com a Finch' }

      if (this.disable && this.fields.JUSTTO_WEBHOOK_ACTIVE) return { title: 'Integração com padrão' }

      if (this.disable && this.fields.PROJURIS_SOAP_ACTIVE) return { title: 'Configurações de integração' }

      return { title: 'Nova integração' }
    },

    integrationType() {
      if (this.fields.FINCH_ACTIVE) return this.$tc('integration-types.FINCH')
      if (this.fields.JUSTTO_WEBHOOK_ACTIVE) return this.$tc('integration-types.JUSTTO_WEBHOOK')
      if (this.fields.PROJURIS_SOAP_ACTIVE) return this.$tc('integration-types.PROJURIS_SOAP')

      return ''
    }
  }
}
</script>

<style scoped>
.api-integration__container {
  display: flex;
  justify-content: space-between;
}

.api-integration__container .api-integration__text {
  display: flex;
  flex-direction: column;
}

.api-integration__container .api-integration__text .api-integration__text-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.api-integration__container .api-integration__text .api-integration__text-subtitle {
  font-size: 1rem;
  text-indent: 0.5rem;
}

.api-integration__container .api-integration__icon {
  height: 3.5rem;
}
</style>

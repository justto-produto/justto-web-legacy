<template>
  <article class="api-integration__container">
    <el-row class="api-integration__fields">
      <el-col
        v-for="field in fields"
        :key="field.key"
        :span="24"
        class="api-integration__field"
      >
        {{ field }}
      </el-col>
    </el-row>

    <InitialIntegrationForm @submit="handleInitIntegration" />
  </article>
</template>

<script>
export default {
  name: 'ApiIntegrationForm',

  components: {
    InitialIntegrationForm: () => import('./partials/InitialIntegrationForm')
  },

  data: () => ({
    fields: []
  }),

  methods: {
    handleVerifyIntegrationType(url) {
      const urlLowerCase = url.toLowerCase()
      const isProjurisSoapActive = urlLowerCase.includes('projuris')
      const isFinchActive = urlLowerCase.includes('finch')

      const type = isProjurisSoapActive ? 'PROJURIS_SOAP' : isFinchActive ? 'FINCH' : 'JUSTTO_WEBHOOK'

      // TODO: Confirmar se o tipo está correto.
      // TODO: Caso não esteja, perguntar qual o tipo correto.

      this.handleInitIntegration(url, type)
    },

    handleInitIntegration(url, type) {
      switch (type) {
        case 'PROJURIS_SOAP':
          this.handleInitProjurisIntegration(url)
          break
        case 'FINCH':
          this.initFinchIntegration(url)
          break
        default:
          this.initJusttoIntegration(url)
          break
      }
    },

    handleInitProjurisIntegration(url) {
      this.fields = {
        PROJURIS_SOAP_ACTIVE: true,
        PROJURIS_SOAP_PASSWORD: '',
        PROJURIS_SOAP_TOKEN: '',
        PROJURIS_SOAP_URL: url,
        PROJURIS_SOAP_USERNAME: ''
      }
    },

    initFinchIntegration(url) {
      this.fields = {
        FINCH_ACTIVE: true,
        FINCH_ENDPOINT: url,
        FINCH_USERNAME: '',
        FINCH_PASSWORD: ''
      }
    },

    initJusttoIntegration(url) {
      this.fields = {
        JUSTTO_WEBHOOK_ACTIVE: true,
        JUSTTO_WEBHOOK_ENDPOINT: url,
        JUSTTO_WEBHOOK_USERNAME: '',
        JUSTTO_WEBHOOK_PASSWORD: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

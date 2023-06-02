<template>
  <article class="api-integration__container">
    <el-row class="api-integration__fields">
      <el-col
        v-for="(fieldValue, fieldKey) in fields"
        v-show="!fieldKey.includes('_ACTIVE')"
        :key="fieldKey"
        :span="24"
        class="api-integration__field"
      >
        {{ fieldKey }} {{ fieldValue }}
      </el-col>
    </el-row>

    <InitialIntegrationForm
      v-if="!hasFields"
      @submit="handleVerifyIntegrationType"
    />

    <SelectIntegrationTypeDialog
      ref="selectTypeDialog"
    />
  </article>
</template>

<script>
export default {
  name: 'ApiIntegrationForm',

  components: {
    InitialIntegrationForm: () => import('./partials/InitialIntegrationForm'),
    SelectIntegrationTypeDialog: () => import('./partials/SelectIntegrationTypeDialog')
  },

  data: () => ({
    fields: {}
  }),

  computed: {
    hasFields() {
      return this.fields?.FINCH_ACTIVE || this.fields?.PROJURIS_SOAP_ACTIVE || this.fields?.JUSTTO_WEBHOOK_ACTIVE
    }
  },

  methods: {
    handleVerifyIntegrationType(url) {
      const urlLowerCase = url.toLowerCase()
      const isProjurisSoapActive = urlLowerCase.includes('projuris')
      const isFinchActive = urlLowerCase.includes('finch')
      const type = isProjurisSoapActive ? 'PROJURIS_SOAP' : isFinchActive ? 'FINCH' : 'JUSTTO_WEBHOOK'

      this.handleConfimDetectionType(type).then(_ => {
        this.handleInitIntegration({ url, type })
      }).catch(_ => {
        this.$refs.selectTypeDialog.open(this.handleSelectIntegrationType, { url, type })
      })
    },

    handleSelectIntegrationType({ url, action, type }) {
      switch (action) {
        case 'cancel':
          this.handleVerifyIntegrationType(url)
          break
        case 'select':
          this.handleInitIntegration({ url, type })
          break
        default:
          break
      }
    },

    handleConfimDetectionType(type) {
      return this.$confirm(`Esta é uma integração com ${this.$tc('integration-types.' + type)}?`, {
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
    },

    handleInitIntegration({ url, type }) {
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

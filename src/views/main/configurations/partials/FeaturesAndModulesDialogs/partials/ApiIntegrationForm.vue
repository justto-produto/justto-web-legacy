<template>
  <article
    v-loading="loading"
    class="api-integration__container"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      v-if="hasFields && (!disable || !useBFF)"
      :model="fields"
      class="api-integration__form"
      autocomplete="off"
    >
      <el-row class="api-integration__fields">
        <el-col
          v-for="(fieldValue, fieldKey) in fields"
          v-show="!fieldKey.includes('_ACTIVE')"
          :key="fieldKey"
          :span="24"
          class="api-integration__field"
        >
          <el-form-item :label="buildTitleByKey(fieldKey)">
            <el-input
              v-if="!fieldKey.includes('_ACTIVE')"
              v-model="fields[fieldKey]"
              :show-password="fieldKey.includes('_PASSWORD')"
              :disabled="disable || isNotEditable(fieldKey)"
              :prefix-icon="buildIconByKey(fieldKey)"
              autocomplete="off"
              auto-complete="off"
            >
              <el-button
                v-if="fieldKey.includes('_URL')"
                slot="append"
                type="transparent"
                icon="el-icon-delete"
                @click="handleReset"
              />
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        v-if="Object.keys(fields).length"
        class="actions"
      >
        <el-button @click="handleClose">
          Fechar
        </el-button>

        <el-button
          v-if="disable"
          type="secondary"
          @click="handleReset"
        >
          Editar
        </el-button>

        <el-button
          v-else
          type="primary"
          @click="handleSave"
        >
          Salvar
        </el-button>
      </el-form-item>
    </el-form>

    <FinchConfigView
      v-else-if="useBFF && disable && fields.FINCH_ACTIVE"
      :fields="fields"
    />

    <JusttoWebhookConfigView
      v-else-if="useBFF && disable && fields.JUSTTO_WEBHOOK_ACTIVE"
      :fields="fields"
    />

    <ProjurisSoapConfigView
      v-else-if="useBFF && disable && fields.PROJURIS_SOAP_ACTIVE"
      :fields="fields"
      @reset="handleReset"
    />

    <InitialIntegrationForm
      v-else
      @submit="handleVerifyIntegrationType"
      @cancel="handleClose"
    />

    <SelectIntegrationTypeDialog ref="selectTypeDialog" />
  </article>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ApiIntegrationForm',

  components: {
    InitialIntegrationForm: () => import('./partials/InitialIntegrationForm'),
    SelectIntegrationTypeDialog: () => import('./partials/SelectIntegrationTypeDialog'),
    FinchConfigView: () => import('./partials/FinchConfigView'),
    JusttoWebhookConfigView: () => import('./partials/JusttoWebhookConfigView'),
    ProjurisSoapConfigView: () => import('./partials/ProjurisSoapConfigView')
  },

  props: {
    feature: {
      required: true,
      type: Number
    }
  },

  data: () => ({ loading: false }),

  computed: {
    ...mapGetters({
      configurations: 'getIntegrationConfigsList',
      workspaceId: 'workspaceId',
      getFields: 'getIntegrationConfigs',
      useBFF: 'useIntegrationBff'
    }),

    fields: {
      get() { return this.getFields },
      set(value) {
        console.log('fields', value)
        this.setIntegrationConfigs(value)
      }
    },

    hasFields() {
      return this.fields?.FINCH_ACTIVE || this.fields?.PROJURIS_SOAP_ACTIVE || this.fields?.JUSTTO_WEBHOOK_ACTIVE
    },

    disable() {
      return (this.configurations || []).filter(({ key = '', value = '' }) => (key.includes('_ACTIVE') && value === String(true))).length > 0
    },

    isNotEditable() {
      return (field) => ['PROJURIS_SOAP_URL'].includes(field)
    }
  },

  watch: {
    hasFields(has) {
      if (has) {
        const form = document.querySelector('.el-form.api-integration__form')

        if (form) form.setAttribute('autocomplete', 'off')
      }
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    ...mapActions([
      'detectIntegration',
      'getFeatureProperties',
      'getIntegrationConfigs',
      'saveIntegrationConfigs',
      'setApiIntegrationConfiguration',
      'resetIntegrationConfigs'
    ]),

    ...mapMutations(['setIntegrationConfigs']),

    init() {
      const getKey = (options = [], search) => options.find(({ key }) => (key === search))?.value || ''

      const type = (this?.configurations || []).find(({ key = '', value = '' }) => (key.includes('_ACTIVE') && value === 'true'))?.key

      this.getIntegrationConfigs()
      switch (type) {
        case 'PROJURIS_SOAP_ACTIVE':
          this.handleInitProjurisIntegration({
            url: getKey(this.configurations, 'PROJURIS_SOAP_URL'),
            token: getKey(this.configurations, 'PROJURIS_SOAP_TOKEN'),
            password: '******',
            usename: getKey(this.configurations, 'PROJURIS_SOAP_USERNAME')
          })
          break
        case 'FINCH_ACTIVE':
          this.initFinchIntegration({
            url: getKey(this.configurations, 'FINCH_ENDPOINT'),
            password: '******',
            usename: getKey(this.configurations, 'FINCH_USERNAME')
          })
          break
        case 'JUSTTO_WEBHOOK_ACTIVE':
          this.initJusttoIntegration({
            url: getKey(this.configurations, 'JUSTTO_WEBHOOK_ENDPOINT'),
            password: '******',
            usename: getKey(this.configurations, 'JUSTTO_WEBHOOK_USERNAME')
          })
          break
        default:
          break
      }
    },

    handleVerifyIntegrationType(url) {
      this.detectIntegration(url).then(({ url, type }) => {
        this.handleInitIntegration({ url, type })
      }).catch(error => this.$jusNotification({ error }))
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

    handleInitIntegration({ url, type }) {
      switch (type) {
        case 'PROJURIS_SOAP':
          this.handleInitProjurisIntegration({ url })
          break
        case 'FINCH':
          this.initFinchIntegration({ url })
          break
        default:
          this.initJusttoIntegration({ url })
          break
      }
    },

    handleInitProjurisIntegration({ url, token = '' }) {
      this.fields = {
        PROJURIS_SOAP_ACTIVE: true,
        PROJURIS_SOAP_TOKEN: token,
        PROJURIS_SOAP_URL: url
      }
    },

    initFinchIntegration({ url, password = '', usename = '' }) {
      this.fields = {
        FINCH_ACTIVE: true,
        FINCH_ENDPOINT: url,
        FINCH_USERNAME: usename,
        FINCH_PASSWORD: password
      }
    },

    initJusttoIntegration({ url, password = '', usename = '' }) {
      this.fields = {
        JUSTTO_WEBHOOK_ACTIVE: true,
        JUSTTO_WEBHOOK_ENDPOINT: url,
        JUSTTO_WEBHOOK_USERNAME: usename,
        JUSTTO_WEBHOOK_PASSWORD: password
      }
    },

    buildIconByKey(key) {
      if (['JUSTTO_WEBHOOK_ENDPOINT', 'FINCH_ENDPOINT', 'PROJURIS_SOAP_URL'].includes(key)) {
        return 'el-icon-link'
      } else if (['JUSTTO_WEBHOOK_USERNAME', 'FINCH_USERNAME', 'PROJURIS_SOAP_USERNAME'].includes(key)) {
        return 'el-icon-user'
      } else if (['JUSTTO_WEBHOOK_PASSWORD', 'FINCH_PASSWORD', 'PROJURIS_SOAP_PASSWORD'].includes(key)) {
        return 'el-icon-lock'
      } else if (['PROJURIS_SOAP_TOKEN'].includes(key)) {
        return 'el-icon-connection'
      }

      return 'el-icon-open'
    },

    buildTitleByKey(key) {
      if (['JUSTTO_WEBHOOK_ENDPOINT', 'FINCH_ENDPOINT', 'PROJURIS_SOAP_URL'].includes(key)) {
        return 'Endereço configurado'
      } else if (['JUSTTO_WEBHOOK_USERNAME', 'FINCH_USERNAME', 'PROJURIS_SOAP_USERNAME'].includes(key)) {
        return 'USERNAME'
      } else if (['JUSTTO_WEBHOOK_PASSWORD', 'FINCH_PASSWORD', 'PROJURIS_SOAP_PASSWORD'].includes(key)) {
        return 'PASSWORD'
      } else if (['PROJURIS_SOAP_TOKEN'].includes(key)) {
        return 'Forneça o token de acesso para prosseguir'
      }

      return key
    },

    handleClose() {
      this.$emit('close')
    },

    handleReset() {
      this.$confirm('Deseja realmente reiniciar a configuração?', {
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.loading = true

        this.resetIntegrationConfigs().then(() => {
          this.$jusNotification({
            type: 'success',
            title: 'Yay!',
            message: 'Resetado com sucesso!'
          })

          this.fields = {}

          this.$nextTick().then(this.handleRefresh)
        }).catch(error => this.$jusNotification({
          error
        })).finally(() => { this.loading = false })
      })
    },

    handleSave() {
      this.loading = true

      const fields = Object.keys(this.fields).reduce((payload, key) => {
        if (this.fields[key] !== '******') payload[key] = String(this.fields[key])

        return payload
      }, {})
      this.saveIntegrationConfigs({ ...fields }).then(() => {
        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: 'Salvo com sucesso!'
        })

        this.fields = {}

        this.$nextTick().then(this.handleRefresh)
      }).catch(error => this.$jusNotification({
        error
      })).finally(() => { this.loading = false })
    },

    handleRefresh() {
      this.getIntegrationConfigs().then(this.init).catch(error => this.$jusNotification({
        error
      })).finally(() => { this.loading = false })
    }
  }
}
</script>

<style lang="scss">
.api-integration__container {
  .api-integration__fields {
    display: flex;
    flex-direction: column;
    gap: 8px;
    .api-integration__field {
      .el-form-item {
        margin: 0;

        .el-form-item__label {
          line-height: unset;

          &::after { content: ':'; }
        }

        .el-form-item__content {
          line-height: unset;
        }
      }
    }
  }

  .api-integration__form .actions .el-form-item__content:last-child {
      display: flex;
      justify-content: flex-end;
      gap: 8px;

      &:after, &:before {
        display: none;
      }

      .el-button {
        margin: 0;
      }
  }
}
</style>

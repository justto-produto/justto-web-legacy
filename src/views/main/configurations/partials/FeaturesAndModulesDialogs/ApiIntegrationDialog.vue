<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="apiIntegrationDialogVisible"
    append-to-body
    title="Envio de alterações nas disputas"
    width="40%"
    class="api-integration"
    destroy-on-close
  >
    <div class="api-integration__standart">
      <strong class="api-integration__standart-label">Enviar para meu sistema usando Webhook padrão</strong>
      <div>
        <el-form
          ref="formStandartWebhook"
          :model="formStandartWebhook"
          :rules="formStandartWebhookRules"
          :disabled="modalLoading"
          label-position="top"
          class="api-integration__standart-container"
        >
          <el-checkbox
            v-model="activeStandartWebhook"
            class="api-integration__standart-container-checkbox"
            @change="clearValidationDeactivateApi($event, 'formStandartWebhook')"
          />
          <el-form-item
            class="api-integration__standart-container-input"
            prop="urlStandartWebhook"
          >
            <el-input
              v-model="formStandartWebhook.urlStandartWebhook"
              :disabled="!activeStandartWebhook"
              placeholder="https://seudominioaqui.com/here"
            >
              <template slot="prepend">
                URL
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="api-integration__standart">
      <strong class="api-integration__standart-label">Webservice Finch para cadastro de FollowUp no Deal</strong>
      <el-form
        ref="formWebServiceFinch"
        :model="formWebServiceFinch"
        :rules="formWebServiceFinchRules"
        :disabled="modalLoading"
        label-position="top"
      >
        <div
          class="api-integration__standart-container"
        >
          <el-checkbox
            v-model="activeWebServiceFinch"
            class="api-integration__standart-container-checkbox"
            @change="clearValidationDeactivateApi($event, 'formWebServiceFinch')"
          />
          <el-form-item
            class="api-integration__standart-container-input"
            prop="urlWebServiceFinch"
          >
            <el-input
              v-model="formWebServiceFinch.urlWebServiceFinch"
              :disabled="!activeWebServiceFinch"
              placeholder="http://api.processos.finch/followUp"
            >
              <template slot="prepend">
                URL
              </template>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item
          class="api-integration__standart-container-input-login"
          prop="userWebServiceFinch"
        >
          <el-input
            v-model="formWebServiceFinch.userWebServiceFinch"
            placeholder="Usuário"
            :disabled="!activeWebServiceFinch"
          >
            <template slot="prepend">
              <i class="el-icon-user-solid" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          class="api-integration__standart-container-input-login"
          prop="passwordWebServiceFinch"
        >
          <el-input
            v-model="formWebServiceFinch.passwordWebServiceFinch"
            :disabled="!activeWebServiceFinch"
            placeholder="Senha"
          >
            <template slot="prepend">
              <i class="el-icon-lock" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="api-integration__search">
      <strong class="api-integration__search-title">Teste a integração</strong>
      <span class="api-integration__search-subtitle">É necessário salvar as configurações antes</span>
      <el-autocomplete
        ref="searchInput"
        v-model="searchTerm"
        :min="3"
        :trigger-on-focus="false"
        :fetch-suggestions="handleInput"
        :debounce="800"
        size="small"
        class="api-integration__search-input"
        prefix-icon="el-icon-search"
        popper-class="api-integration__search-popover"
        placeholder="Busque sua disputa..."
        :disabled="!(activeStandartWebhook || activeWebServiceFinch)"
      >
        <template v-slot="{ item }">
          <JusDisputeResume
            v-if="item.id"
            :dispute="item"
            @click="testIntegration"
          />
          <span v-else>
            Não foram encontradas disputas para esta busca.
          </span>
        </template>
      </el-autocomplete>
    </div>
    <div class="api-integration__footer">
      <el-button
        plain
        type="primary"
        @click="apiIntegrationDialogVisible = false"
      >
        Cancelar
      </el-button>
      <el-button
        type="primary"
        @click.prevent="handleSaveApiIntegration"
      >
        Salvar
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ApiConfiguration from '@/models/configurations/ApiConfiguration'
export default {
  name: 'ApiIntegrationDialog',

  components: {
    JusDisputeResume: () => import('@/components/layouts/JusDisputeResume')
  },

  props: {
    feature: {
      required: true,
      type: Number
    }
  },

  data: () => ({
    workspaceId: null,
    searchTerm: '',
    apiIntegrationDialogVisible: false,
    modalLoading: false,
    activeStandartWebhook: false,
    formStandartWebhook: {
      urlStandartWebhook: ''
    },
    formStandartWebhookRules: {
      urlStandartWebhook: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    },
    activeWebServiceFinch: false,
    formWebServiceFinch: {
      urlWebServiceFinch: '',
      userWebServiceFinch: '',
      passwordWebServiceFinch: ''
    },
    formWebServiceFinchRules: {
      urlWebServiceFinch: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      userWebServiceFinch: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      passwordWebServiceFinch: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    }
  }),

  computed: {
    ...mapGetters({
      apiIntegrationConfiguration: 'getApiIntegrationConfiguration'
    })
  },

  beforeMount() {
    this.getPrescriptions()
  },

  mounted() {
    this.getApiIntegrationConfiguration(this.feature)
      .then((data) => {
        if (data) {
          this.workspaceId = data.workspaceId
          const obj = {
            workspaceId: this.workspaceId
          }
          data.properties.forEach(({ key, value }) => {
            obj[key] = value
          })
          this.activeStandartWebhook = obj.JUSTTO_ACTIVE ? obj.JUSTTO_ACTIVE : false
          this.activeWebServiceFinch = obj.FINCH_ACTIVE ? obj.FINCH_ACTIVE : false
          this.activeStandartWebhook = this.activeStandartWebhook === 'true'
          this.activeWebServiceFinch = this.activeWebServiceFinch === 'true'
          this.formStandartWebhook.urlStandartWebhook = obj.JUSTTO_ENDPOINT || ''
          this.formWebServiceFinch.urlWebServiceFinch = obj.FINCH_ENDPOINT || ''
          this.formWebServiceFinch.userWebServiceFinch = obj.FINCH_USERNAME || ''
          this.formWebServiceFinch.passwordWebServiceFinch = obj.FINCH_PASSWORD || ''
        }
      })
  },

  methods: {
    ...mapActions({
      getApiIntegrationConfiguration: 'getApiIntegrationConfiguration',
      setApiIntegrationConfiguration: 'setApiIntegrationConfiguration',
      testApiIntegration: 'testApiIntegration'
    }),

    ...mapActions([
      'searchDisputes',
      'getPrescriptions'
    ]),

    handleInput(term, cb) {
      if (term.trim().length) {
        clearTimeout(this.debounce)

        this.debounce = setTimeout(() => {
          this.searchDisputes({ key: 'term', value: term.trim() })
            .then(response => {
              this.$jusSegment('Busca global de disputas', { description: `Termo utilizado: ${term}` })
              if (response.length) cb(response)
              else cb([{}])
            })
        }, 800)
      } else {
        cb([{}])
      }
    },

    testIntegration({ disputeId }) {
      this.testApiIntegration(disputeId)
        .then(() => {
          this.$jusNotification({
            type: 'success',
            title: 'Yay!',
            message: 'Integração testada com sucesso'
          })
        }).catch(() => {
          this.$jusNotification({
            type: 'error',
            title: 'Ops!',
            message: 'Ocorreu algum erro durante a integração!'
          })
        })
    },

    handleSaveApiIntegration() {
      Promise.all([
        this.activeStandartWebhook ? this.validateForm('formStandartWebhook') : () => {},
        this.activeWebServiceFinch ? this.validateForm('formWebServiceFinch') : () => {}
      ]).then(() => {
        const payload = new ApiConfiguration({
          FINCH_ENDPOINT: this.formWebServiceFinch.urlWebServiceFinch,
          FINCH_ACTIVE: this.activeWebServiceFinch.toString(),
          FINCH_USERNAME: this.formWebServiceFinch.userWebServiceFinch,
          FINCH_PASSWORD: this.formWebServiceFinch.passwordWebServiceFinch,
          JUSTTO_ENDPOINT: this.formStandartWebhook.urlStandartWebhook,
          JUSTTO_ACTIVE: this.activeStandartWebhook.toString(),
          workspaceId: this.workspaceId
        })
        this.setApiIntegrationConfiguration({ payload, featureId: this.feature })
          .then(() => {
            this.$jusNotification({
              type: 'success',
              title: 'Yay!',
              message: 'API de Integração salva com sucesso!'
            })
          })
          .catch(() => {
            this.$jusNotification({
              type: 'error',
              title: 'Ops!',
              message: 'Algo deu errado ao tentar salvar configurações!'
            })
          })
          .finally(() => {
            this.apiIntegrationDialogVisible = false
          })
      })
    },

    openFeatureDialog() {
      this.apiIntegrationDialogVisible = true
    },

    clearValidationDeactivateApi(value, ref) {
      if (!value) {
        this.$refs[ref].clearValidate()
      }
    },

    validateForm(ref) {
      return new Promise((resolve, reject) => {
        this.$refs[ref].validate(valid => {
          if (valid) resolve()
          else reject(new Error('Campos obrigatórios não preenchidos'))
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.api-integration {
  .api-integration__standart {
    display: flex;
    flex-direction: column;
    .api-integration__standart-label {
      margin-bottom: 10px;
    }

    .api-integration__standart-container {
      display: flex;
      flex-direction: row;
      gap: 16px;
      align-items: center;
      margin-bottom: 24px;

      .api-integration__standart-container-checkbox {
        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: $--color-success;
          border: none;
        }

        .el-checkbox__input.is-focus .el-checkbox__inner {
          border-color: $--color-gray;
        }

        .el-checkbox__inner:hover {
          border-color: $--color-black;
        }

        .el-checkbox__inner {
          width: 30px;
          height: 30px;
          &::after {
            margin: 4px;
            width: 10px;
            height: 10px;
          }
        }
      }

      .api-integration__standart-container-input {
        flex: 1;
        margin: 0;
        .el-input-group__prepend {
          font-weight: 400;
          color: $--color-black;
        }
      }
    }
  }
  .api-integration__search {
    display: flex;
    flex-direction: column;
    .api-integration__search-subtitle {
      font-weight: 300;
      font-size: 13px;
      margin-bottom: 8px;
    }
    .api-integration__search-input {
      margin-bottom: 16px;
    }
  }
  .api-integration__footer {
    display: flex;
    justify-content: center;
  }
}
.api-integration__standart-container-input-login {
  flex: 1;
  margin-bottom: 28px;
  .el-input-group__prepend {
    font-weight: 400;
    color: $--color-black;
  }
}
</style>

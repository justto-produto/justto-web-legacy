<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="apiIntegrationDialogVisible"
    append-to-body
    title="Envio de alterações nas disputas"
    width="40%"
    class="api-integration"
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
              <template slot="prepend">URL</template>
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
              <template slot="prepend">URL</template>
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
        @click.prevent="saveProperties"
      >
        Salvar
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ApiIntegrationDialog',
  data: () => ({
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
  methods: {
    openFeatureDialog() {
      this.apiIntegrationDialogVisible = true
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
      margin-bottom: 20px;

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
  .api-integration__footer {
    display: flex;
    justify-content: center;
  }
}
.api-integration__standart-container-input-login {
  flex: 1;
  .el-input-group__prepend {
    font-weight: 400;
    color: $--color-black;
  }
}
</style>

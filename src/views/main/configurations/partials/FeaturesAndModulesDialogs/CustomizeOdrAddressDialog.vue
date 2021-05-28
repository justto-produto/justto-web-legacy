<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="configureCustomizationsDialogVisible"
    title="Customizar sua empresa ou escritório como ODR"
    append-to-body
    width="80%"
    custom-class="configure-customizations"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rulesCustomizations"
      :disabled="modalLoading"
      label-position="top"
      class="configure-customizations__form"
    >
      <div class="configure-customizations__form-header">
        <div class="configure-customizations__form-header-item">
          <el-form-item
            class="configure-customizations__form-header-item-input"
            prop="email"
          >
            <label
              class="configure-customizations__form-header-item-input-label"
            >
              Email para envio das mensagens
            </label>
            <el-tooltip
              placement="right"
              effect="dark"
              :open-delay="500"
            >
              <div slot="content">
                Esta é uma configuração que exige intervenção dos times <br> de tecnologia da JUSTTO e do escritório/empresa.
              </div>
              <i class="el-icon-info" />
            </el-tooltip>
            <el-input
              v-model="form.email"
              size="small"
            />
          </el-form-item>
        </div>

        <div class="configure-customizations__form-header-item">
          <el-form-item
            class="configure-customizations__form-header-item-input"
            prop="link"
          >
            <label
              class="configure-customizations__form-header-item-input-label"
            >
              Link para portal de negociações
            </label>
            <el-tooltip
              placement="right"
              effect="dark"
              :open-delay="500"
            >
              <div slot="content">
                Exige intervenção da equipe de tecnologia para <br> criar um novo endereço na internet com o certificado.
              </div>
              <i class="el-icon-info" />
            </el-tooltip>
            <el-input
              v-model="form.link"
              size="small"
            />
          </el-form-item>
        </div>
      </div>

      <el-form-item class="configure-customizations__form-ckeditor jus-ckeditor__parent">
        <ckeditor
          ref="footerEditor"
          v-model="form.emailFooter"
          :editor="editor"
          :config="editorConfig"
          type="classic"
        />
      </el-form-item>
    </el-form>

    <div class="configure-customizations__footer">
      <div class="configure-customizations__footer-actions">
        <el-button
          class="configure-customizations__footer-cancel"
          size="small"
          plain
          @click="closeFeatureDialog()"
        >
          Cancelar
        </el-button>
        <el-button
          v-loading="modalLoading"
          :disabled="modalLoading"
          class="configure-customizations__footer-confirm"
          type="success"
          size="small"
          @click.prevent="saveCustomizedConfigurations"
        >
          Salvar configuração
        </el-button>
      </div>

      <div class="configure-customizations__footer-info">
        <span class="configure-customizations__footer-info-span">
          Ao utilizar nossa plataforma você está ciente e concorda com nossa
          <a
            href="https://justto.com.br/poilitica-privacidade"
            target="_blank"
          >
            politica de privacidade
          </a>
          , nossos termos e condições de uso e está de acordo com nosso código de proteção de dados pessoais.
          Caso não queira mais receber mensagens da nossa plataforma descadastre seu email aqui.
        </span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import OdrCustomizationModel from '@/models/configurations/OdrCustomizationModel'
import ckeditor from '@/utils/mixins/ckeditor'

export default {
  name: 'ConfigureCustomizationsDialog',

  mixins: [ckeditor],

  data: () => ({
    configureCustomizationsDialogVisible: false,
    modalLoading: false,
    form: {
      email: '',
      link: '',
      emailFooter: '',
      emailFooterId: null
    },
    rulesCustomizations: {
      email: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      link: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      emailFooter: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    }
  }),

  computed: {
    ...mapGetters({
      properties: 'workspaceProperties',
      workspaceId: 'workspaceId'
    })
  },

  methods: {
    ...mapActions({
      getTemplate: 'getStrategyTemplate',
      editTemplate: 'editStrategyTemplate',
      editProperties: 'editWorkpaceProperties',
      createTemplate: 'createStrategyTemplate'
    }),

    saveCustomizedConfigurations() {
      this.modalLoading = true

      this.validateForm('form').then(() => {
        this.saveChanges()
      }).finally(() => {
        this.modalLoading = false
      })
    },

    validateForm(ref) {
      return new Promise((resolve, reject) => {
        this.$refs[ref].validate(valid => {
          if (valid) resolve()
          else reject(new Error('Campos obrigatórios não preenchidos'))
        })
      })
    },

    openFeatureDialog() {
      this.configureCustomizationsDialogVisible = true

      this.form = new OdrCustomizationModel(this.properties)

      this.searchTemplete()
    },

    closeFeatureDialog() {
      this.configureCustomizationsDialogVisible = false
      this.form.emailFooter = ''
    },

    searchTemplete() {
      this.getTemplate(this.form.emailFooterId).then(res => (this.form.emailFooterTemplate = res))
    },

    saveChanges() {
      const template = {
        id: this.form.saveNew ? null : this.form.emailFooterId,
        title: `footer-workspace-${this.workspaceId}`,
        body: this.form.emailFooter,
        contentType: 'HTML'
      }

      this.form.saveNew ? this.saveNewTemplate(template) : this.saveExistingTemplate(template)
    },

    saveNewTemplate(template) {
      this.createTemplate(template).then(({ id }) => {
        this.editProperties({
          DEAL_URL: this.form.link,
          CUSTOM_EMAIL_SENDER: this.form.email,
          FOOTER_EMAIL_TEMPLATE_ID: id
        }).then(() => {
          this.$jusNotification({
            type: 'success',
            title: 'Yay!',
            message: 'Configuração de ODR salva com sucesso'
          })
          this.closeFeatureDialog()
        }).catch(error => this.$jusNotification({ error }))
      }).catch(error => this.$jusNotification({ error }))
    },

    saveExistingTemplate(template) {
      this.editTemplate(template).then(() => {
        this.editProperties({
          DEAL_URL: this.form.link,
          CUSTOM_EMAIL_SENDER: this.form.email
        }).then(() => {
          this.$jusNotification({
            type: 'success',
            title: 'Yay!',
            message: 'Configuração de ODR salva com sucesso'
          })
          this.closeFeatureDialog()
        }).catch(error => this.$jusNotification({ error }))
      }).catch(error => this.$jusNotification({ error }))
    }
  }
}
</script>

<style lang="scss">
/* Configura tamanho do CKEditor */
.configure-customizations {
  .configure-customizations__form {
    .configure-customizations__form-ckeditor {
      .el-form-item__content {
        .ck-editor {
          height: 50vh;

          .ck-editor__main {
            height: 95%;

            .ck-content {
              height: 90%;

              p {
                margin: 0;
                padding: 0;

                line-height: 24px;
                font-size: 13px !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.configure-customizations {
  .configure-customizations__form {
    display: flex;
    flex-direction: column;

    .configure-customizations__form-header {
      display: flex;
      flex-direction: row;

      .configure-customizations__form-header-item {
        width: 50%;

        .configure-customizations__form-header-item-input {
          width: 70%;

          .configure-customizations__form-header-item-input-label {
            font-size: 12px;
          }

          i {
            color: $--color-primary;

            &:hover {
              cursor: pointer;
              color: $--color-primary-light-3;
            }
          }
        }
      }
    }
  }
  .configure-customizations__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    .configure-customizations__footer-info {
      width: 75%;

      .configure-customizations__footer-info-span {
        font-size: 10px;
        line-height: 10px;
      }
    }

    .configure-customizations__footer-actions {
      display: flex;
      gap: 16px;

      .configure-customizations__footer-confirm {
        .el-loading-mask {
          .el-loading-spinner .path {
            stroke: $--color-success;
          }
        }
      }
    }

  }
}
</style>

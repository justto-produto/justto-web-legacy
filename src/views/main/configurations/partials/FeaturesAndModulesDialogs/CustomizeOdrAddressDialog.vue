<template>
  <div>
    <el-dialog
      v-loading="modalLoading"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="configureCustomizationsDialogVisible"
      title="Customizar sua empresa ou escritório como ODR"
      append-to-body
      width="80%"
      custom-class="configure-customizations"
    >
      <el-tabs
        v-model="activeTab"
        type="border-card"
      >
        <el-tab-pane
          label="Email"
          name="email"
        >
          <el-form
            ref="form"
            :v-if="configureCustomizationsDialogVisible"
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
                  <label class="configure-customizations__form-header-item-input-label">
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
                    :disabled="!isJusttoAdmin"
                    size="small"
                  >
                    <template slot="append">
                      <el-popover
                        placement="top-end"
                        trigger="hover"
                        :open-delay="500"
                        :content="validTooltipText"
                        popper-class="valid-domain-popover"
                      >
                        <div slot="reference">
                          <span
                            v-if="haveDomain"
                            slot="reference"
                          >
                            <i :class="isValidDomain ? 'el-icon-check' : 'el-icon-close'" />
                          </span>
                        </div>
                      </el-popover>
                    </template>
                  </el-input>
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
                    disabled
                    size="small"
                  >
                    <template slot="append">
                      <el-popover
                        placement="top-end"
                        trigger="hover"
                        :open-delay="500"
                        :content="validTooltipDomainText"
                        popper-class="valid-domain-popover"
                      >
                        <div slot="reference">
                          <span
                            v-if="haveDomain"
                            slot="reference"
                          >
                            <i :class="isValidDomain ? 'el-icon-check' : 'el-icon-close'" />
                          </span>
                        </div>
                      </el-popover>
                    </template>
                  </el-input>
                </el-form-item>
              </div>
            </div>

            <div class="configure-customizations__form-body">
              <div class="configure-customizations__form-body-actions">
                <el-button
                  type="secondary"
                  icon="el-icon-s-promotion"
                  size="mini"
                  @click="handleSendByEmail"
                >
                  Enviar por e-mail
                </el-button>

                <el-button
                  type="primary"
                  size="mini"
                  @click="handleUpdateDomains"
                >
                  Verificar se os registros foram inseridos
                </el-button>
              </div>

              <el-table
                :data="dnsList"
                size="mini"
                class="configure-customizations__form-body-table"
                border
              >
                <el-table-column
                  fixed="left"
                  center
                  width="40"
                >
                  <template #default="props">
                    <el-button
                      type="text"
                      :class="{danger: !props.row.valid, success: props.row.valid}"
                      :icon="props.row.valid ? 'el-icon-check' : 'el-icon-close'"
                    />
                  </template>
                </el-table-column>

                <el-table-column
                  prop="type"
                  label="Type"
                >
                  <template #default="props">
                    {{ props.row.type | uppercase }}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="host"
                  label="Host"
                >
                  <template #default="props">
                    {{ props.row.host }}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="data"
                  label="Value"
                >
                  <template #default="props">
                    {{ props.row.data }}
                  </template>
                </el-table-column>

                <el-table-column
                  fixed="right"
                  center
                  width="40"
                >
                  <template #default="props">
                    <el-tooltip
                      content="Copiar"
                      :open-delay="500"
                    >
                      <el-button
                        type="text"
                        icon="el-icon-copy-document"
                        class="is-pointer"
                        @click="copyDns(props.row)"
                      />
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>

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
                  type="secondary"
                  size="small"
                  @click="handleResetEmail"
                >
                  Mudar o email da empresa
                </el-button>

                <el-button
                  v-loading="modalLoading"
                  :disabled="modalLoading || !isJusttoAdmin"
                  class="configure-customizations__footer-confirm"
                  type="primary"
                  size="small"
                  @click.prevent="saveCustomizedConfigurations"
                >
                  Salvar configuração
                </el-button>
              </div>
            </div>
          </el-form>
        </el-tab-pane>

        <el-tab-pane
          label="WhatsApp"
          name="whatsapp"
        >
          <el-form
            :model="whatsAppForm"
            :disabled="!haveAccess"
            class="configure-customizations__form"
          >
            <div class="configure-customizations__form-header">
              <div class="configure-customizations__form-header-item">
                <el-form-item
                  class="configure-customizations__form-header-item-input"
                  prop="CUSTOM_WHATSAPP_APP_NAME"
                >
                  <label class="configure-customizations__form-header-item-input-label">
                    Nome do aplicativo:
                  </label>

                  <el-tooltip
                    placement="right"
                    :open-delay="500"
                  >
                    <div slot="content">
                      Nome cadastrado no Gupshup.
                    </div>
                    <i class="el-icon-info" />
                  </el-tooltip>

                  <el-input
                    v-model="whatsAppForm.CUSTOM_WHATSAPP_APP_NAME"
                    size="small"
                  />
                </el-form-item>
              </div>

              <div class="configure-customizations__form-header-item">
                <el-form-item
                  class="configure-customizations__form-header-item-input"
                  prop="CUSTOM_WHATSAPP_NUMBER"
                >
                  <label class="configure-customizations__form-header-item-input-label">
                    Número de contato:
                  </label>

                  <el-input
                    v-model="whatsAppForm.CUSTOM_WHATSAPP_NUMBER"
                    v-mask="['55 (##) ####-####', '55 (##) #####-####']"
                    size="small"
                  />
                </el-form-item>
              </div>
            </div>

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
                  :disabled="modalLoading || !isJusttoAdmin"
                  class="configure-customizations__footer-confirm"
                  type="primary"
                  size="small"
                  @click.prevent="saveCustomizedWhatsApp"
                >
                  Salvar configuração
                </el-button>
              </div>
            </div>
          </el-form>
        </el-tab-pane>

        <el-tab-pane
          label="Discador"
          name="discador"
        >
          <el-form
            :model="dialerForm"
            :disabled="!haveAccess"
            class="configure-customizations__form"
          >
            <div class="configure-customizations__form-header">
              <div class="configure-customizations__form-header-item">
                <el-form-item
                  class="configure-customizations__form-header-item-input"
                  prop="WORKSPACE_DIALER_OWNER"
                >
                  <label class="configure-customizations__form-header-item-input-label">
                    Nome do discador:
                  </label>

                  <el-tooltip
                    placement="right"
                    :open-delay="500"
                  >
                    <div slot="content">
                      Nome cadastrado na Code7.
                    </div>
                    <i class="el-icon-info" />
                  </el-tooltip>

                  <el-input
                    v-model="dialerForm.WORKSPACE_DIALER_OWNER"
                    size="small"
                  />
                </el-form-item>
              </div>
            </div>

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
                  :disabled="modalLoading || !isJusttoAdmin"
                  class="configure-customizations__footer-confirm"
                  type="primary"
                  size="small"
                  @click.prevent="saveCustomizedDialer"
                >
                  Salvar configuração
                </el-button>
              </div>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="configure-customizations__footer">
        <div class="configure-customizations__footer-info">
          <span class="configure-customizations__footer-info-span">
            Ao utilizar nossa plataforma você está ciente e concorda com nossa
            <a
              href="https://justto.com.br/politica-privacidade"
              target="_blank"
              rel="noopener noreferrer"
            >
              politica de privacidade
            </a>
            , nossos termos e condições de uso e está de acordo com nosso código de proteção de dados pessoais.
            Caso não queira mais receber mensagens da nossa plataforma descadastre seu email aqui.
          </span>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-loading="modalLoading"
      :visible.sync="configureNewDomainDialogVisible"
      title="Configurar domíno do cliente"
      append-to-body
      :close-on-click-modal="false"
      width="75%"
      custom-class="new-domain"
      center
    >
      <el-form
        ref="newDomainForm"
        :model="newDomainForm"
        :rules="rulesNewDomainForm"
        :disabled="modalLoading"
        label-position="top"
        class="new-domain__form"
      >
        <div class="new-domain__form-about">
          <h4 class="new-domain__form-about-text">
            Para autorizar a JUSTTO a enviar emails usando sua conta, o administrador do domínio (o nome da internet que seu email utiliza) precisa autorizar explicitamente.
            <br>
            <br>
            Precisamos que seu administrador de domínio web cadastre as seguintes entradas no seu provedor:
          </h4>
        </div>

        <el-row>
          <el-col :span="24">
            <el-form-item
              class="new-domain__form-domain"
              prop="domain"
            >
              <label for="newDomainFormDomain">Domínio:</label>
              <el-input
                id="newDomainFormDomain"
                v-model="newDomainForm.domain"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span
        slot="footer"
        class="new-domain__footer"
      >
        <el-button @click="handleClearNewDomainDialog">
          Cancelar
        </el-button>

        <el-button
          type="primary"
          @click="handleSaveNewDomain"
        >
          Confirmar
        </el-button>
      </span>
    </el-dialog>

    <initOdrDomainDialog ref="initOdrDomainDialog" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import OdrCustomizationModel from '@/models/configurations/OdrCustomizationModel'
import ckeditor from '@/utils/mixins/ckeditor'

export default {
  name: 'ConfigureCustomizationsDialog',

  components: {
    initOdrDomainDialog: () => import('./partials/initOdrDomainDialog')
  },

  mixins: [ckeditor],

  data: () => ({
    configureCustomizationsDialogVisible: false,
    configureNewDomainDialogVisible: false,
    modalLoading: false,
    activeTab: 'email',
    form: {
      email: '',
      link: '',
      emailFooter: '',
      emailFooterId: null
    },

    whatsAppForm: {
      CUSTOM_WHATSAPP_APP_NAME: '',
      CUSTOM_WHATSAPP_NUMBER: ''
    },

    dialerForm: {
      WORKSPACE_DIALER_OWNER: ''
    },

    newDomainForm: {
      domain: '',
      mail_cname: '',
      dkim1: '',
      dkim2: ''
    },

    rulesCustomizations: {
      email: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      link: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      emailFooter: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    },

    rulesNewDomainForm: {
      domain: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    },
    currentDomain: null
  }),

  computed: {
    ...mapGetters({
      properties: 'workspaceProperties',
      isJusttoAdmin: 'isJusttoAdmin',
      workspaceId: 'workspaceId',
      accountEmail: 'accountEmail'
    }),

    haveDomain() {
      return this.form.email.endsWith(this.currentDomain?.domain)
    },

    isValidDomain() {
      return this.currentDomain?.valid
    },

    validTooltipText() {
      return `Este email está com o domínio ${this.isValidDomain ? 'válido' : 'inválido'}.`
    },

    validTooltipDomainText() {
      return `Este domínio está ${this.isValidDomain ? 'válido' : 'inválido'}.`
    },

    dnsList() {
      return this.currentDomain?.dns ? [
        this.currentDomain?.dns?.mail_cname,
        this.currentDomain?.dns?.dkim1,
        this.currentDomain?.dns?.dkim2
      ] : []
    },

    haveAccess() {
      return ['deivid@justto.com.br', 'lucas@justto.com.br'].includes(this.accountEmail)
    }
  },

  methods: {
    ...mapActions({
      getTemplate: 'getStrategyTemplate',
      editTemplate: 'editStrategyTemplate',
      editProperties: 'editWorkpaceProperties',
      createTemplate: 'createStrategyTemplate',
      getDomains: 'getSendgridDomains',
      getWorkspace: 'getWorkspace',
      ceateDomain: 'setSendgridDomains',
      sendDnsEmail: 'sendDnsEmail'
    }),

    saveCustomizedConfigurations() {
      this.modalLoading = true

      this.validateForm('form').then(() => {
        this.saveChanges()
      }).finally(() => {
        this.modalLoading = false
      })
    },

    saveCustomizedWhatsApp() {
      this.modalLoading = true

      this.editProperties({
        ...this.whatsAppForm,
        CUSTOM_WHATSAPP_NUMBER: this.whatsAppForm.CUSTOM_WHATSAPP_NUMBER.replace(/\D/g, '')
      }).then(() => this.$jusNotification({
        title: 'Yay!',
        message: 'Configurações salvas com sucesso',
        type: 'success'
      })).catch(error => this.$jusNotification({ error })).finally(this.closeFeatureDialog)
    },

    saveCustomizedDialer() {
      this.modalLoading = true

      this.editProperties({
        ...this.dialerForm,
        WORKSPACE_DIALER_OWNER: this.dialerForm.WORKSPACE_DIALER_OWNER
      }).then(() => this.$jusNotification({
        title: 'Yay!',
        message: 'Configurações salvas com sucesso',
        type: 'success'
      })).catch(error => this.$jusNotification({ error })).finally(this.closeFeatureDialog)
    },

    validateForm(ref) {
      return new Promise((resolve, reject) => {
        this.$refs[ref].validate(valid => {
          if (valid) resolve()
          else reject(new Error('Campos obrigatórios não preenchidos'))
        })
      })
    },

    handleValidateDomain(subdomain) {
      return new Promise((resolve, reject) => {
        this.getDomains().then(domains => {
          const domain = domains.find(({ domain }) => (domain.includes(subdomain)))

          resolve(domain)
        }).catch(error => {
          this.$jusNotification({ error })
          reject(error)
        })
      })
    },

    async handleInitDialog(previousDomain = null) {
      const fallback = () => this.handleInitializedDialog(false)

      // Ver se o email existe
      if (this.properties?.CUSTOM_EMAIL_SENDER || previousDomain) {
        // Se não existir
        const domain = (this.properties?.CUSTOM_EMAIL_SENDER || previousDomain).split('@')[1]

        this.currentDomain = await this.handleValidateDomain(domain)

        this.getWorkspace().then(() => {
          this.handleInitializedDialog(Boolean(this.currentDomain))
        }).catch(fallback)
      } else { // Se não existir
        this.$refs.initOdrDomainDialog.open(({
          email,
          customPath,
          enableCustomPath,
          customDkim,
          enableCustomDkim
        }) => {
          this.form.email = email

          if (enableCustomPath) {
            this.newDomainForm.subdomain = customPath
          }

          if (enableCustomDkim) {
            this.newDomainForm.custom_dkim_selector = customDkim
          }

          this.handleValidateDomain(email.split('@')[1]).then(domain => {
            this.currentDomain = domain

            this.getWorkspace().then(() => {
              this.handleInitializedDialog(Boolean(this.currentDomain))
            }).catch(fallback)
          }).catch(fallback)
        }, fallback)
      }
    },

    openFeatureDialog() {
      this.handleInitDialog(this.form.email)
    },

    handleInitializedDialog(openCustomizationDialog) {
      if (openCustomizationDialog) {
        this.configureCustomizationsDialogVisible = true
        this.form = new OdrCustomizationModel({
          ...this.properties,
          CUSTOM_EMAIL_SENDER: (this.form.email || this.properties.CUSTOM_EMAIL_SENDER)
        })

        this.resetWhatsAppFormInfo()
        this.resetDialerFormInfo()

        this.searchTemplete()
      } else {
        this.newDomainForm.domain = this.form.email.split('@')[1]
        this.configureNewDomainDialogVisible = true
      }
    },

    resetWhatsAppFormInfo() {
      this.whatsAppForm = {
        CUSTOM_WHATSAPP_APP_NAME: this.properties.CUSTOM_WHATSAPP_APP_NAME || '',
        CUSTOM_WHATSAPP_NUMBER: this.properties.CUSTOM_WHATSAPP_NUMBER || ''
      }
    },

    resetDialerFormInfo() {
      this.dialerForm = {
        WORKSPACE_DIALER_OWNER: this.properties.WORKSPACE_DIALER_OWNER || ''
      }
    },

    handleUpdateDomains() {
      this.modalLoading = true

      this.handleValidateDomain((this.form.email).split('@')[1]).then(domain => {
        this.currentDomain = domain
      }).finally(() => {
        setTimeout(() => { this.modalLoading = false }, 1000)
      })
    },

    handleResetEmail() {
      this.modalLoading = true

      this.editProperties({ CUSTOM_EMAIL_SENDER: 'acordo@justto.app' }).then(() => {
        this.form.email = 'acordo@justto.app'
        this.openFeatureDialog()
      }).finally(() => { this.modalLoading = false })
    },

    closeFeatureDialog() {
      this.modalLoading = false
      this.configureCustomizationsDialogVisible = false
      this.form = { email: '', link: '', emailFooter: '', emailFooterId: null }
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
    },

    handleClearNewDomainDialog() {
      this.form = { email: '', link: '', emailFooter: '', emailFooterId: null }
      this.handleCloseNewDomainDialog()
    },

    handleCloseNewDomainDialog() {
      return new Promise(resolve => {
        this.configureNewDomainDialogVisible = false
        this.newDomainForm = { domain: '', mail_cname: '', dkim1: '', dkim2: '' }
        resolve()
      })
    },

    handleSaveNewDomain() {
      const domain = {
        domain: this.newDomainForm.domain,
        custom_dkim_selector: this.newDomainForm?.custom_dkim_selector,
        subdomain: this.newDomainForm?.subdomain,
        default: false
      }

      this.validateForm('newDomainForm').then(() => {
        this.modalLoading = true

        this.ceateDomain(domain).then(() => {
          this.handleCloseNewDomainDialog().then(this.openFeatureDialog)
        }).finally(() => { this.modalLoading = false })
      })
    },

    copyDns(dns) {
      navigator.clipboard.writeText(`${dns.host}\n${dns.data}`)

      this.$message({
        message: 'Copiado para a área de transferência.',
        type: 'info',
        center: true,
        showClose: true
      })
    },

    handleSendByEmail() {
      this.$prompt('Destinatário:', 'Enviar para', {
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: 'Email inválido'
      }).then(({ value }) => {
        this.sendDnsEmail({
          email: value,
          domain_id: this.currentDomain.id,
          message: 'Olá, estou tentando autenticar nosso domínio com o SendGrid, mas não consigo modificar nossos registros DNS. Você pode me ajudar a adicionar esses registros, para que eu possa concluir o processo?'
        }).then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Email enviado com sucesso.',
            type: 'success'
          })
        }).catch(error => this.$jusNotification({ error }))
      }).catch(() => {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Envio cancelado.',
          type: 'warning'
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

/* Configura tamanho do CKEditor */
.configure-customizations {
  .configure-customizations__form {
    .configure-customizations__form-ckeditor {
      margin-top: 24px;

      .el-form-item__content {
        .ck-editor {
          height: 25vh;

          .ck-editor__main {
            height: 90%;

            .ck-content {
              height: 85%;

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

    .configure-customizations__form-header {
      .configure-customizations__form-header-item {
        .configure-customizations__form-header-item-input {
          .el-form-item__content {
            .el-input-group--append {
              .el-input-group__append {
                background: transparent;
              }
            }
          }

          &.el-form-item {
            margin: 0 !important;
            width: 100% !important;
          }
        }

        &.flex-row {
          flex: 1;
          display: flex;
          gap: 8px;
          align-items: flex-end;
          justify-content: center;

          .configure-customizations__form-header-item-input {
            text-align: right;
          }
        }
      }
    }

    .configure-customizations__form-body {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .configure-customizations__form-body-actions {
        display: flex;
        justify-content: flex-end;
      }

      .configure-customizations__form-body-table {
        .el-table__fixed {
          .el-table__fixed-body-wrapper {
            .el-table__body {
              tbody {
                .el-table__row {
                  .el-table__cell {
                    .cell {
                      .el-button {
                        &.success {
                          color: $--color-success;
                        }

                        &.danger {
                          color: $--color-danger;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.new-domain {
  .el-dialog__body {
    .new-domain__form {
      .new-domain__form-about {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: solid $--color-secondary thin;
        border-radius: 8px;
        padding: 0 8px;

        .new-domain__form-about-title {
          background: white;
          margin-top: -9px;
          padding: 0 8px;
          font-weight: 400;
        }

        .new-domain__form-about-text {
          text-align: justify;
          word-break: break-word;
        }
      }
    }
  }
}

.valid-domain-popover {
  background-color: $--color-black;
  color: $--color-white;
  font-size: 12px;

  .popper__arrow::after {
    border-top-color: $--color-black !important;
  }
}
</style>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.configure-customizations {
  .configure-customizations__form {
    display: flex;
    flex-direction: column;

    .configure-customizations__form-header {
      display: flex;
      flex-direction: row;
      gap: 16px;

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
    margin-top: 24px;
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
      width: 100%;
      justify-content: flex-end !important;

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

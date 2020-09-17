<template lang="html">
  <div>
    <el-dialog
      :visible.sync="visible"
      :width="width"
      :class="{ 'jus-protocol-dialog--full': fullscreen && step === 1, 'jus-protocol-dialog--large': [1, 4].includes(step) && !fullscreen }"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      append-to-body
      class="jus-protocol-dialog">
      <div
        slot="title"
        class="jus-protocol-dialog__header">
        <span v-if="[3].includes(step) && document.signedDocument">
          <el-link
            :underline="false"
            class="jus-protocol-dialog__title"
            target="_blank"
            @click="openDocumentInNewTab">
            {{ title }}
            <sup>
              <jus-icon
                icon="external-link"
                class="jus-protocol-dialog__dispute-link-icon"
              />
            </sup>
          </el-link>
        </span>
        <span
          v-else
          class="jus-protocol-dialog__title">
          {{ title }}
        </span>
      </div>
      <div v-loading="loading">
        <!-- ESCOLHA DE TEMPLATE -->
        <div
          v-if="step === 0"
          class="jus-protocol-dialog__model-choice"
        >
          <div
            v-for="model in models"
            :key="model.id">
            <el-tooltip
              effect="dark"
              placement="top"
              :content="model.name">
              <el-button
                plain
                class="model-choice__button"
                @click="selectModel(model.id)"
              >
                <span class="model-choice__button-text">{{ model.name }}</span>
                <jus-icon
                  icon="doc"
                  is-active
                  class="model-choice__button-icon"
                />
              </el-button>
            </el-tooltip>
          </div>
        </div>
        <!-- EDIÇÃO DE TEMPLATE -->
        <el-tooltip
          v-if="step === 1 && !isLowHeight"
          :content="fullscreen ? 'Reduzir tela' : 'Expandir tela'"
        >
          <i
            :class="fullscreen ? 'el-icon-bottom-left' : 'el-icon-top-right'"
            class="jus-protocol-dialog__fullscreen-icon"
            @click="changeFullscreen"
          />
        </el-tooltip>
        <div v-if="step === 1">
          <iframe
            :src="document.url"
            frameborder="0"
            allowfullscreen
          />
        </div>
        <!-- ESCOLHA DE EMAILS PARA ASSINATURA -->
        <div
          v-if="step === 2"
          class="jus-protocol-dialog__send-to"
        >
          <p>Escolha um endereço de email para cada parte.</p>
          <div
            v-for="(role, index) in availableSigners"
            :key="index"
          >
            <span class="jus-protocol-dialog__send-title">
              {{ role.name.toUpperCase() }}

              <div class="jus-protocol-dialog__send-default-signer">
                <el-checkbox
                  v-if="recipients[role.name] && !isDefaultSigner(role.documentNumber)"
                  :value="recipients[role.name].defaultSigner"
                  @change="changeDefaultSigner(role)"
                />
                {{ getLabelSigner(role) }}
              </div>
            </span>
            <div
              v-if="role.party"
              class="subtitle"
            >
              {{ $t('fields.' + role.party.toLocaleLowerCase() + role.roles[0].charAt(0).toUpperCase() + role.roles[0].slice(1).toLocaleLowerCase()) }}
            </div>
            <div
              v-if="role.documentNumber && isValidCpfOrCnpj(role.documentNumber)"
              :key="formKey"
              class="subtitle"
            >
              {{ role.documentNumber | cpfCnpjMask }}
            </div>
            <el-form
              v-else
              :ref="'documentForm' + index"
              :model="documentForm"
              :rules="documentFormRules"
              @submit.native.prevent="addDocument(role, index)"
            >
              <el-form-item
                :key="formKey"
                prop="document"
                style="margin-bottom: 0px;"
              >
                <el-input
                  :ref="'documentInput' + formKey"
                  v-model="documentForm.document[index]"
                  v-mask="['###.###.###-##', '##.###.###/####-##']"
                  placeholder="Informe o CPF da parte para selecionar e-mail de assinatura"
                  size="small"
                  @input="clearValidate(index)"
                >
                  <el-button
                    slot="append"
                    icon="el-icon-plus"
                    @click="addDocument(role, index)"
                  />
                </el-input>
              </el-form-item>
            </el-form>
            <div
              v-for="(email, emailIndex) in role.emails"
              :key="`email-${emailIndex}`"
              :class="{ 'mt10': index === 0 }"
              class="line"
            >
              <el-tooltip
                :key="formKey"
                :disabled="!!role.documentNumber && isValidCpfOrCnpj(role.documentNumber)"
                content="Cadastre o CPF da parte para selecionar um e-mail"
              >
                <span>
                  <el-radio
                    :value="Object.keys(recipients).includes(role.name) && recipients[role.name].email === email.address"
                    :label="true"
                    :name="role.name"
                    :disabled="!role.documentNumber || !isValidCpfOrCnpj(role.documentNumber)"
                    @change="setRecipientEmail(generateSigner(role, email))">
                    {{ email.address }}
                  </el-radio>
                </span>
              </el-tooltip>
              <el-button
                v-if="email.canDelete"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="removeEmail(email.address, role.name)"
              />
            </div>
            <div>
              <el-tooltip
                :disabled="!!role.documentNumber && isValidCpfOrCnpj(role.documentNumber)"
                content="Cadastre o CPF da parte para adicionar um e-mail"
              >
                <span><el-button
                  v-show="!role.show"
                  :key="formKey"
                  :disabled="!role.documentNumber"
                  type="text"
                  icon="el-icon-plus"
                  class="add-email"
                  @click="showAddEmail(role.name, index)"
                >
                  Adicionar e-mail
                </el-button></span>
              </el-tooltip>
              <el-form
                :ref="'emailForm' + index"
                :model="emailForm"
                :rules="emailFormRules"
                @submit.native.prevent="addEmail(role, index)"
              >
                <el-form-item
                  v-show="role.show"
                  :key="formKey"
                  prop="email"
                >
                  <el-input
                    :ref="'emailInput' + index"
                    v-model="emailForm.email[role.name]"
                    placeholder="Adicionar e-mail"
                    size="small"
                    @input="clearValidate(index)"
                  >
                    <el-button
                      slot="append"
                      icon="el-icon-plus"
                      @click="addEmail(role, index)"
                    />
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <el-form
            ref="roleForm"
            :model="roleForm"
            :rules="roleFormRules"
            label-position="top"
            hide-required-asterisk
            class="new-role"
            @submit.native.prevent="addRole()"
          >
            <el-button
              v-show="!showARoleButton"
              type="text"
              icon="el-icon-plus"
              @click="showAddRole()"
            >
              Adicionar nova parte
            </el-button>
            <el-form-item
              v-show="showARoleButton"
              label="Adicionar nova parte"
              prop="role"
            >
              <el-input
                ref="newRoleInput"
                v-model="roleForm.role"
                placeholder="Nome"
                @input="clearValidate()"
              >
                <el-button
                  slot="append"
                  icon="el-icon-plus"
                  @click="addRole()"
                />
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- FEEDBACK DE ASSINATURAS -->
        <div v-if="step === 3">
          <div
            v-for="(signer, index) in signers"
            :key="index"
            class="jus-protocol-dialog__status"
          >
            <jus-avatar-user
              :name="signer.name"
              size="sm"
              shape="circle"
            />
            <div class="jus-protocol-dialog__status-role">
              {{ signer.name }}<br>
              {{ signer.email }}
            </div>
            <div class="jus-protocol-dialog__status-icon">
              <span v-if="signer.signed">Assinado <jus-icon icon="success" /></span>
              <span v-else>Aguardando assinatura</span>
            </div>
          </div>
        </div>
        <!-- VISUALIZAÇÃO DA MINUTA -->
        <div
          v-if="false && step === 4"
          v-loading="loadingPdf"
        >
          <object
            ref="pdfView"
            :data="pdfUrl"
            type="application/pdf"
            @load="loadingPdf = false"
          />
        </div>
      </div>
      <!-- BOTÕES DO RODAPE -->
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          v-if="![0, 4].includes(step)"
          :disabled="loading"
          icon="el-icon-delete"
          plain
          :size="buttonSize"
          type="danger"
          @click="deleteDocument"
        >
          Excluir Minuta
        </el-button>
        <el-button
          v-if="step !== 4"
          :disabled="loading"
          :size="buttonSize"
          plain
          @click="visible = false"
        >
          Cancelar
        </el-button>
        <el-tooltip
          v-if="document.canEdit && [2, 3, 4].includes(step)"
          content="Volta documento para edição.">
          <el-button
            :disabled="loading"
            type="secondary"
            :size="buttonSize"
            @click="backDocumentToEditing"
          >
            Voltar para edição
          </el-button>
        </el-tooltip>
        <el-button
          v-if="[2, 4].includes(step)"
          :disabled="loading"
          :size="buttonSize"
          plain
          @click="backToDocument"
        >
          Voltar
        </el-button>
        <el-button
          v-if="step === 1"
          :size="buttonSize"
          :disabled="loading"
          type="primary"
          @click="step = 2, hideForms()"
        >
          Definir assinantes da minuta
        </el-button>
        <el-button
          v-if="step === 2"
          :size="buttonSize"
          :disabled="!hasEmails || loadingChooseRecipients"
          type="primary"
          @click="confirmChooseRecipients"
        >
          Enviar para Assinatura
        </el-button>
        <el-tooltip
          v-if="step === 3"
          content="Baixar minuta.">
          <el-button
            v-loading="loadingDownload"
            icon="el-icon-download"
            type="primary"
            :size="buttonSize"
            @click="downloadDocument"
          >
            Baixar
          </el-button>
        </el-tooltip>
        <el-tooltip
          v-if="canResendNotification && step === 3"
          content="Reenvia notificação para todos os contatos que ainda não assinaram a minuta."
        >
          <el-button
            :disabled="loading"
            icon="el-icon-refresh-right"
            type="primary"
            :size="buttonSize"
            @click="resendSignersNotification"
          >
            Reenviar
          </el-button>
        </el-tooltip>
        <el-button
          v-if="false && step === 3"
          icon="el-icon-view"
          :size="buttonSize"
          type="primary"
          @click="visualizePdf"
        >
          Visualizar
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="confirmChooseRecipientsVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="Confirmar partes para assinatura"
      width="60%"
      append-to-body
    >
      <el-alert
        type="info"
        title="Faltando algum assinante?"
        class="mb40"
      >
        Cada parte assinante precisa ter o CPF cadastrado e um E-MAIL selecionado. Certifique-se na
        tela anterior se todas as partes para assinatura estão corretamente preenchidas.
      </el-alert>
      <div
        v-for="recipient of recipients"
        :key="recipient.name"
        class="jus-protocol-dialog__confirm-recipients"
      >
        <jus-avatar-user
          :name="recipient.name"
          size="sm"
          shape="circle"
        />
        <div>
          <b>{{ recipient.name }}</b><br>
          <b>{{ recipient.documentNumber | cpfCnpjMask }}</b><br>
          {{ recipient.email }}
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :disabled="loadingChooseRecipients"
          plain
          @click="confirmChooseRecipientsVisible = false"
        >
          Voltar
        </el-button>
        <el-button
          :disabled="loadingChooseRecipients"
          type="primary"
          @click="chooseRecipients"
        >
          Confirmar e enviar
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validateObjectEmail, validateCpf } from '@/utils/validations'
import { IS_SMALL_WINDOW } from '@/constants/variables'
import * as cpf from '@fnando/cpf'
import * as cnpj from '@fnando/cnpj'
import { mapActions, mapGetters } from 'vuex'
import { concat } from 'lodash'

export default {
  name: 'JusProtocolDialog',
  props: {
    protocolDialogVisible: {
      type: Boolean,
      default: false,
    },
    disputeId: {
      type: Number,
      default: 0,
    },
    disputeRoles: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      step: 0,
      loading: false,
      loadingPdf: false,
      loadingDownload: false,
      loadingChooseRecipients: false,
      confirmChooseRecipientsVisible: false,
      fullscreen: false,
      models: [],
      emails: {},
      recipients: {},
      document: {},
      signers: '',
      formKey: 0,
      roles: [],
      showARoleButton: false,
      roleForm: {
        role: '',
      },
      roleFormRules: {
        role: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
      },
      emailForm: {
        email: {},
      },
      emailFormRules: {
        email: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validateObjectEmail, trigger: 'submit' },
        ],
      },
      documentForm: {
        document: {},
      },
      documentFormRules: {
        document: [
          { validator: validateCpf, message: 'CPF/CNPJ inválido.', trigger: 'submit' },
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
        ],
      },
      isLowHeight: false,
    }
  },
  computed: {
    ...mapGetters({
      defaultSigners: 'availableSigners',
    }),
    defaultsDocuments() {
      return this.defaultSigners.map(signer => this.stripDoc(signer.documentNumber))
    },
    availableSigners() {
      function getObjectByDoc(doc, list) {
        return list.find(item => item.documentNumber === doc) || { emails: [] }
      }

      function concatEmails(list1, list2) {
        const emails = concat(list1, list2)
        const res = []

        for (const email of emails) {
          if (res.filter(el => el.address === email.address).length < 1) {
            res.push(email)
          }
        }

        return res
      }

      const docs = this.roles.map(role => this.stripDoc(role.documentNumber))

      const signers = this.defaultSigners.filter(signer => !docs.includes(this.stripDoc(signer.documentNumber)))
      const roles = this.roles.map(role => {
        return {
          ...role,
          show: false,
          emails: concatEmails(role.emails, getObjectByDoc(role.documentNumber, this.defaultSigners).emails),
        }
      })
      return [...roles, ...signers]
    },
    visible: {
      get() {
        return this.protocolDialogVisible
      },
      set(value) {
        if (!value) this.$emit('update:protocolDialogVisible', value)
      },
    },
    title() {
      switch (this.step) {
        case 0:
          return this.models.length > 1 ? 'Escolha um modelo para iniciar' : 'Carregando...'
        case 1: return 'Visualização da Minuta'
        case 2: return 'Enviar Minuta'
        case 3:
        case 4: return this.document.name
        default: return 'Minuta'
      }
    },
    width() {
      if (this.step === 1 && this.fullscreen === true) {
        return '100%'
      }
      if ([1, 4].includes(this.step)) {
        return '85%'
      }
      return '80%'
    },
    hasEmails() {
      let hasEmails = false
      if (this.roles) {
        this.roles.map(e => {
          if (e.emails.length) hasEmails = true
        })
      }
      return hasEmails
    },
    pdfUrl() {
      if (this.disputeId) {
        return 'https://justto.app/api/office/documents/download-signed/' + this.disputeId
      }

      return ''
    },
    canResendNotification() {
      if (this.signers) {
        return this.signers.length > this.signers.filter(s => {
          return s.signed === true
        }).length
      }

      return null
    },
    buttonSize() {
      return IS_SMALL_WINDOW ? 'mini' : 'medium'
    },

  },
  watch: {
    step() {
      if (Number(this.step) === 2) {
        this.getDefaultAssigners()
      }
    },
    visible(value) {
      if (value) {
        this.loading = true
        this.loadingChooseRecipients = false
        this.loadingDownload = false
        this.step = 0
        this.recipients = {}
        this.signers = ''
        this.roles = JSON.parse(JSON.stringify(this.disputeRoles.filter(r => !r.documentNumber || r.documentNumber.length !== 14)))
        this.emailForm.email = {}
        this.getDocument()
        this.roleForm.role = ''
        this.showARoleButton = false
        this.documentForm.document = {}
      }
    },
  },
  mounted() {
    if (IS_SMALL_WINDOW) {
      this.isLowHeight = true
      this.fullscreen = true
    }
  },
  methods: {
    ...mapActions([
      'getDocumentModels',
      'getDocumentByDisputeId',
      'getDefaultAssigners',
      'setSelectedSigners',
      'setDocumentSigners',
      'cleanSelectedSigners',
    ]),
    getLabelSigner(role) {
      const { documentNumber, name } = role
      if (this.isDefaultSigner(documentNumber)) {
        return 'Assinante padrão'
      } else if (this.recipients[name]) {
        return 'Definir como assinante padrão'
      } else {
        return ''
      }
    },
    stripDoc(doc) {
      if (cpf.isValid(doc)) {
        return cpf.strip(doc)
      } else if (cnpj.isValid(doc)) {
        return cnpj.strip(doc)
      } else {
        return ''
      }
    },
    changeDefaultSigner(role) {
      const { name, documentNumber } = role
      if (!this.isDefaultSigner(documentNumber)) {
        this.recipients[name].defaultSigner = !this.recipients[name].defaultSigner
        this.$forceUpdate()
      }
    },
    setRecipientEmail(signer) {
      this.recipients[signer.name] = signer
      this.$forceUpdate()
    },
    generateSigner(role, email) {
      return {
        name: role.name,
        documentNumber: role.documentNumber,
        email: email.address,
        disputeRoleId: role.id,
        defaultSigner: this.isDefaultSigner(role.documentNumber),
      }
    },
    isDefaultSigner(doc) {
      return this.defaultsDocuments.includes(this.stripDoc(doc))
    },
    isValidCpfOrCnpj(value) {
      return cpf.isValid(value) || cnpj.isValid(value)
    },
    openDocumentInNewTab() {
      const url = `https://assinador.juristas.com.br/private/documents/${this.document.signedDocument.signKey}`
      navigator.clipboard.writeText(url)
      this.$jusNotification({
        title: 'Yay!',
        message: 'URL do documento copiado!',
        type: 'success',
      })
      setTimeout(() => window.open(url), 1400)
    },
    addDocument(role, formIndex) {
      const documentForm = this.$refs['documentForm' + formIndex][0]
      documentForm.validate(valid => {
        if (valid) {
          if (!role.documentNumber) {
            this.formKey += 1
            this.$forceUpdate()
            this.showAddEmail(role.name, formIndex)
          }

          this.roles[formIndex].documentNumber = this.stripDoc(this.documentForm.document[formIndex])
          role.documentNumber = this.stripDoc(this.documentForm.document[formIndex])
        }
      })
    },
    hideForms() {
      this.roles.map(r => { r.show = false })
      this.showARoleButton = false
      this.formKey += 1
    },
    addRole() {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          const name = this.roleForm.role.toUpperCase()
          this.roles.push({ name, emails: [] })
          this.roleForm.role = ''
          this.showARoleButton = false
          this.formKey += 1
          this.$nextTick(() => {
            const documentInput = this.$refs['documentInput' + this.formKey][0]
            documentInput.focus()
          })
        }
      })
    },
    showAddRole() {
      this.showARoleButton = true
      this.formKey += 1
      this.$nextTick(() => this.$refs.newRoleInput.focus())
    },
    addEmail(role, formIndex) {
      const emailForm = this.$refs['emailForm' + formIndex][0]
      emailForm.validate(valid => {
        if (valid) {
          if (this.emailForm.email[role.name]) {
            const index = this.roles.findIndex(r => r.name === role.name)
            if (index > -1) {
              this.roles[index].emails.push({
                address: this.emailForm.email[role.name],
                canDelete: true,
              })
              const email = this.emailForm.email[role.name]
              this.recipients[role.name] = this.generateSigner(role, { address: email })
              this.emailForm.email = {}
              this.roles[index].show = false
              this.formKey += 1
            }
          }
        }
      })
    },
    showAddEmail(name, formIndex) {
      this.availableSigners.map(r => {
        if (r.name === name) r.show = true
        else r.show = false
      })
      this.showARoleButton = false
      this.formKey += 1
      if (formIndex) {
        this.$nextTick(() => {
          const emailInput = this.$refs['emailInput' + formIndex][0]
          emailInput.focus()
        })
      }
      this.$forceUpdate()
    },
    removeEmail(email, name) {
      const index = this.roles.findIndex(r => r.name === name)
      if (index > -1) {
        const emailIndex = this.roles[index].emails.findIndex(e => e.address === email)
        this.roles[index].emails.splice(emailIndex, 1)
      }
    },
    clearValidate(formIndex) {
      const roleform = this.$refs.roleForm
      let documentForm
      let emailForm
      if (formIndex) {
        documentForm = this.$refs['documentForm' + formIndex]
        emailForm = this.$refs['emailForm' + formIndex]
      }
      if (roleform) roleform.clearValidate()
      if (documentForm && documentForm.length) documentForm[0].clearValidate()
      if (emailForm && emailForm.length) emailForm[0].clearValidate()
    },
    getDocument() {
      this.getDocumentByDisputeId(this.disputeId).then(document => {
        if (document) {
          this.document = document
          if (document.signedDocument === null) {
            this.step = 1
          } else {
            this.signers = document.signedDocument.signers
            this.step = 3
          }
        } else {
          this.getModels()
        }
      }).catch(error => {
        this.visible = false
        this.loading = false
        this.$jusNotification({ error })
      }).finally(() => {
        this.loading = false
      })
    },
    getModels() {
      this.loading = true
      this.getDocumentModels().then(models => {
        this.models = models
        const isUnique = models.length && models.length === 1
        if (isUnique) {
          this.selectModel(models[0].id, isUnique)
        }
      }).catch(error => {
        this.visible = false
        this.$jusNotification({ error })
      }).finally(() => {
        this.loading = false
      })
    },
    selectModel(modelId, isUnique) {
      const { disputeId } = this

      this.loading = true

      this.$store.dispatch('createDocumentByModel', { disputeId, modelId }).then(doc => {
        this.document = doc
        this.step = 1
        if (isUnique) {
          const hideAlert = localStorage.getItem('jushidemodelalert')
          if (!hideAlert) {
            this.$confirm(
              `Este é um modelo padrão disponibilizado pela Justto.
              Fique à vontade para edita-lo de acordo com suas necessidades.`,
              'Minuta padrão', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Não exibir mais esta mensagem',
                cancelButtonClass: 'is-plain',
                dangerouslyUseHTMLString: true,
                type: 'info',
              },
            ).catch(() => {
              localStorage.setItem('jushidemodelalert', true)
            })
          }
        }
        // SEGMENT TRACK
        this.$jusSegment('Geração de minuta', { description: `Minuta gerada: ${this.document.name}` })
      }).catch(error => {
        this.visible = false
        this.$jusNotification({ error })
      }).finally(() => {
        this.loading = false
      })
    },
    confirmChooseRecipients() {
      if (!Object.keys(this.recipients).length) {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Selecione ao menos um email.',
          type: 'warning',
        })
        return false
      } else {
        new Promise((resolve, reject) => {
          for (const recipient of Object.values(this.recipients)) {
            if (!this.isValidCpfOrCnpj(recipient.documentNumber)) {
              reject(new Error(`${recipient.name} está com o número do documento inválido`))
            }
          }
          resolve()
        }).then(() => {
          this.confirmChooseRecipientsVisible = true
        }).catch(error => {
          this.$jusNotification({ error })
          return false
        })
      }
    },
    chooseRecipients() {
      this.loading = true
      this.loadingChooseRecipients = true
      this.confirmChooseRecipientsVisible = false
      const recipients = Object.values(this.recipients).map(recipient => {
        const { name, email, documentNumber, disputeRoleId, defaultSigner } = recipient
        return { name, email, documentNumber, disputeRoleId, defaultSigner }
      })
      this.setDocumentSigners({
        disputeId: this.disputeId, recipients,
      }).then(doc => {
        this.signers = doc.signers
        this.step = 3
        this.loading = false
        this.document.signedDocument = doc
        this.document.signedDocumentId = doc.id
        this.document.canEdit = true
      }).catch(error => {
        this.visible = false
        this.$jusNotification({ error })
      }).finally(() => {
        this.loading = false
        this.loadingChooseRecipients = false
        this.recipients = {}
      })
    },
    resendSignersNotification() {
      this.loading = true
      this.$store.dispatch('resendSignersNotification', {
        disputeId: this.disputeId,
      }).then(() => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Notificação reenviada com sucesso',
          type: 'success',
        })
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.loading = false
      })
    },
    backToDocument() {
      if (this.step === 4) {
        this.step = 3
      } else {
        this.step = 1
        this.recipients = {}
      }
    },
    downloadDocument() {
      this.loadingDownload = true
      this.$store.dispatch('downloadDocument', {
        disputeId: this.disputeId,
        name: this.document.name,
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.loadingDownload = false
      })
    },
    deleteDocument() {
      this.$confirm('Tem certeza que deseja excluir?', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        title: 'Atenção!',
        type: 'warning',
        cancelButtonClass: 'is-plain',
      }).then(() => {
        this.loading = true
        this.$store.dispatch('deleteDocument', this.disputeId).then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Minuta excluída com sucesso',
            type: 'success',
          })
        }).catch(error => {
          this.$jusNotification({ error })
        }).finally(() => {
          this.visible = false
        })
      })
    },
    visualizePdf() {
      this.loadingPdf = true
      this.step = 4
    },
    backDocumentToEditing() {
      this.$confirm('Você vai cancelar o documento já enviado para assinatura. Tem certeza que deseja voltar para edição?', {
        confirmButtonText: 'Voltar para edição',
        cancelButtonText: 'Cancelar',
        title: 'Atenção!',
        type: 'warning',
        cancelButtonClass: 'is-plain',
      }).then(() => {
        this.loading = true
        this.$store.dispatch('backDocumentToEditing', this.disputeId).then(() => {
          this.step = 1
          this.loading = false
          this.$jusNotification({
            title: 'Yay!',
            message: 'Ok, seu documento voltou para faze de edição!',
            type: 'success',
          })
        }).catch(error => {
          this.$jusNotification({ error })
        })
      })
    },
    changeFullscreen() {
      this.fullscreen = !this.fullscreen
    },
  },
}
</script>

<style lang="scss">
.jus-protocol-dialog {
  .jus-protocol-dialog__header {
    padding-top: 8px;
    .jus-protocol-dialog__title {
      font-weight: bold;
      font-size: 20px;
    }
    .jus-protocol-dialog__dispute-link-icon {
      width: 16px;
    }
  }
  &--full {
    padding: 10px;
    .el-dialog {
      .el-dialog__body {
        height: calc(100vh - 200px);
        @media (max-height: 640px) {
          margin: 10px;
          height: calc(100vh - 120px);
        }
      }
    }
  }
  &--large  {
    .el-dialog {
      .el-dialog__body {
        height: calc(100vh - 284px);
      }
    }
  }
  &__fullscreen-icon {
    position: absolute;
    font-size: 22px;
    top: 30px;
    right: 20px;
    cursor: pointer;
  }
  .jus-protocol-dialog__model-choice {
    // margin: 30px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding: 10px;

    .model-choice__button {
      width: 160px;
      height: 180px;
      margin: 10px;
      .model-choice__button-text {
        font-weight: 500;
        display: -webkit-box;
        -webkit-line-clamp: 6;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: initial;
      }
      .model-choice__button-icon {
        width: 50px;
        margin-top: 20px
      }
    }
  }
  &__send-to {
    > div {
      margin-top: 12px;
    }
    p {
      margin-top: -14px;
      margin-bottom: 32px;
    }

    .jus-protocol-dialog__send-title {
      color: #adadad;
      font-weight: 700;

      border-bottom: solid 1px lightgray;
      margin-bottom: 8px;

      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .jus-protocol-dialog__send-default-signer {
        margin-left: 8px;
      }

    }
    .signer-choice {
      font-weight: bold;
      font-size: 12px;
      .el-switch {
        margin: auto 8px;
      }
    }
    .subtitle {
      font-weight: bold;
      font-size: 12px;
    }
    .el-input {
      margin-top: 8px;
    }
    .line {
      padding: 4px 8px;
      button {
        display: none;
      }
      &:hover {
        background-color: #f6f6f6;
        button {
          display: initial;
          float: right;
          padding: 0;
          padding-top: 2px;
          color: #FF4B54;
          font-size: 16px;
        }
      }
    }
    .new-role {
      margin: 20px 0;
    }
    .add-email {
      font-size: 12px;
      margin-left: 9px;
    }
  }
  .jus-protocol-dialog__status {
    display: flex;
    align-items: center;
    padding: 36px 8px;
    &:hover {
      background-color: #f6f6f6;
    }
  }
  .jus-protocol-dialog__status-icon {
    color: #adadad;
    margin-left: auto;
    img {
      width: 14px;
      vertical-align: middle;
      margin-bottom: 2px;
    }
  }
  .jus-protocol-dialog__status-role {
    margin-left: 10px;
  }
  &__confirm-recipients {
    display: flex;
    > div:last-child {
      margin-left: 14px;
      > b:first-child {
        color: #adadad;
      }
    }
    &+ .jus-protocol-dialog__confirm-recipients {
      margin-top: 20px;
    }
  }
  .el-dialog__body > div > div, .el-dialog__body > div {
    height: 100%;
    margin-bottom: 20px;
  }
  .el-button--danger {
    float: left;
  }
  iframe {
    width: 100%;
    height: 100%;
  }
  object {
    width: 100%;
    height: 99%;
  }
}
</style>

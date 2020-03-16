<template lang="html">
  <el-dialog
    :visible.sync="visible"
    :title="title"
    :width="width"
    :class="{ 'jus-protocol-dialog--full': [1, 4].includes(step) }"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    append-to-body
    class="jus-protocol-dialog">
    <div v-loading="loading">
      <div v-if="step === 0" class="jus-protocol-dialog__model-choice">
        <el-button v-for="model in models" :key="model.id" plain @click="selectModel({ modelId: model.id })">
          <h4>{{ model.name }}</h4>
          <jus-icon icon="doc" is-active />
        </el-button>
      </div>
      <div v-if="step === 1">
        <iframe :src="document.url" />
      </div>
      <div v-if="step === 2" class="jus-protocol-dialog__send-to">
        <p>Escolha um endereço de email para cada parte.</p>
        <div v-for="(role, index) in roles" :key="index">
          <span class="title">{{ role.name.toUpperCase() }}</span>
          <div v-if="role.party" class="subtitle">
            {{ $t('fields.' + role.party.toLocaleLowerCase() + role.roles[0].charAt(0).toUpperCase() + role.roles[0].slice(1).toLocaleLowerCase()) }}
          </div>
          <div v-for="(email, index) in role.emails" :key="index" class="line">
            <input
              v-model="emails[role.name]"
              :name="role.name"
              :value="email.address"
              :class="{ 'mt10': index === 0 }"
              type="radio">
            {{ email.address }}
            <el-button v-if="email.canDelete" size="mini" type="text" icon="el-icon-delete" @click="removeEmail(email.address, role.name)" />
          </div>
          <div>
            <el-button
              v-show="!role.show"
              :key="formKey"
              type="text"
              icon="el-icon-plus"
              class="add-email"
              @click="showAddEmail(role.name)">
              Adicionar e-mail
            </el-button>
            <el-form :ref="'emailForm' + index" :model="emailForm" :rules="emailFormRules" @submit.native.prevent="addEmail(role.name, index)">
              <el-form-item v-show="role.show" :key="formKey" prop="email">
                <el-input v-model="emailForm.email[role.name]" placeholder="Adicionar e-mail" size="small" @input="clearValidate(index)">
                  <el-button slot="append" icon="el-icon-plus" @click="addEmail(role.name, index)" />
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
          @submit.native.prevent="addRole()">
          <el-button v-show="!showARoleButton" type="text" icon="el-icon-plus" @click="showAddRole()">
            Adicionar nova parte
          </el-button>
          <el-form-item
            v-show="showARoleButton"
            label="Adicionar nova parte"
            prop="role">
            <el-input v-model="roleForm.role" placeholder="Nome" @input="clearValidate()">
              <el-button slot="append" icon="el-icon-plus" @click="addRole()" />
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="step === 3">
        <div v-for="(signer, index) in signers" :key="index" class="jus-protocol-dialog__status">
          <jus-avatar-user :name="signer.name" size="sm" shape="circle" />
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
      <div v-loading="loadingPdf" v-if="step === 4">
        <object ref="pdfView" :data="pdfUrl" type="application/pdf" @load="loadingPdf = false" />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        v-if="![0, 4].includes(step)"
        :disabled="loading"
        icon="el-icon-delete"
        plain
        type="danger"
        @click="deleteDocument">
        Excluir Minuta
      </el-button>
      <el-button
        v-if="step !== 4"
        :disabled="loading"
        plain
        @click="visible = false">
        Cancelar
      </el-button>
      <el-button
        v-if="[2, 4].includes(step)"
        :disabled="loading"
        plain
        @click="backToDocument">
        Voltar
      </el-button>
      <el-button
        v-if="step === 1"
        :disabled="loading"
        type="primary"
        @click="step = 2, hideForms()">
        Definir assinantes da minuta
      </el-button>
      <el-button
        v-if="step === 2"
        :disabled="!hasEmails || loadingChooseRecipients"
        type="primary"
        @click="chooseRecipients">
        Enviar para Assinatura
      </el-button>
      <el-button
        v-loading="loadingDownload"
        v-if="step === 3"
        icon="el-icon-download"
        type="primary"
        @click="downloadDocument">
        Baixar
      </el-button>
      <!-- <el-button
        v-if="step === 3"
        icon="el-icon-view"
        type="primary"
        @click="visualizePdf">
        Visualizar
      </el-button> -->
    </span>
  </el-dialog>
</template>

<script>
import { validateObjectEmail } from '@/utils/validations'

export default {
  name: 'JusProtocolDialog',
  props: {
    protocolDialogVisible: {
      type: Boolean,
      default: false
    },
    disputeId: {
      type: Number,
      default: 0
    },
    disputeRoles: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      step: 0,
      loading: false,
      loadingPdf: false,
      loadingDownload: false,
      loadingChooseRecipients: false,
      models: [],
      emails: {},
      document: {},
      signers: '',
      formKey: 0,
      roles: [],
      showARoleButton: false,
      roleForm: {
        role: ''
      },
      roleFormRules: {
        role: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      },
      emailForm: {
        email: {}
      },
      emailFormRules: {
        email: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validateObjectEmail, trigger: 'submit' }
        ]
      }
    }
  },
  computed: {
    visible: {
      get () {
        return this.protocolDialogVisible
      },
      set (value) {
        if (!value) this.$emit('update:protocolDialogVisible', value)
      }
    },
    title () {
      switch (this.step) {
        case 0:
          if (this.models.length > 1) {
            return 'Escolha um modelo para iniciar'
          }
          return 'Carregando...'
        case 1: return 'Visualização da Minuta'
        case 2: return 'Enviar Minuta'
        case 3:
        case 4: return this.document.name
        default: return 'Minuta'
      }
    },
    width () {
      if ([1, 4].includes(this.step)) {
        return '85%'
      }
      return '70%'
    },
    hasEmails () {
      let hasEmails = false
      if (this.roles) {
        this.roles.map(e => {
          if (e.emails.length) hasEmails = true
        })
      }
      return hasEmails
    },
    pdfUrl () {
      if (this.disputeId) {
        return 'https://justto.app/api/documents/download-signed/' + this.disputeId
      }
    }
  },
  watch: {
    visible (value) {
      if (value) {
        this.loading = true
        this.loadingChooseRecipients = false
        this.loadingDownload = false
        this.step = 0
        this.emails = {}
        this.signers = ''
        this.roles = JSON.parse(JSON.stringify(this.disputeRoles))
        this.emailForm.email = {}
        this.getDocument()
        this.roleForm.role = ''
        this.showARoleButton = false
      }
    }
  },
  methods: {
    hideForms () {
      this.roles.map(r => { r.show = false })
      this.showARoleButton = false
      this.formKey += 1
    },
    addRole () {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          let name = this.roleForm.role.toUpperCase()
          this.roles.push({ name, emails: [] })
          this.roleForm.role = ''
          this.showARoleButton = false
          this.formKey += 1
        }
      })
    },
    showAddRole () {
      this.showARoleButton = true
      this.formKey += 1
    },
    addEmail (name, formIndex) {
      let emailForm = this.$refs['emailForm' + formIndex][0]
      emailForm.validate(valid => {
        if (valid) {
          if (this.emailForm.email[name]) {
            let index = this.roles.findIndex(r => r.name === name)
            if (index > -1) {
              this.roles[index].emails.push({
                address: this.emailForm.email[name],
                canDelete: true
              })
              this.emailForm.email = {}
              this.roles[index].show = false
              this.formKey += 1
            }
          }
        }
      })
    },
    showAddEmail (name) {
      this.roles.map(r => {
        if (r.name === name) r.show = true
        else r.show = false
      })
      this.showARoleButton = false
      this.formKey += 1
    },
    removeEmail (email, name) {
      let index = this.roles.findIndex(r => r.name === name)
      if (index > -1) {
        let emailIndex = this.roles[index].emails.findIndex(e => e.address === email)
        this.roles[index].emails.splice(emailIndex, 1)
      }
    },
    clearValidate (formIndex) {
      let emailForm = this.$refs['emailForm' + formIndex][0]
      if (formIndex && emailForm) {
        emailForm.clearValidate()
      } else {
        this.$refs.roleForm.clearValidate()
      }
    },
    getDocument () {
      this.$store.dispatch('getDocumentByDisputeId', this.disputeId).then(document => {
        if (document) {
          this.document = document
          if (document.signedDocument === null) {
            this.step = 1
          } else {
            this.signers = document.signedDocument.signers
            this.step = 3
          }
        } else {
          this.getDocumentModels()
        }
      }).catch((e) => {
        console.error(e)
        this.visible = false
        this.loading = false
        this.$jusNotification({ type: 'error' })
      }).finally(() => {
        this.loading = false
      })
    },
    getDocumentModels () {
      this.loading = true
      this.$store.dispatch('getDocumentModels').then(models => {
        this.models = models
        if (models.length && models.length === 1) {
          this.selectModel({ modelId: models[0].id, unique: models.length === 1 })
        } else {
          this.loading = false
        }
      }).catch(() => {
        this.visible = false
        this.$jusNotification({ type: 'error' })
      })
    },
    selectModel (params) {
      this.loading = true
      this.$store.dispatch('createDocumentByModel', {
        disputeId: this.disputeId,
        modelId: params.modelId
      }).then(doc => {
        this.document = doc
        this.step = 1
        if (params.unique) {
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
                type: 'info'
              }
            ).catch(() => {
              localStorage.setItem('jushidemodelalert', true)
            })
          }
        }
        // SEGMENT TRACK
        this.$jusSegment('Geração de minuta', { description: `Minuta gerada: ${this.document.name}` })
      }).catch(() => {
        this.visible = false
        this.$jusNotification({ type: 'error' })
      }).finally(() => {
        this.loading = false
      })
    },
    chooseRecipients () {
      if (!Object.keys(this.emails).length) {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Selecione ao menos um email.',
          type: 'warning'
        })
        return false
      }
      this.loading = true
      this.loadingChooseRecipients = true
      let emails = []
      for (let [key, value] of Object.entries(this.emails)) {
        emails.push({
          name: key,
          email: value
        })
      }
      this.$store.dispatch('setDocumentSigners', {
        disputeId: this.disputeId, emails
      }).then(doc => {
        this.signers = doc.signers
        this.step = 3
        this.loading = false
      }).catch(e => {
        this.visible = false
        if (e.response.data.reason.length) {
          this.$jusNotification({
            type: 'error',
            message: e.response.data.reason + '. Tente novamente ou entre em contato com o administrador do sistema.'
          })
        } else {
          this.$jusNotification({ type: 'error' })
        }
      }).finally(() => {
        this.loading = false
        this.loadingChooseRecipients = false
      })
    },
    backToDocument () {
      if (this.step === 4) {
        this.step = 3
      } else {
        this.step = 1
        this.emails = {}
      }
    },
    downloadDocument () {
      this.loadingDownload = true
      this.$store.dispatch('downloadDocument', {
        disputeId: this.disputeId,
        name: this.document.name
      }).catch(() => {
        this.$jusNotification({ type: 'error' })
      }).finally(() => {
        this.loadingDownload = false
      })
    },
    deleteDocument () {
      this.$confirm('Tem certeza que deseja excluir?', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        title: 'Atenção!',
        type: 'warning',
        cancelButtonClass: 'is-plain'
      }).then(() => {
        this.loading = true
        this.$store.dispatch('deleteDocument', this.disputeId).then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Minuta excluída com sucesso',
            type: 'success'
          })
        }).catch(() => {
          this.$jusNotification({ type: 'error' })
        }).finally(() => {
          this.visible = false
        })
      })
    },
    visualizePdf () {
      this.loadingPdf = true
      this.step = 4
    }
  }
}
</script>

<style lang="scss">
.jus-protocol-dialog {
  &--full {
    .el-dialog__body {
      height: calc(100vh - 284px);
    }
  }
  &__model-choice {
    margin: 30px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    button {
      width: 100%;
      max-width: 160px;
      height: 180px;
      margin: 10px;
      h4 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: initial;
      }
      img {
        width: 50px;
        margin-bottom: 20px;
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
    .title {
      color: #adadad;
      font-weight: 700;
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
          padding-top: 0px;
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
  &__status {
    display: flex;
    align-items: center;
    padding: 40px 8px;
    &:hover {
      background-color: #f6f6f6;
    }
  }
  &__status-icon {
    color: #adadad;
    margin-left: auto;
    img {
      width: 14px;
      vertical-align: middle;
      margin-bottom: 2px;
    }
  }
  &__status-role {
    margin-left: 10px;
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

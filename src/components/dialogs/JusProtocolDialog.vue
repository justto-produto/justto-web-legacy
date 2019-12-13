<template lang="html">
  <el-dialog
    :visible.sync="visible"
    :title="title"
    :width="width"
    :class="{ 'jus-protocol-dialog--full': [1, 4].includes(step) }"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    class="jus-protocol-dialog">
    <div v-loading="loading">
      <div v-if="step === 0" class="jus-protocol-dialog__model-choice">
        <el-button v-for="model in models" :key="model.id" plain @click="selectModel(model.id)">
          <h4>{{ model.name }}</h4>
          <jus-icon icon="doc" is-active />
        </el-button>
      </div>
      <div v-if="step === 1">
        <iframe :src="document.url" />
      </div>
      <div v-if="step === 2" class="jus-protocol-dialog__send-to">
        <p>Escolha um endereço de email para cada parte.</p>
        <span v-if="hasEmails">
          <div v-for="(role, index) in disputeRoles" :key="index">
            <span class="jus-protocol-dialog__title">{{ role.name }}</span>
            <div v-for="(email, index) in role.emails" :key="index">
              <input
                v-model="emails[role.name]"
                :name="role.name"
                :value="email.address"
                type="radio">
              {{ email.address }}
            </div>
          </div>
        </span>
        <span v-else>
          <h2>
            Sem e-mails cadastrados! <br>
            Vá até a disputa e adicione e-mails
            <a href="#" @click.prevent="$router.push('management/dispute/' + disputeId)">
              clicando aqui.
            </a>
          </h2>
        </span>
        <br>
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
        @click="step = 2">
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
      <el-button
        v-if="step === 3"
        icon="el-icon-view"
        type="primary"
        @click="visualizePdf">
        Visualizar
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
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
      signers: ''
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
      if (this.loading) {
        return 'Minuta'
      } else {
        switch (this.step) {
          case 0: return 'Escolha um modelo para iniciar'
          case 1: return 'Visualização da Minuta'
          case 2: return 'Enviar Minuta'
          case 3:
          case 4: return this.document.name
          default: return ''
        }
      }
    },
    width () {
      if ([1, 4].includes(this.step)) {
        return '85%'
      }
      return '60%'
    },
    hasEmails () {
      let hasEmails = false
      if (this.disputeRoles) {
        this.disputeRoles.map(e => {
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
        this.getDocument()
      }
    }
  },
  methods: {
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
        if (models && models.length === 1) {
          this.selectModel(models[0].id)
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
        } else {
          this.loading = false
        }
      }).catch(() => {
        this.visible = false
        this.$jusNotification({ type: 'error' })
      })
    },
    selectModel (modelId) {
      this.loading = true
      this.$store.dispatch('createDocumentByModel', {
        disputeId: this.disputeId,
        modelId
      }).then(doc => {
        this.document = doc
        this.step = 1
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
    .el-dialog {
      margin: 20px auto !important;
      height: calc(100% - 40px);
    }
  }
  &__model-choice {
    margin: 50px;
    display: flex;
    justify-content: center;
    button {
      width: 100%;
      max-width: 200px;
      & + .el-button {
        margin-left: 20px;
      }
      img {
        width: 50px;
        margin-bottom: 20px;
      }
    }
  }
  &__send-to {
    span > div {
      margin-top: 24px;
      + div {
        margin-top: 18px;
      }
    }
    input {
      margin-top: 10px;
    }
    p {
      margin-top: 0;
    }
  }
  &__title {
    color: #adadad;
    font-weight: 700;
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
  .el-dialog__body {
    height: calc(100% - 144px);
  }
  .el-dialog__body > div > div, .el-dialog__body > div {
    height: 100%;
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

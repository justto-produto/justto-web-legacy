<template lang="html">
  <el-dialog
    :visible.sync="visible"
    :title="title"
    :width="width"
    :class="{ 'jus-protocol-dialog--full': step === 1 }"
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
        <div v-for="(role, index) in disputeRoles" v-if="role.emails.length" :key="index">
          <span class="jus-protocol-dialog__title">{{ role.name }}</span>
          <div v-for="(email, index) in role.emails" :key="index">
            <!-- <el-radio v-model="radio" label="1"> -->
            <input
              v-model="emails[role.name]"
              :name="role.name"
              :value="email.address"
              type="radio">
            {{ email.address }}
          </div>
        </div>
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
            <span v-if="signer.signed">Assinado <jus-icon icon="success"/></span>
            <span v-else>Aguardando assinatura</span>
          </div>
        </div>
      </div>
      <div v-if="step === 4">
        <jus-web-viewer url="https://justto.app/api/documents/download-signed/13619"/>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="step !== 0" icon="el-icon-delete" plain type="danger" @click="deleteDocument">Excluir Minuna</el-button>
      <el-button v-if="step !== 4" plain @click="visible = false">Cancelar</el-button>
      <el-button v-if="[2, 4].includes(step)" plain @click="backToDocument">Voltar</el-button>
      <el-button v-if="step === 1" type="primary" @click="step = 2">Definir assinantes da minuta</el-button>
      <el-button v-if="step === 2" type="primary" @click="chooseRecipients">Enviar para Assinatura</el-button>
      <el-button v-loading="loadingDownload" v-if="step === 3" icon="el-icon-download" type="primary" @click="downloadDocument">Baixar</el-button>
      <el-button v-if="step === 3" icon="el-icon-view" type="primary" @click="step = 4">Visualizar</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'JusProtocolDialog',
  components: {
    JusWebViewer: () => import('@/components/others/JusWebViewer')
  },
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
      loadingDownload: false,
      models: [],
      emails: {},
      document: {},
      signers: {}
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
          case 3: return this.document.name
          default: return ''
        }
      }
    },
    width () {
      if ([1, 4].includes(this.step)) {
        return '85%'
      }
      return '60%'
    }
  },
  watch: {
    visible (value) {
      if (value) {
        this.loading = true
        this.step = 0
        this.emails = {}
        this.getDocument()
      }
    }
  },
  methods: {
    getDocument () {
      this.$store.dispatch('getDocumentByDisputeId', this.disputeId).then(document => {
        if (document) {
          this.document = document
          this.signers = document.signedDocument.signers
          if (document.signedDocument === null) {
            this.step = 1
          } else {
            this.step = 3
          }
          this.loading = false
        } else {
          this.getDocumentModels()
        }
      }).catch(() => {
        this.visible = false
        this.loading = false
        this.$jusNotification({ type: 'error' })
      })
    },
    getDocumentModels () {
      this.$store.dispatch('getDocumentModels').then(models => {
        this.models = models
        if (models.length === 1) {
            this.selectModel(models[0].id)
        }
      }).catch(() => {
        this.visible = false
        this.$jusNotification({ type: 'error' })
      }).finally(() => {
        this.loading = false
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
        this.document = doc
        this.step = 3
        this.loading = false
      }).catch(() => {
        this.visible = false
        this.$jusNotification({ type: 'error' })
      }).finally(() => {
        this.loading = false
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
        type: 'danger',
        cancelButtonClass: 'is-plain'
      }).then(() => {
        this.loading = true
        this.$store.dispatch('deleteDocument', this.disputeId).then(() => {
          this.step = 0
          this.getDocumentModels()
        }).catch(() => {
          this.visible = false
          this.$jusNotification({ type: 'error' })
        }).finally(() => {
          this.loading = false
        })
      })
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
    > div {
      margin-top: 32px;
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
}
</style>

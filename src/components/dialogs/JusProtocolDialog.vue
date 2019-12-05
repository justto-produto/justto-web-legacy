<template lang="html">
  <el-dialog
    :visible.sync="visible"
    :title="title"
    :width="width"
    :class="{ 'jus-protocol-dialog--full': step === 4 }"
    class="jus-protocol-dialog">
    <div v-loading="loading">
      <div v-if="step === 0" class="jus-protocol-dialog__model-choice">
        <el-button v-for="model in models" :key="model.id" plain @click="selectModel(model.id)">
          <h4>{{ model.name }}</h4>
          <jus-icon icon="doc" is-active />
        </el-button>
      </div>
      <div v-if="step === 1">
        <img src="@/assets/doc.png" style="width: 100%;">
      </div>
      <div v-if="step === 2" class="jus-protocol-dialog__send-to">
        <p>Escolha um endereço de email para cada parte.</p>
        <div v-for="(role, index) in roles" :key="index">
          <span class="jus-protocol-dialog__title">{{ role.name }}</span>
          <div v-for="(email, index) in role.emails" :key="index">
            <input :name="role.name" :value="email" type="radio">{{ email }}
          </div>
        </div>
      </div>
      <div v-if="step === 3">
        <div v-for="(role, index) in roles" :key="index" class="jus-protocol-dialog__status">
          <jus-avatar-user :name="role.name" size="sm" shape="circle" />
          <div class="jus-protocol-dialog__status-role">
            {{ role.name }}<br>
            {{ role.emails[0] }}
          </div>
          <div class="jus-protocol-dialog__status-icon">
            <span v-if="index === 0">Assinado <jus-icon icon="success"/></span>
            <span v-else>Aguardando assinatura</span>
          </div>
        </div>
      </div>
      <div v-if="step === 4">
        <jus-web-viewer url="https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf"/>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="step === 3" icon="el-icon-delete" plain type="danger" @click="visible = false">Excluir</el-button>
      <el-button v-if="step === 4" plain @click="step = 3">Voltar</el-button>
      <el-button v-else plain @click="visible = false">Cancelar</el-button>
      <el-button v-if="step === 1" type="primary" @click="changewidth">Escolher destinatários</el-button>
      <el-button v-if="step === 2" type="primary" @click="changewidth">Enviar</el-button>
      <el-button v-if="step === 3" icon="el-icon-download" type="primary" @click="step = 4">Baixar</el-button>
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
    }
  },
  data () {
    return {
      step: 0,
      loading: false,
      models: [],
      document: {}
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
        case 0: return 'Escolha um modelo para iniciar'
        case 1: return 'Visualização da Minuta'
        case 2: return 'Enviar Minuta'
        case 3: return 'Minuta #25714089'
        default: return ''
      }
    },
    roles () {
      return [
        { name: 'Henrique Liberato', emails: ['dkeeler@mac.com', 'grady@me.com', 'storerm@comcast.net'] },
        { name: 'Vilma Santos', emails: ['fallorn@hotmail.com', 'mmccool@msn.com', 'petersko@yahoo.ca'] }
      ]
    },
    width () {
      if (this.step === 4) {
        return '80%'
      }
      return '50%'
    }
  },
  watch: {
    visible (value) {
      if (value) {
        this.loading = true
        this.step = 0
        this.getDocument()
      }
    }
  },
  methods: {
    getDocument () {
      this.$store.dispatch('getDocumentByDisputeId', this.disputeId).then(document => {
        if (document) {
          this.document = document
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
      }).catch(() => {
        this.visible = false
        this.$jusNotification({ type: 'error' })
      }).finally(() => {
        this.loading = false
      })
    },
    selectModel (modelId) {
      console.log(modelId)
    }
  }
}
</script>

<style lang="scss">
.jus-protocol-dialog {
  &--full {
    .el-dialog {
      margin: 20px auto !important;
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
    padding: 8px;
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
    min-height: 30vh;
  }
  .el-button--danger {
    float: left;
  }
}
</style>

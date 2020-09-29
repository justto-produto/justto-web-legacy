<template>
  <el-card
    v-if="showTips && showProtocol"
    class="dispute-tips el-card--bordered el-card--info"
  >
    <div slot="header">
      <i class="el-icon-info" />
      Próximo passo: Geração e envio de minuta
      <el-button
        type="text"
        icon="el-icon-close"
        @click="showTips = false"
      />
    </div>
    <div class="content">
      <el-steps
        :active="documentStep"
        align-center
        process-status="wait"
      >
        <el-step
          title="Criação"
          description="Criação e edição da minuta"
          icon="el-icon-document"
        />
        <el-step
          title="Envio"
          description="Envio para assinatura das partes"
          icon="el-icon-s-promotion"
        />
        <el-step
          title="Assinaturas"
          description="Todas as assinaturas coletadas"
          icon="el-icon-edit"
        />
      </el-steps>
    </div>
    <div class="action">
      <el-tooltip
        v-if="hasDocumentSignURL"
        effect="dark"
        content="Copiar URL de assinatura do Documento"
        placement="top"
      >
        <el-button
          icon="el-icon-copy-document"
          type="secondary"
          @click="copyDocumentURL()"
        />
      </el-tooltip>
      <el-button
        type="primary"
        @click="showProtocolDialog()"
      >
        Gerenciar minuta
      </el-button>
    </div>
    <jus-protocol-dialog
      :protocol-dialog-visible.sync="protocolDialogVisible"
      :dispute-id="dispute.id"
      :dispute-roles="dispute.disputeRoles"
    />
  </el-card>
</template>

<script>
import { getDocumentStep } from '@/utils/jusUtils'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'DisputeTips',
  components: {
    JusProtocolDialog: () => import('@/components/dialogs/JusProtocolDialog')
  },
  data() {
    return {
      showTips: true,
      protocolDialogVisible: false,
      document: {}
    }
  },
  computed: {
    ...mapGetters({
      dispute: 'dispute'
    }),
    documentStep() {
      return getDocumentStep(this.dispute.hasDocument, this.dispute.signStatus)
    },
    showProtocol() {
      return ['ACCEPTED', 'CHECKOUT', 'SETTLED'].includes(this.dispute.status)
    },
    hasDocumentSignURL() {
      return this.document.signedDocument && this.document.signedDocument.signKey
    }
  },
  created() {
    if (this.documentStep >= 2) {
      this.getDocumentByDisputeId(this.dispute.id).then(document => {
        this.document = document
      })
    }
  },
  methods: {
    ...mapActions(['getDocumentByDisputeId']),
    showProtocolDialog() {
      // SEGMENT TRACK
      this.$jusSegment('Gerenciar minuta dentro do ticket view', { disputeId: this.dispute.id })
      this.protocolDialogVisible = true
    },
    copyDocumentURL() {
      const url = `https://assinador.juristas.com.br/private/documents/${this.document.signedDocument.signKey}`
      navigator.clipboard.writeText(url)
      this.$message({
        message: 'Endereço para assinatura do documento copiado para área de transferência.',
        type: 'info',
        center: true,
        showClose: true
      })
    }
  }
}
</script>

<style lang="scss">
.dispute-tips {
  max-width: 800px;
  width: 80%;
  margin: 10px auto;
  .el-card__header {
    color: #424242;
    padding: 12px;
    font-size: 18px;
    font-weight: 500;
    button {
      padding: 0;
      float: right;
    }
    .el-icon-info {
      color: #72cbff;
      font-size: 15px;
    }
    .el-icon-close {
      color: #343c4b;
    }
  }
  .content {
    margin-top: 30px;
  }
  .action {
    margin: 30px 0 10px;
    text-align: center;
  }
  .el-steps {
    .is-process, .is-wait {
      color: #adadad;
    }
    .el-step__line {
      background-color: #adadad;
    }
    .el-step__description {
      color: #343c4b;
    }
  }
}
</style>

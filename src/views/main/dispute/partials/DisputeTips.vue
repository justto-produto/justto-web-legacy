<template>
  <el-card
    v-if="showProtocol && hasDraftFeatureActive"
    class="dispute-tips el-card--bordered el-card--info"
    :class="{'minimized': !showTips}"
  >
    <div slot="header">
      <i class="el-icon-info" />
      Próximo passo: Geração e envio de minuta

      <el-tooltip
        :content="showTips ? 'Minimizar' : 'Maximizar'"
        :open-delay="500"
      >
        <el-button
          type="text"
          :icon="showTips ? 'el-icon-minus' : 'el-icon-plus'"
          @click="showTips = !showTips"
        />
      </el-tooltip>
    </div>

    <div
      v-if="showTips"
      class="content"
    >
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

    <div
      v-if="showTips"
      class="action"
    >
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
      :dispute-id="dispute.id || dispute.disputeId"
      :dispute="dispute"
    />
  </el-card>
</template>

<script>
import { getDocumentStep } from '@/utils'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'DisputeTips',

  components: {
    JusProtocolDialog: () => import('@/components/dialogs/JusProtocolDialog')
  },

  props: {
    value: {
      type: Object,
      default: () => ({})
    }
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
      hasDraftFeatureActive: 'getIsDraftManagementActive'
    }),

    dispute() {
      return Object.keys(this.value).length > 0 ? this.value : this.$store.getters.dispute
    },

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
@import '@/styles/colors.scss';

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
      color: $--color-info;
      font-size: 15px;
    }

    .el-icon-minus {
      color: $--color-text-primary;
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
      color: $--color-text-secondary;
    }
    .el-step__line {
      background-color: $--color-light-gray;
    }
    .el-step__description {
      color: $--color-text-primary;
    }
  }

  &.minimized {
    .el-card__body {
      display: none;
    }
  }
}
</style>

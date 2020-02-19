<template>
  <el-card v-if="showTips && showProtocol" class="dispute-tips el-card--bordered el-card--info">
    <div slot="header">
      <i class="el-icon-info" />
      Próximo passo: Geração e envio de minuta
      <el-button type="text" icon="el-icon-close" @click="showTips = false" />
    </div>
    <div class="content">
      <el-steps :active="documentStep" align-center process-status="wait">
        <el-step title="Criação" description="Criação e edição da minuta" icon="el-icon-document" />
        <el-step title="Envio" description="Envio para assinatura das partes" icon="el-icon-s-promotion" />
        <el-step title="Assinaturas" description="Todas as assinaturas coletadas" icon="el-icon-edit" />
      </el-steps>
    </div>
    <div class="action">
      <el-button v-if="documentStep !== 0" type="primary" @click="showOrotocolDialog()">
        Gerenciar minuta
      </el-button>
      <el-button v-else type="primary" @click="showsDenidedService()">
        Gerenciar minuta
      </el-button>
    </div>
    <jus-protocol-dialog
      :protocol-dialog-visible.sync="protocolDialogVisible"
      :dispute-id="dispute.id"
      :dispute-roles="dispute.disputeRoles" />
  </el-card>
</template>

<script>
import { getDocumentStep } from '@/utils/jusUtils'
export default {
  name: 'DisputeTips',
  components: {
    JusProtocolDialog: () => import('@/components/dialogs/JusProtocolDialog')
  },
  data () {
    return {
      showTips: true,
      protocolDialogVisible: false
    }
  },
  computed: {
    dispute () {
      return this.$store.getters.dispute
    },
    documentStep () {
      return getDocumentStep(this.dispute.hasDocument, this.dispute.signStatus)
    },
    showProtocol () {
      return ['ACCEPTED', 'CHECKOUT', 'SETTLED'].includes(this.dispute.status)
    }
  },
  methods: {
    showsDenidedService () {
      this.$alert('', 'Serviço temporariamente indisponível', {
        confirmButtonText: 'OK',
      })
    },
    showOrotocolDialog () {
      // SEGMENT TRACK
      this.$jusSegment('Gerenciar minuta dentro do ticket view', { disputeId: this.dispute.id })
      this.protocolDialogVisible = true
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

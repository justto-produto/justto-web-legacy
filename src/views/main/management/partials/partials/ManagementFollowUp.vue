<template>
  <article
    v-if="needFolllowUp"
    class="follow-up-container"
  >
    <el-tooltip
      v-if="needFolllowUp"
      :content="followUpText"
      :open-delay="500"
      class="follow-up-tooltip"
    >
      <el-button
        size="mini"
        type="text"
        class="follow-up-button"
        @click="handleClick"
      >
        {{ followUpBtnText }}
      </el-button>
    </el-tooltip>
  </article>
</template>

<script>
import { isValid as isValidCPF } from '@fnando/cnpj'
import { isValid as isValidCNPJ } from '@fnando/cpf'
import { mapGetters } from 'vuex'

export default {
  props: {
    dispute: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({ isRecovery: 'isWorkspaceRecovery' }),

    status() {
      return this.dispute?.getDisputeStatus
    },

    havePhone() {
      const validContacts = this.dispute?.getDisputeFirstClaimantHasPhones || this.dispute?.getDisputeFirstClaimantLawyerHasPhones

      return ['PENDING'].includes(this.status) && validContacts
    },

    wasViewed() {
      if (this.dispute?.getDisputeLastInteraction?.direction === 'INBOUND' && ['RUNNING'].includes(this.status) && ['VISUALIZATION', 'NEGOTIATOR_ACCESS', 'CLICK'].includes(this.dispute?.getDisputeLastInteraction?.type)) {
        return this.$moment().diff(this.$moment(this.dispute?.getDisputeLastInteractionCreateAt), 'hours') >= 24
      }

      return false
    },

    hasUnknownParts() {
      return ['PENDING'].includes(this.status) && (this.dispute?.getDisputeHasUnknownPolarityParty)
    },

    claimantHaveInvalidDocument() {
      const document = this.dispute?.getDisputeFirstClaimantDocumentNumber

      return ['PENDING'].includes(this.status) && document && !isValidCPF(document) && !isValidCNPJ(document)
    },

    lawyerHaveInvalidDocument() {
      const document = this.dispute?.firstClaimantLawyerDocumentNumber

      return ['PENDING'].includes(this.status) && document && !isValidCPF(document) && !isValidCNPJ(document)
    },

    hasNoNegotiationInterest() {
      return this.dispute?.getDisputeIsInNegotiation && this.dispute?.getDisputeHasNoNegotiationInterest
    },

    needFolllowUp() {
      /* `dispute.favorite` é referente à "Aguardando análise da empresa." */
      if (this.dispute?.getDisputeIsFavorite === false && this.dispute?.getDisputeIsPaused === false && this.dispute?.getDisputeLastInteraction?.direction === 'OUTBOUND' && this.dispute.getDisputeIsInNegotiation) {
        return this.$moment().diff(this.$moment(this.dispute?.getDisputeLastInteractionCreateAt), 'hours') >= 24
      }

      return this.hasNoNegotiationInterest || this.hasUnknownParts || this.wasViewed || this.havePhone || this.lawyerHaveInvalidDocument || this.claimantHaveInvalidDocument
    },

    followUpDays() {
      return this.$moment().diff(this.$moment(this.dispute?.getDisputeLastInteractionCreateAt), 'days')
    },

    followUpText() {
      if (this.hasNoNegotiationInterest) { return 'Indicativo de perda, tente reverter!' }

      if (this.hasUnknownParts) { return 'Disputa contém partes sem polaridade.' }

      if (this.wasViewed || this.havePhone) { return 'Ligue para a parte e faça o acordo!' }

      if (this.lawyerHaveInvalidDocument) { return this.$tc('roles.LAWYER.CLAIMANT', this.isRecovery) + ' com documento inválido' }

      if (this.claimantHaveInvalidDocument) { return this.$tc('roles.PARTY.CLAIMANT', this.isRecovery) + ' com documento inválido' }

      return 'Ligue para a parte e faça o acordo!'
    },

    followUpBtnText() {
      const plural = this.followUpDays > 1 ? 's' : ''

      if (this.hasNoNegotiationInterest) { return 'Indicativo de perda, tente reverter!' }

      if (this.hasUnknownParts) { return 'Definir polaridade' }

      if (this.wasViewed) { return `Visualizada há ${this.followUpDays} dia${plural}` }

      if (this.havePhone) { return 'Ligue para a parte!' }

      if (this.lawyerHaveInvalidDocument) { return 'Advogado com documento inválido' }

      if (this.claimantHaveInvalidDocument) { return 'Documento inválido' }

      return `${this.followUpDays} dia${plural} sem retorno da parte`
    }
  },

  methods: {
    handleClick() {
      // TODO: Rotear para 'ticket' dependendo da property.
      this.$router.push({ name: 'dispute', params: { id: this.dispute.getDisputeId } })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.follow-up-container {
  .follow-up-button {
    padding: 0;

    span {
      color: $--color-secondary;
      font-weight: bold;
    }
  }
}
</style>

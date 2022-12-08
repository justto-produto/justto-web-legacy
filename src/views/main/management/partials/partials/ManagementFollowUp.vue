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
      return this.dispute?.status || this.dispute?.disputeStatus
    },

    havePhone() {
      const validContacts = ((this.dispute?.disputeRoles || []).filter(({ phones, archived, dead, party }) => (
        !archived && !dead && ['CLAIMANT'].includes(party) && (phones || []).filter(({ archived, blocked, isValid }) => (
          !archived && !blocked && isValid
        )).length > 0
      )).length > 0 || (this.dispute?.lawyer?.hasPhones || this.dispute?.plaintiff?.hasPhones))

      return ['PENDING'].includes(this.status) && validContacts
    },

    wasViewed() {
      if (this.dispute?.lastInteraction?.direction === 'INBOUND' && ['RUNNING'].includes(this.status) && ['VISUALIZATION', 'NEGOTIATOR_ACCESS', 'CLICK'].includes(this.dispute?.lastInteraction?.type)) {
        return this.$moment().diff(this.$moment(this.dispute?.lastInteraction?.createAt?.dateTime || this.dispute?.lastInteraction?.createdAt), 'hours') >= 24
      }

      return false
    },

    hasUnknownParts() {
      return ['PENDING', 'ENGAGEMENT'].includes(this.status) && (this.dispute?.unknownPolarityParty || ((this.dispute?.disputeRoles || []).filter(({ party }) => (party === 'UNKNOWN')).length) > 1)
    },

    claimantHaveInvalidDocument() {
      const document = this.dispute?.firstClaimantDocumentNumber || this.dispute?.plaintiff?.documentNumber

      return ['PENDING'].includes(this.status) && document && !isValidCPF(document) && !isValidCNPJ(document)
    },

    lawyerHaveInvalidDocument() {
      const document = this.dispute?.firstClaimantLawyerDocumentNumber || this.dispute?.lawyer?.documentNumber

      return ['PENDING'].includes(this.status) && document && !isValidCPF(document) && !isValidCNPJ(document)
    },

    hasNoNegotiationInterest() {
      return ['RUNNING'].includes(this.status) && (this.dispute?.noNegotiationInterest || this.dispute?.properties?.NO_NEGOTIATION_INTEREST === String(true))
    },

    needFolllowUp() {
      if (this.dispute?.lastInteraction?.direction === 'OUTBOUND' && ['RUNNING'].includes(this.status)) {
        return this.$moment().diff(this.$moment(this.dispute?.lastInteraction?.createAt?.dateTime || this.dispute?.lastInteraction?.createdAt), 'hours') >= 24
      }

      return this.hasNoNegotiationInterest || this.hasUnknownParts || this.wasViewed || this.havePhone || this.lawyerHaveInvalidDocument || this.claimantHaveInvalidDocument
    },

    followUpDays() {
      return this.$moment().diff(this.$moment(this.dispute?.lastInteraction?.createAt?.dateTime || this.dispute?.lastInteraction?.createdAt), 'days')
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
      this.$router.push({ name: 'dispute', params: { id: this.dispute.id } })
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

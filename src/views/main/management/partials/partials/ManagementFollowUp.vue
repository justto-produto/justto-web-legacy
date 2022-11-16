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
      return this.dispute?.unknownPolarityParty || ((this.dispute?.disputeRoles || []).filter(({ party }) => (party === 'UNKNOWN')).length) > 0
    },

    claimantHaveInvalidDocument() {
      const document = this.dispute?.firstClaimantDocumentNumber || this.dispute?.plaintiff?.documentNumber

      return ['PENDING'].includes(this.status) && !isValidCPF(document) && !isValidCNPJ(document)
    },

    lawyerHaveInvalidDocument() {
      const document = this.dispute?.firstClaimantLawyerDocumentNumber || this.dispute?.lawyer?.documentNumber

      return ['PENDING'].includes(this.status) && document && !isValidCPF(document) && !isValidCNPJ(document)
    },

    needFolllowUp() {
      if (this.dispute?.lastInteraction?.direction === 'OUTBOUND' && ['RUNNING'].includes(this.status)) {
        return this.$moment().diff(this.$moment(this.dispute?.lastInteraction?.createAt?.dateTime || this.dispute?.lastInteraction?.createdAt), 'hours') >= 24
      }

      return this.hasUnknownParts || this.wasViewed || this.havePhone || this.lawyerHaveInvalidDocument || this.claimantHaveInvalidDocument
    },

    followUpDays() {
      return this.$moment().diff(this.$moment(this.dispute?.lastInteraction?.createAt?.dateTime || this.dispute?.lastInteraction?.createdAt), 'days')
    },

    followUpText() {
      return this.lawyerHaveInvalidDocument ? this.$tc('roles.LAWYER.CLAIMANT', this.isRecovery) + ' com documento inválido' : this.claimantHaveInvalidDocument ? this.$tc('roles.PARTY.CLAIMANT', this.isRecovery) + ' com documento inválido' : this.hasUnknownParts ? 'Disputa contém partes sem polaridade.' : 'Ligue para a parte e faça o acordo!'
    },

    followUpBtnText() {
      const plural = this.followUpDays > 1 ? 's' : ''

      return this.lawyerHaveInvalidDocument ? 'Advogado com documento inválido' : this.claimantHaveInvalidDocument ? 'Documento inválido' : this.hasUnknownParts ? 'Definir polaridade' : this.havePhone ? 'Ligue para a parte!' : this.wasViewed ? `Visualizada há ${this.followUpDays} dia${plural}` : `${this.followUpDays} dia${plural} sem retorno da parte`
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

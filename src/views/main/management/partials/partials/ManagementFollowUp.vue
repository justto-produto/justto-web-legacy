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
export default {
  props: {
    dispute: {
      type: Object,
      required: true
    }
  },

  computed: {
    status() {
      return this.dispute?.status || this.dispute?.disputeStatus
    },

    havePhone() {
      const validContacts = ((this.dispute?.disputeRoles || []).filter(({ phones, archived, dead, party }) => (
        !archived && !dead && ['CLAIMANT'].includes(party) && (phones || []).filter(({ archived, blocked, isValid }) => (
          !archived && !blocked && isValid
        )).length > 0
      )).length || (this.dispute?.plaintiff?.phones || []).length) > 0

      return ['PENDING'].includes(this.status) && validContacts
    },

    wasViewed() {
      if (this.dispute?.lastInteraction?.direction === 'INBOUND' && ['RUNNING'].includes(this.status) && ['VISUALIZATION', 'NEGOTIATOR_ACCESS', 'CLICK'].includes(this.dispute?.lastInteraction?.type)) {
        return this.$moment().diff(this.$moment(this.dispute?.lastInteraction?.createAt?.dateTime || this.dispute?.lastInteraction?.createdAt), 'hours') >= 24
      }

      return false
    },

    needFolllowUp() {
      if (this.dispute?.lastInteraction?.direction === 'OUTBOUND' && ['RUNNING'].includes(this.status)) {
        return this.$moment().diff(this.$moment(this.dispute?.lastInteraction?.createAt?.dateTime || this.dispute?.lastInteraction?.createdAt), 'hours') >= 24
      }

      return this.wasViewed || this.havePhone
    },

    followUpDays() {
      return this.$moment().diff(this.$moment(this.dispute?.lastInteraction?.createAt?.dateTime || this.dispute?.lastInteraction?.createdAt), 'days')
    },

    followUpText() {
      return 'Ligue para a parte e faça o acordo!'
    },

    followUpBtnText() {
      const plural = this.followUpDays > 1 ? 's' : ''

      return this.havePhone ? 'Ligue para a parte!' : this.wasViewed ? `Visualizado à ${this.followUpDays} dia${plural}` : `${this.followUpDays} dia${plural} sem retorno da parte`
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

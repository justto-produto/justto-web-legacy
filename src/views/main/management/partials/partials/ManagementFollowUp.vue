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
    wasViewed() {
      if (this.dispute?.lastInteraction?.direction === 'INBOUND' && ['RUNNING'].includes(this.dispute?.status) && ['VISUALIZATION', 'NEGOTIATOR_ACCESS'].includes(this.dispute?.lastInteraction?.type)) {
        return this.$moment().diff(this.$moment(this.dispute?.lastInteraction?.createAt?.dateTime), 'hours') >= 24
      }

      return false
    },

    needFolllowUp() {
      if (this.dispute?.lastInteraction?.direction === 'OUTBOUND' && ['RUNNING'].includes(this.dispute?.status)) {
        return this.$moment().diff(this.$moment(this.dispute?.lastInteraction?.createAt?.dateTime), 'hours') >= 24
      }

      return this.wasViewed
    },

    followUpDays() {
      return this.$moment().diff(this.$moment(this.dispute?.lastInteraction?.createAt?.dateTime), 'days')
    },

    followUpText() {
      return 'Tente realizar ligações para os contatos!'
      // return this.wasViewed ? `Visualizado à ${this.followUpDays} dia${this.followUpDays > 1 ? 's' : ''}` : `Última mensagem enviada a ${this.followUpDays} dia${this.followUpDays > 1 ? 's' : ''}, gostaria de enviar uma nova?`
    },

    followUpBtnText() {
      return this.wasViewed ? `Visualizado à ${this.followUpDays} dia${this.followUpDays > 1 ? 's' : ''}` : `${this.followUpDays} dia${this.followUpDays > 1 ? 's' : ''} sem retorno da parte`
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

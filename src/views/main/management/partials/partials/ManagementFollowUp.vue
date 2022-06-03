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
        @click="$router.push(`management/dispute/${dispute.id}`)"
      >
        {{ followUpDays }} dias sem retorno da parte
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
    needFolllowUp() {
      if (this.dispute?.lastInteraction?.direction === 'OUTBOUND') {
        return this.$moment().diff(this.$moment(this.dispute?.lastInteraction?.createAt?.dateTime), 'hours') > 24
      }

      return false
    },

    followUpDays() {
      return this.$moment().diff(this.$moment(this.dispute?.lastInteraction?.createAt?.dateTime), 'days')
    },

    followUpText() {
      return `Última mensagem enviada a ${this.followUpDays} dias, gostaria de enviar uma nova?`
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.follow-up-container {
  .el-button {
    span {
      color: $--color-secondary;
      font-weight: bold;
    }
  }
}
</style>

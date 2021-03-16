<template>
  <section class="manual-container">
    <span
      class="manual-container__text"
      v-html="text"
    />
    <span class="communication-container__about negotiation-occurrence-about">
      {{ interaction.createAt.dateTime | moment('HH:mm') }}
    </span>
  </section>
</template>

<script>
import { addInvisibleStatus } from '@/utils'

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    occurrence: {
      type: Object,
      required: true
    }
  },
  computed: {
    interaction() {
      return this.value
    },
    text() {
      const { USER, VALUE, PERSON_NAME } = this.interaction.properties

      const text = `Negociador(a) <strong>${USER}</strong> informou uma proposta realizada por <strong>${PERSON_NAME}</strong> no valor de <strong>${VALUE}</strong>`

      return addInvisibleStatus(text)
    }
  },
  updated() {
    this.$set(this.occurrence, 'renderCompleted', true)
  },
  mounted() {
    this.$set(this.value, 'renderCompleted', true)
  }
}
</script>

<style lang="scss" scoped>
.manual-container {
  background-color: transparent;
  display: flex;
  flex-direction: column;

  overflow: hidden;
  margin: 12px 6px;

  .communication-container__about {
    color: #3C3B3B;

    @media (max-height: 900px) {
      font-size: 14px;
    }
  }
}
</style>

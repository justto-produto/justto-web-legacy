<template>
  <section class="manual-container">
    <span
      class="manual-container__text"
      v-html="text"
    />
    <span class="communication-container__about">
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
    display: flex;
    justify-content: flex-end;
    margin-top: -12px;
    font-size: 11px;

    color: #3C3B3B;
  }
}
</style>

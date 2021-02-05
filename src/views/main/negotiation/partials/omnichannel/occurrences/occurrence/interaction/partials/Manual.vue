<template>
  <section class="manual-container">
    <span
      class="manual-container__text"
      v-html="text"
    />
    <span class="communication-container__contact">
      {{ interaction.createAt.dateTime | moment('HH:mm') }}
    </span>
  </section>
</template>

<script>
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
      return `Negociador(a) <strong>${USER}</strong> informou uma proposta realizada por <strong>${PERSON_NAME}</strong> no valor de <strong>${VALUE}</strong>`
    }
  }
}
</script>

<style lang="scss" scoped>
.manual-container {
  display: flex;
  flex-direction: column;

  overflow: hidden;
  margin: 12px;

  .communication-container__contact {
    display: flex;
    justify-content: flex-end;

    font: normal normal normal 15px/18px Proxima Nova;
    color: #9A9797;
  }
}

@media (max-height: 680px) {
  .manual-container {
    .communication-container__contact {
      font: normal normal normal 12px/12px Proxima Nova;
    }
  }
}
</style>

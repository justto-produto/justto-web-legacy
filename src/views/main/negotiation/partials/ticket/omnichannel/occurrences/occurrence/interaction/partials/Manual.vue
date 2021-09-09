<template>
  <section class="manual-container">
    <div
      v-if="toPrint"
      class="date-to-print no-indent"
    >
      {{ sendDate | moment('[Em] DD/MM [-] HH:mm') }}
    </div>
    <span
      class="manual-container__text"
      v-html="text"
    />

    <Note
      v-if="hasNote"
      :value="value"
      :text="interaction.properties.NOTE"
      resumed
    />

    <span
      v-if="!toPrint"
      class="communication-container__about negotiation-occurrence-about"
    >
      {{ sendDate | moment('HH:mm') }}
    </span>
  </section>
</template>

<script>
import { addInvisibleStatus } from '@/utils'
import communicationSendStatus from '@/utils/mixins/communicationSendStatus'

export default {
  components: {
    Note: () => import('@/views/main/negotiation/partials/ticket/omnichannel/occurrences/occurrence/note/Note.vue')
  },

  mixins: [communicationSendStatus],

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

    hasNote() {
      return !!this.interaction?.properties?.NOTE
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
@import '@/styles/colors.scss';

.manual-container {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  gap: 8px;

  overflow: hidden;
  margin: 12px 6px;

  .communication-container__about {
    color: $--color-text-primary;
  }
}
</style>

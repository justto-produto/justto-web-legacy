<template>
  <section class="summary-container">
    <Occurrence
      v-for="occurrence in (occurrences || [])"
      :key="occurrence.id"
      :value="occurrence"
      :child-props="{ scheduled: true }"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    Occurrence: () => import('@/views/main/negotiation/partials/ticket/omnichannel/occurrences/occurrence/Occurrence')
  },

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      summaryOccurrences: 'getOccurrencesSummary'
    }),

    occurrences() {
      return [
        ...(this.summaryOccurrences.EMAIL[this.value.id] || []),
        ...(this.summaryOccurrences.SMS[this.value.id] || []),
        ...(this.summaryOccurrences.WHATSAPP[this.value.id] || [])
      ]
    }
  },

  updated() {
    this.$set(this.value, 'renderCompleted', true)
  },

  mounted() {
    this.$set(this.value, 'renderCompleted', true)
  }
}
</script>

<style lang="scss" scoped>
.summary-container {
  width: calc(100% + 24px);
}
</style>

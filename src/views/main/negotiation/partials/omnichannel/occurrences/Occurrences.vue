<template>
  <section
    id="occurrencesOmnichanelNegotiation"
    class="occurrences-container"
  >
    <Occurrence
      v-for="(occurrence, occurrenceIndex) in occurrences"
      :key="`occurrence-${occurrenceIndex}`"
      :value="occurrence"
    />
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    Occurrence: () => import('./occurrence/Occurrence')
  },
  computed: {
    ...mapGetters({
      filter: 'getOccurrencesFilter',
      occurrences: 'getOccurrencesList',
      messageType: 'getEditorMessageType'
    })
  },
  // TODO: Validar a troca de ticket.
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions([
      'setMessageType',
      'getOccurrences'
    ]),
    init() {
      const { id } = this.$route.params
      this.getOccurrences(id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.occurrences-container {
  display: flex;
  flex-direction: column-reverse;
}
</style>

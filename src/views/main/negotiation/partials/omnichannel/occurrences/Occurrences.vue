<template>
  <section
    id="occurrencesOmnichanelNegotiation"
    class="occurrences-container"
  >
    <div
      v-for="(occurrenceContainer, occurrenceContainerIndex) in occurrences"
      :key="`occurrence-container-${occurrenceContainerIndex}`"
      class="occurrences-container__occurrences"
    >
      <span class="occurrences-container__occurrences-date">
        <span>
          {{ $moment(occurrenceContainer.date).format('DD/MM/YYYY') }}
        </span>
      </span>
      <Occurrence
        v-for="(occurrence, occurrenceIndex) in occurrenceContainer.occurrences"
        :key="`occurrence-container-${occurrenceIndex}`"
        :value="occurrence"
        class="occurrences-container__occurrences-item"
      />
    </div>
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
  flex-direction: column;
  justify-content: flex-end;
  overflow-y: auto;

  .occurrences-container__occurrences {
    display: flex;
    flex-direction: column;

    .occurrences-container__occurrences-date {
      top: 10px;
      text-align: center;
      z-index: 10;
      position: -webkit-sticky;
      position: sticky;

      margin: 18px 0px 10px;

      span {
        background-color: #e3f5ff;
        padding: 10px;
      }
    }
  }
}
</style>

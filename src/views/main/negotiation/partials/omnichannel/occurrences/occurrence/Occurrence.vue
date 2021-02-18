<template>
  <section class="occurrency-container">
    <component
      :is="component"
      :value="occurrency"
    />
    <span
      v-for="summaryType in summaryTypes"
      :key="`summaryType-${summaryType}`"
    >
      <span
        v-for="(summaryItem, summaryIndex) in (summary[summaryType][occurrency.id] || [])"
        :key="`summaryItem-${summaryIndex}`"
      >
        <Occurrency
          v-for="(occurrence, occurrenceIndex) in summaryItem.occurrences"
          :key="`summary-${summaryIndex}-occurrence-${occurrenceIndex}`"
          :value="occurrence"
        />
      </span>
    </span>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Occurrency',
  components: {
    LOG: () => import('./log/Log'),
    NOTE: () => import('./note/Note'),
    SUMMARY: () => import('./summary/Summary'),
    INTERACTION: () => import('./interaction/Interaction')
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    childProps: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    summaryTypes: ['EMAIL', 'WHATSAPP', 'SMS'],
  }),
  computed: {
    ...mapGetters({
      summary: 'getOccurrencesSummary'
    }),
    occurrency: {
      get() {
        return this.value
      }
    },
    component() {
      const mapType = {
        NOTE: ['NOTE'],
        LOG: [
          'LOG',
          'VISUALIZATION',
          'CLICK',
          'VISUALIZATION',
          'NEGOTIATOR_ACCESS'
        ],
        SUMMARY: ['SUMMARY'],
        INTERACTION: ['INTERACTION']
      }
      const occurrenceType = this.occurrency.type
      const interactionType = this.occurrency.interaction?.type || 'LOG'
      return Object.keys(mapType).find(key => (mapType[key].includes(occurrenceType) || mapType[key].includes(interactionType)))
    }
  }
}
</script>

<template>
  <section class="occurrence-container">
    <component
      :is="component"
      :value="occurrence"
    />
  </section>
</template>

<script>
export default {
  name: 'Occurrence',
  components: {
    LOG: () => import('./log/Log'),
    NOTE: () => import('./note/Note'),
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
    summaryTypes: ['EMAIL', 'WHATSAPP', 'SMS']
  }),
  computed: {
    occurrence: {
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
      const occurrenceType = this.occurrence.type
      const interactionType = this.occurrence.interaction?.type || 'LOG'
      return Object.keys(mapType).find(key => (mapType[key].includes(occurrenceType) || mapType[key].includes(interactionType)))
    }
  }
}
</script>

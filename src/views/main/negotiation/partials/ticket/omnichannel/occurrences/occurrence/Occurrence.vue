<template>
  <section class="occurrency-container">
    <component
      :is="component"
      :value="occurrency"
    />
  </section>
</template>

<script>
export default {
  name: 'Occurrency',
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

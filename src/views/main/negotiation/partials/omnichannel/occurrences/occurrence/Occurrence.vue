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
  data: () => ({ }),
  computed: {
    occurrency: {
      get() {
        return this.value
      }
    },
    component() {
      const mapType = {
        LOG: [
          'LOG',
          'VISUALIZATION',
          'SCHEDULER',
          'CLICK',
          'VISUALIZATION',
          'NEGOTIATOR_ACCESS'
        ],
        NOTE: ['NOTE'],
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

<style lang="scss" scoped>
</style>

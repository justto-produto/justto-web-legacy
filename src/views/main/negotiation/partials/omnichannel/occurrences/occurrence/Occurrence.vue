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
      return this.occurrency.type
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

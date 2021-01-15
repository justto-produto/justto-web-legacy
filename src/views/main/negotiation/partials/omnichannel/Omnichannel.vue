<template>
  <section>
    <Occurrences />
  </section>
</template>

<script>
export default {
  name: 'Omnichannel',
  components: {
    Occurrences: () => import('./Occurrences')
  }
}
</script>

<style lang="sass" scoped>

</style>

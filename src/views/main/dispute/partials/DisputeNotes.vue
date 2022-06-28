<template>
  <Occurrences class="omnichannel-container__occurrences" />
</template>

<script>
export default {
  name: 'DisputeNotes',

  components: {
    Occurrences: () => import('@/views/main/negotiation/partials/ticket/omnichannel/occurrences/Occurrences.vue')
  }
}
</script>

<style lang="scss">
.omnichannel-container__occurrences {
  min-height: 50vh;
}
</style>

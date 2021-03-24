<template>
  <section
    v-loading="isLoading"
    class="omnichannel-container"
  >
    <Occurrences class="omnichannel-container__occurrences" />
    <Editor class="omnichannel-container__editor" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Omnichannel',
  components: {
    Occurrences: () => import('./occurrences/Occurrences'),
    Editor: () => import('./editor/Editor')
  },
  computed: {
    ...mapGetters({
      isLoading: 'isOccurrencesLoading'
    })
  }
}
</script>

<style lang="scss" scoped>
.omnichannel-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;

  .omnichannel-container__occurrences {
    flex: 1;
    overflow: hidden;
  }
}
</style>

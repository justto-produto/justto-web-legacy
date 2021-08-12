<template>
  <section
    v-if="isInNegotiation"
    v-loading="isLoading"
    class="omnichannel-container"
  >
    <Occurrences class="omnichannel-container__occurrences" />
    <Editor
      v-if="!hideEditor"
      class="omnichannel-container__editor"
    />
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
  props: {
    hideEditor: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'isOccurrencesLoading'
    }),

    isInNegotiation() {
      return this.$route.name === 'ticket'
    }
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
    overflow-x: hidden;
  }
}
</style>

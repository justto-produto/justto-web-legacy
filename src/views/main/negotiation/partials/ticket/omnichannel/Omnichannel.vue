<template>
  <section
    v-if="isInNegotiation"
    v-loading="isLoading"
    class="omnichannel-container"
  >
    <configuration-popover class="omnichannel-container__configuration" />
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
    ConfigurationPopover: () => import('./partial/ConfigurationPopover'),
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
      return ['ticket', 'dispute'].includes(this.$route.name)
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
  position: relative;

  .omnichannel-container__occurrences {
    flex: 1;
    overflow-x: hidden;
  }

  .omnichannel-container__configuration {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    margin: 8px 12px 0 0;
    cursor: pointer;
  }
}
</style>

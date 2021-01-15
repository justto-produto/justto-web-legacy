<template>
  <section class="omnichannel-container">
    <occurrences class="omnichannel-container__occurrences" />
    <editor
      class="omnichannel-container__editor"
      :class="`editor-size-${editorSize}`"
      :size.sync="editorSize"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import EDITOR_TABS from '@/constants/editor'

export default {
  name: 'Omnichannel',
  components: {
    Occurrences: () => import('./Occurrences'),
    Editor: () => import('./Editor')
  },
  data() {
    return {
      editorSize: 'NORMAL'
    }
  },

  computed: {
    ...mapGetters({
      activeTab: 'getActiveTab'
    })
  },

  watch: {
    activeTab() {
      if (this.activeTab === EDITOR_TABS.OCCURRENCES) {
        this.editorSize = 'HIDDEN'
      } else {
        this.editorSize = 'NORMAL'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.omnichannel-container {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  max-height: 100%;

  .omnichannel-container__editor {
    border-top: 2px solid whitesmoke;
  }

  .editor-size-NORMAL {
    height: 40%;
  }

  .editor-size-HIDDEN {
    height: 5%;
  }
}
</style>

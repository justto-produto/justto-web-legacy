<template>
  <pre>{{ disputes }}</pre>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    tab: {
      type: String,
      default: 'running'
    }
  },

  computed: {
    ...mapGetters({
      disputes: 'disputes'
    })
  }
}
</script>

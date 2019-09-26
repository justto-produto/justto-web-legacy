<template lang="html">
  <ul v-loading="loading" v-chat-scroll="{always: false, smooth: true, scrollonremoved: true }" class="dispute-view-occurrences">
    <li
      v-for="(occurrence, index) in occurrences"
      :key="index + new Date().getTime()"
      class="dispute-view-occurrences__occurrence">
      <el-card v-if="occurrence.type === 'NOTE'" shadow="never" class="dispute-view-occurrences__log el-card--bg-warning">
        {{ occurrence.description.replace('.', ':') }}
      </el-card>
    </li>
    <li v-if="!loading && !occurrences.length" class="dispute-view-occurrences__empty">
      <jus-icon icon="empty-screen-filter" />
      Não foram encontradas notas.
    </li>
  </ul>
</template>

<script>
export default {
  name: 'DisputeNotes',
  props: {
    disputeId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    occurrences () {
      return this.$store.getters.occurrences.reverse()
    }
  },
  mounted () {
    this.$store.commit('clearDisputeOccurrences')
    setTimeout(() => {
      this.$store.dispatch('getDisputeNotes', this.disputeId).then(() => {
        this.loading = false
      })
    }, 200)
  },
  methods: {
    buildContent (occurrence) {
      return occurrence.description
    }
  }
}
</script>

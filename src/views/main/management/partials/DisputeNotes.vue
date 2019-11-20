<template lang="html">
  <ul v-loading="loading" v-chat-scroll="{always: false, smooth: true, scrollonremoved: true }" class="dispute-view-occurrences">
    <li
      v-for="(occurrence, index) in occurrences"
      :key="index + new Date().getTime()"
      class="dispute-view-occurrences__occurrence">
      <div v-if="occurrence.type === 'NOTE'" shadow="never" class="OUTBOUND dispute-view-occurrences__interaction dispute-view-occurrences__log el-card--bg-warning" data-testid="message-box">
        <div class="dispute-view-occurrences__card-box">
          <el-card class="dispute-view-occurrences__card" shadow="never">
            <div slot="header">
              <i class="el-icon-notebook-2 icon-slot"></i>
              <span v-html="buildTitle(occurrence)" />
            </div>
            <span v-html="buildContent(occurrence)" />
          </el-card>
          <div class="OUTBOUND dispute-view-occurrences__card-info">
            <span v-html="buildHour(occurrence)" />
            <div>•</div>
            <span v-html="buildSender(occurrence)" />
          </div>
        </div>
      </div>
    </li>
    <li v-if="!loading && !occurrences.length" class="dispute-view-occurrences__empty" data-testid="note-empty">
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
      return this.$store.getters.occurrences
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
      let descriptionDivided = occurrence.description.replace('.', '|').split('|')
      return descriptionDivided[1]
    },
    buildTitle (occurrence) {
      let descriptionDivided = occurrence.description.replace('.', '|').split('|')
      return descriptionDivided[0]
    },
    buildSender (occurrence) {
      // let descriptionDivided = occurrence.description.replace('.', '|').split('|')
      // return 'Adicionado por ' + descriptionDivided[0]
      return 'Adicionado por Lucas Israel'
    },
    buildHour (occurrence) {
      if (occurrence.executionDateTime) {
        return this.$moment(occurrence.executionDateTime.dateTime).format('HH:mm')
      }
      return this.$moment(occurrence.createAt.dateTime).format('HH:mm')
    },
  }
}
</script>

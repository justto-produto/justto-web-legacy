<template lang="html">
  <ul
    v-loading="loading"
    v-chat-scroll="{always: false, smooth: true, scrollonremoved: true }"
    class="dispute-view-occurrences">
    <li
      v-for="(occurrence, index) in occurrences"
      :key="index + new Date().getTime()"
      class="dispute-view-occurrences__occurrence">
      <div
        v-if="occurrence.type === 'NOTE'"
        shadow="never"
        class="dispute-view-occurrences__note"
        data-testid="message-box">
        <div class="dispute-view-occurrences__card-box">
          <el-card
            v-loading="noteLoading"
            class="dispute-view-occurrences__card dispute-view-occurrences__card--note"
            shadow="never">
            <div slot="header" class="dispute-view-occurrences__card--note-header">
              <i class="el-icon-edit" @click="openEditDialog(occurrence)" />
              <i class="el-icon-delete" @click="removeNote(occurrence)" />
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

      <el-dialog :visible.sync="editDialog" width="60%" title="Editar Nota" append-to-body>
        <el-input v-model="editingNoteContent" :disabled="editDialogLoading" class="dispute-view-occurrences__textarea" type="textarea" />
        <span slot="footer" class="dialog-footer">
          <el-button :disabled="editDialogLoading" plain @click="editDialog = false">Cancelar</el-button>
          <el-button v-loading="editDialogLoading" type="primary" @click="editNote(editingNoteContent)">Editar nota</el-button>
        </span>
      </el-dialog>

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
      loading: true,
      noteLoading: false,
      editDialog: false,
      editDialogLoading: false,
      editingNoteContent: {}
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
    splitText (description) {
      return description.replace(' adicionou uma nota.', '~|~').split('~|~')
    },
    buildContent (occurrence) {
      return this.splitText(occurrence.description)[1]
    },
    buildSender (occurrence) {
      return 'Adicionado por ' + this.splitText(occurrence.description)[0]
    },
    buildHour (occurrence) {
      if (occurrence.executionDateTime) {
        return this.$moment(occurrence.executionDateTime.dateTime).format('DD/MM/YY [às] HH:mm')
      }
      return this.$moment(occurrence.createAt.dateTime).format('DD/MM/YY [às] HH:mm')
    },
    openEditDialog (occurrence) {
      this.editingNoteContent = this.buildContent(occurrence)
      this.editDialog = true
    },
    editNote (noteContent) {
      this.editDialogLoading = true
      this.$store.dispatch('editDisputeNote', noteContent)
        .then(() => {
          this.editDialog = false
          this.$jusNotification({
            title: 'Yay!',
            message: 'Nota editada com sucesso.',
            type: 'success'
          })
        }).catch(() => {
          this.$jusNotification({ type: 'error' })
        }).finally(() => {
          this.editDialogLoading = false
        })
    },
    removeNote (occurrence) {
      this.$confirm('Esta nota será deletada permanentemente. Deseja continuar?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then(() => {
        let noteId = occurrence.id
        this.noteLoading = true
        this.$store.dispatch('deleteDisputeNote', noteId).then(() => {
          window.analytics.track('Nota removida')
          this.$jusNotification({
            title: 'Yay!',
            message: 'Nota removida com sucesso.',
            type: 'success'
          })
        }).catch(() => {
          this.$jusNotification({ type: 'error' })
        }).finally(() => {
          this.noteLoading = false
        })
      })
    }
  }
}
</script>

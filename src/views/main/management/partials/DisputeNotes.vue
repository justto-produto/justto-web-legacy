<template lang="html">
  <ul
    v-loading="loading"
    v-chat-scroll="{always: false, smooth: true, scrollonremoved: true }"
    class="dispute-view-occurrences"
  >
    <li
      v-for="(occurrence, index) in occurrences"
      :key="index + new Date().getTime()"
      class="dispute-view-occurrences__occurrence"
    >
      <div
        v-if="occurrence.type === 'NOTE'"
        shadow="never"
        class="dispute-view-occurrences__note"
        data-testid="message-box"
      >
        <div class="dispute-view-occurrences__card-box">
          <el-card
            v-loading="noteLoading === occurrence.id"
            class="dispute-view-occurrences__card dispute-view-occurrences__card--note"
            shadow="never"
          >
            <div
              slot="header"
              class="dispute-view-occurrences__card--note-header"
            >
              <i
                class="el-icon-edit"
                @click="openEditDialog(occurrence)"
              />
              <i
                class="el-icon-delete"
                @click="removeNote(occurrence, index)"
              />
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
    <el-dialog
      :visible.sync="editDialog"
      width="60%"
      title="Editar Nota"
      append-to-body
    >
      <el-input
        v-model="newNoteContent"
        :disabled="editDialogLoading"
        class="dispute-view-occurrences__textarea"
        type="textarea"
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :disabled="editDialogLoading"
          plain
          @click="editDialog = false"
        >
          Cancelar
        </el-button>
        <el-button
          v-loading="editDialogLoading"
          :disabled="!newNoteContent.trim()"
          type="primary"
          @click="editNote(newNoteContent)"
        >
          Editar nota
        </el-button>
      </span>
    </el-dialog>
    <li
      v-if="!loading && !occurrences.length"
      class="dispute-view-occurrences__empty"
      data-testid="note-empty"
    >
      <jus-icon icon="empty-screen-filter" />
      Não foram encontradas notas.
    </li>
  </ul>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'DisputeNotes',
  props: {
    disputeId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      noteLoading: 0,
      editDialog: false,
      editDialogLoading: false,
      newNoteContent: ''
    }
  },
  computed: {
    ...mapGetters([
      'loading',
      'occurrences'
    ])
  },
  watch: {
    disputeId() {
      if (this.disputeId) {
        console.log(this.disputeId)
        this.init()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions(['getDisputeNotes']),
    ...mapMutations(['clearDisputeOccurrences']),

    init() {
      this.clearDisputeOccurrences()
      setTimeout(() => {
        this.getDisputeNotes(this.disputeId)
      }, 200)
    },

    splitModified(description) {
      return description.split(' modificou uma nota. ')
    },
    splitNew(description) {
      return description.split(' adicionou uma nota. ')
    },
    buildContent(occurrence) {
      if (occurrence.updateAt) {
        return this.splitModified(occurrence.description)[1]
      }
      return this.splitNew(occurrence.description)[1]
    },
    buildSender(occurrence) {
      if (occurrence.updateAt) {
        return 'Modificado por ' + this.splitModified(occurrence.description)[0]
      }
      return 'Adicionado por ' + this.splitNew(occurrence.description)[0]
    },
    buildHour(occurrence) {
      if (occurrence.updateAt) {
        return this.$moment(occurrence.updateAt.dateTime).format('DD/MM/YY [às] HH:mm')
      } else if (occurrence.executionDateTime) {
        return this.$moment(occurrence.executionDateTime.dateTime).format('DD/MM/YY [às] HH:mm')
      }
      return this.$moment(occurrence.createAt.dateTime).format('DD/MM/YY [às] HH:mm')
    },
    openEditDialog(occurrence) {
      this.activeOccurrence = occurrence
      this.newNoteContent = this.buildContent(occurrence)
      this.editDialog = true
    },
    editNote(newNoteContent) {
      this.editDialogLoading = true
      this.$store.dispatch('editDisputeNote', {
        newNoteContent: newNoteContent,
        activeOccurrence: this.activeOccurrence
      })
        .then(() => {
          this.editDialog = false
          this.$jusNotification({
            title: 'Yay!',
            message: 'Nota editada com sucesso.',
            type: 'success'
          })
        }).catch(error => {
          this.$jusNotification({ error })
        }).finally(() => {
          this.editDialogLoading = false
        })
    },
    removeNote(occurrence, index) {
      this.$confirm('Esta nota será deletada permanentemente. Deseja continuar?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancelar',
        type: 'warning',
        cancelButtonClass: 'is-plain'
      }).then(() => {
        const noteId = occurrence.id
        this.noteLoading = occurrence.id
        this.$store.dispatch('deleteDisputeNote', noteId).then(() => {
          // SEGMENT TRACK
          this.$jusSegment('Nota removida')
          this.occurrences.splice(index, 1)
          this.$jusNotification({
            title: 'Yay!',
            message: 'Nota removida com sucesso.',
            type: 'success'
          })
        }).catch(error => {
          this.$jusNotification({ error })
        }).finally(() => {
          this.noteLoading = 0
        })
      })
    }
  }
}
</script>

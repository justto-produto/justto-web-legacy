<template>
  <article>
    <div
      v-loading="isLoadingNote"
      class="note-container"
    >
      <div class="note-container__header">
        <div>{{ owner }}</div>
        <span>
          <i
            class="note-container__header-icon el-icon-edit"
            @click="openEditDialog(occurrence)"
          />
          <i
            class="note-container__header-icon el-icon-delete"
            @click="removeNote(occurrence, index)"
          />
        </span>
      </div>
      <div class="note-container__body">
        <span v-html="description" />
        <span class="note-container__body-time">
          {{ time | moment('HH:mm') }}
        </span>
      </div>
    </div>

    <DialogEditor
      ref="dialogEditor"
      title="Editar nota"
      @confirm="saveNote($event)"
    />
  </article>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Note',
  components: {
    DialogEditor: () => import('@/components/dialogs/DialogEditor')
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    isLoadingNote: false
  }),
  computed: {
    time() {
      const { createAt, updateAt } = this.value
      return updateAt ? updateAt.dateTime : createAt.dateTime
    },
    owner() {
      const { CREATED_BY, UPDATED_BY } = this.value.properties
      const name = this.$options.filters.resumedName(UPDATED_BY || CREATED_BY)

      return UPDATED_BY
        ? `Modificada por ${name}`
        : `Adicionada por ${name}`
    },
    description() {
      return this.value.description + '<span style="display: inline-block; width: 36px" />'
    }
  },
  methods: {
    ...mapActions([
      'deleteTicketNote',
      'saveTicketNote'
    ]),

    concludeAction(message, disputeId) {
      this.$jusNotification({
        title: 'Yay!',
        message: `${message} com sucesso.`,
        type: 'success'
      })
      this.$jusSegment(message, { disputeId })
    },

    openEditDialog() {
      this.$refs.dialogEditor.openDialogEditor(this.value.description)
    },

    saveNote(note) {
      const { disputeId, id } = this.value

      this.isLoadingNote = true
      this.saveTicketNote({ disputeId, id, note })
        .then(() => this.concludeAction('Nota editada', disputeId))
        .catch(error => this.$jusNotification({ error }))
        .finally(() => {
          this.isLoadingNote = false
          this.closeEditorDialog()
        })
    },

    removeNote() {
      const message = 'Esta nota será apagada permanentemente. Deseja continuar?'
      const title = 'Apagar nota'
      const options = {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        cancelButtonClass: 'is-plain',
        dangerouslyUseHTMLString: true,
        showClose: false
      }

      this.$confirm(message, title, options)
        .then(() => {
          const { disputeId, id } = this.value

          this.isLoadingNote = true
          this.deleteTicketNote(id)
            .then(() => this.concludeAction('Nota apagada', disputeId))
            .catch(error => this.$jusNotification({ error }))
            .finally(() => (this.isLoadingNote = false))
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

article {
  display: flex;
  flex-direction: row-reverse;
  margin: 10px 24px 0px;

  .note-container {
    .note-container__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 12px;
      background-color: #efe7ff;

      .note-container__header-icon {
        margin-left: 6px;
        cursor: pointer;
        &:hover { color: $--color-text-regular; }
      }
    }

    .note-container__body {
      background-color: #f6f1ff;
      padding: 12px;
      position: relative;

      .note-container__body-time {
        position: absolute;
        right: 12px;
        bottom: 6px;
        font-size: 13px;
        color: $--color-text-secondary;
      }
    }
  }
}
</style>
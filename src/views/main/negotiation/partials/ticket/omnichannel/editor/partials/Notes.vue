<template>
  <section
    id="notesTabEditorOmnichannelNegotiation"
    class="notes-container"
  >
    <ckeditor
      v-show="editorReady"
      ref="noteEditor"
      :value="editorText"
      class="notes-container__editor"
      :config="config"
      @ready="setEditorReady(true)"
      @input="setNoteEditorText"
    />
    <span class="notes-container__button">
      <el-button
        type="primary"
        size="small"
        :disabled="!enableButton"
        @click="send"
      >
        <span v-if="!localLoading">Salvar nota</span>
        <i
          v-else
          class="el-icon-loading"
        />
      </el-button>
    </span>
  </section>
</template>

<script>
import events from '@/constants/negotiationEvents'
import { eventBus } from '@/utils'
import CKEditor from 'ckeditor4-vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    ckeditor: CKEditor.component
  },

  data: () => ({
    localLoading: false
  }),

  computed: {
    ...mapGetters({
      getEditorReady: 'getEditorReady',
      editorConfig: 'getEditorConfig',
      editorText: 'getNoteEditorText'
    }),

    enableButton() {
      return this.editorReady && !this.localLoading && this.editorText.length
    },

    editorReady: {
      get() {
        return this.getEditorReady
      },
      set(value) {
        this.setEditorReady(value)
      }
    },

    config() {
      return {
        parent: 'note-editor',
        ...this.editorConfig
      }
    },

    editor() {
      return Object.values(window.CKEDITOR.instances).find(({ config }) => config.parent === this.config.parent)
    }
  },

  beforeDestroy() {
    eventBus.$off(events.EDITOR_FOCUS.callback, this.focusOnEditor)
    this.destroyEditor()
    if (this.editor) {
      this.editor.destroy()
    }
  },

  mounted() {
    eventBus.$on(events.EDITOR_FOCUS.callback, this.focusOnEditor)
  },

  methods: {
    ...mapActions([
      'setEditorReady',
      'sendDisputeNote',
      'setNoteEditorText'
    ]),

    send(_event) {
      const { id } = this.$route.params

      this.localLoading = true
      this.sendDisputeNote({
        disputeId: id,
        note: this.editorText
      }).then(() => this.$jusNotification({
        title: 'Yay!',
        message: 'Nota gravada com sucesso.',
        type: 'success'
      })).catch(error => this.$jusNotification({
        error
      })).finally(() => {
        this.localLoading = false
      })
    },

    destroyEditor() {
      this.editorReady = false
      this.editor.destroy()
    },

    focusOnEditor() {
      this.editor.focus()
    }
  }

}
</script>

<style lang="scss" scoped>
.notes-container {
  padding: 6px;
  display: flex;
  flex-direction: column;

  .notes-container__editor {
    margin: 0px;
  }

  .notes-container__button {
    display: flex;
    justify-content: flex-end;
    margin-top: 6px;
  }
}

@media (max-width: 900px) {
  .notes-container {
    padding: 0;

    .notes-container__editor {
      margin: 6px;
    }

    .notes-container__button {
      .el-button {
        width: 100%;
        border-radius: 0;
      }
    }
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.notes-container {
  .cke_top { border: none; }

  .cke.cke_chrome {
    border: 2px solid $--light-gray;
    border-radius: 6px;
  }
}
</style>

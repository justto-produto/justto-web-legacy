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
      :config="editorConfig"
      @ready="setEditorReady(true)"
      @input="setNoteEditorText"
    />
    <span class="notes-container__button">
      <el-button
        type="primary"
        size="small"
      >
        Salvar nota
      </el-button>
    </span>
  </section>
</template>

<script>
import CKEditor from 'ckeditor4-vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    ckeditor: CKEditor.component
  },
  computed: {
    ...mapGetters({
      getEditorReady: 'getEditorReady',
      editorConfig: 'getEditorConfig',
      editorText: 'getNoteEditorText'
    }),

    editorReady: {
      get() {
        return this.getEditorReady
      },
      set(value) {
        this.setEditorReady(value)
      }
    }
  },
  beforeDestroy() {
    this.destroyEditor()
  },
  methods: {
    ...mapActions([
      'setEditorReady',
      'setNoteEditorText'
    ]),

    destroyEditor() {
      this.editorReady = false
      for (const instance of Object.values(window.CKEDITOR.instances)) {
        instance.destroy()
      }
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

<template>
  <section
    id="notesTabEditorOmnichannelNegotiation"
    class="notes-container">
    <ckeditor
      v-show="editorReady"
      ref="noteEditor"
      :value="editorText"
      class="notes-container__editor"
      :config="editorConfig"
      @ready="setEditorReady(true)"
      @input="setNoteEditorText"
    />
    <span class="notes-container__send-message-button">
      <el-button
        type="primary"
        size="mini"
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
  data() {
    return { }
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
    },
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

<style lang="scss">
.notes-container {
  padding: 6px;

  .cke_top {
    border: none;
  }

  .cke.cke_chrome {
    border: solid 2px whitesmoke;
    margin: 0px;
    border-radius: 6px;
  }
}
</style>

<style lang="scss" scoped>
.notes-container {
  background-color: transparent;

  .notes-container__send-message-button {
    margin-top: 6px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

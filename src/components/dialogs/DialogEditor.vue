<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :custom-class="customClass"
    :before-close="handleClose"
    :width="width"
    destroy-on-close
    append-to-body
    class="dialog-editor"
  >
    <div
      slot="title"
      class="dialog-title"
    >
      <span v-if="title.length">
        {{ title }}
      </span>
      <slot
        v-else
        name="title"
      />
    </div>

    <ckeditor
      v-if="!textOnly && dialogVisible"
      v-show="editorReady"
      ref="templateEditor"
      class="reply-editor__editor"
      :value="editorModel"
      :config="editorConfig"
      @input="setModel"
      @ready="ready()"
    />

    <el-input
      v-else
      :value="editorModel"
      :rows="18"
      type="textarea"
      resize="none"
      @input="setModel"
    />

    <div slot="footer">
      <el-button
        plain
        @click="handleCancel"
      >
        {{ buttonCancel }}
      </el-button>
      <el-button
        type="primary"
        @click="handleConfirm"
      >
        {{ buttonConfirm }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import CKEditor from 'ckeditor4-vue'

export default {
  name: 'DialogEditor',
  components: {
    ckeditor: CKEditor.component
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    textOnly: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '50%'
    },
    buttonConfirm: {
      type: String,
      default: 'Salvar'
    },
    buttonCancel: {
      type: String,
      default: 'Cancelar'
    }
  },

  data: () => ({
    dialogVisible: false,
    editorReady: false,
    editorModel: ''
  }),

  computed: {
    editorConfig() {
      return {
        height: '50vh',
        parent: 'dialog-editor',
        toolbarGroups: [
          { name: 'document', groups: ['mode', 'document', 'doctools'] },
          { name: 'clipboard', groups: ['clipboard', 'undo'] },
          { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
          { name: 'forms', groups: ['forms'] },
          { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
          { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
          { name: 'links', groups: ['links'] },
          { name: 'insert', groups: ['insert'] },
          { name: 'styles', groups: ['styles'] },
          { name: 'colors', groups: ['colors'] },
          { name: 'tools', groups: ['tools'] },
          { name: 'others', groups: ['others'] },
          { name: 'about', groups: ['about'] }
        ],
        removeButtons: 'Save,NewPage,ExportPdf,Preview,Print,PasteFromWord,PasteText,Paste,Redo,Copy,Templates,Cut,Undo,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Superscript,Subscript,CopyFormatting,Indent,Outdent,Styles,TextColor,BGColor,Maximize,ShowBlocks,About,Format,Font,FontSize,Iframe,PageBreak,SpecialChar,Smiley,HorizontalRule,Table,Flash,Image,Unlink,Link,Anchor,Language,BidiRtl,BidiLtr,JustifyBlock,JustifyRight,JustifyCenter,JustifyLeft,CreateDiv',
        removePlugins: 'elementspath,resize'
      }
    }
  },

  beforeDestroy() {
    this.destroyEditor()
  },

  methods: {
    openDialogEditor(model) {
      this.editorModel = model
      this.dialogVisible = true
    },

    ready() {
      console.log('Editor está pronto.')
      this.editorReady = true
    },

    handleClose(done) {
      this.destroyEditor()
      done()
    },

    destroyEditor() {
      this.dialogVisible = false
      this.editorReady = false
      for (const instance of Object.values(window.CKEDITOR.instances)) {
        if (instance.config.parent === this.editorConfig.parent) {
          instance.destroy()
        }
      }
    },

    setModel(text) {
      this.editorModel = text
      this.$emit('input', text)
    },

    handleConfirm() {
      this.$emit('confirm', this.editorModel)
      this.destroyEditor()
    },

    handleCancel() {
      this.$emit('cancel', this.editorModel)
      this.destroyEditor()
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.dialog-editor {
  .cke_top { border: none; }

  .cke.cke_chrome {
    border: 2px solid $--light-gray;
    border-radius: 6px;
  }
}
</style>

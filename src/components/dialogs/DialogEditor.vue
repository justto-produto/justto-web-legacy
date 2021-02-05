<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    class="dialog-editor"
  >
    <ckeditor
      ref="templateEditor"
      v-model="editorModel"
      class="reply-editor__editor"
      :config="editorConfig"
    />
    <div slot="footer">
      <el-button
        plain
        @click="handleCancel"
      >
        Cancelar
      </el-button>
      <el-button
        type="primary"
        @click="handleConfirm"
      >
        Salvar
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
    }
  },
  data: () => ({
    dialogVisible: false,
    editorModel: ''
  }),
  computed: {
    editorConfig() {
      return {
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
  methods: {
    openDialogEditor(model) {
      this.editorModel = model
      this.dialogVisible = true
    },

    handleConfirm() {
      this.dialogVisible = false
      this.$emit('confirm', this.editorModel)
    },

    handleCancel() {
      this.dialogVisible = false
      this.$emit('cancel', this.editorModel)
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

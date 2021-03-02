<template>
  <div class="reply-editor__container">
    <div class="reply-editor__body">
      <el-input v-model="state.title" />
      <ckeditor
        v-if="state.body"
        v-show="editorRedy"
        ref="templateEditor"
        v-model="state.body"
        class="reply-editor__editor"
        :config="editorConfig"
        @ready="editorIsRedy()"
      />
      <el-container
        v-if="!editorRedy"
        v-loading="true"
        style="width: 100%; height: 40vh;"
      />
    </div>
    <div class="reply-editor__footer">
      <el-row
        class="reply-editor__footer-row"
        type="flex"
        justify="end"
        :gutter="20"
      >
        <el-col
          :span="10"
          class="reply-editor__footer-column"
        >
          <el-button @click="cancel()">
            Cancelar
          </el-button>
          <el-button
            type="primary"
            :disabled="loading"
            @click="save()"
          >
            Salvar
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CKEditor from 'ckeditor4-vue'

export default {
  components: {
    ckeditor: CKEditor.component
  },
  props: {
    template: {
      type: Object,
      required: true
    },
    disputeId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      html: '',
      editorRedy: false,
      editorConfig: {
        parent: 'reply-editor',
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
      },
      state: { title: '', body: '' }
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  watch: {
    template() {
      this.state = { ...this.template, body: this.formatBody() }
    }
  },
  mounted() {
    this.editorRedy = false
    this.state = { ...this.template, body: this.formatBody() }
  },
  beforeDestroy() {
    this.destroyEditor()
    this.state = { title: '', body: '' }
  },
  methods: {
    ...mapActions([
      'editTemplate',
      'showLoading',
      'hideLoading'
    ]),

    editorIsRedy() {
      setTimeout(() => {
        this.editorRedy = true
      }, 250)
    },

    destroyEditor() {
      this.editorRedy = false
      for (const instance of Object.values(window.CKEDITOR.instances)) {
        if (instance.config.parent === this.editorConfig.parent) {
          instance.destroy()
        }
      }
    },

    cancel() {
      this.destroyEditor()
      this.$emit('cancel')
      this.hideLoading()
    },

    save() {
      this.showLoading()
      this.editTemplate({
        template: this.state,
        disputeId: this.disputeId
      }).then(res => {
        this.destroyEditor()
        this.$emit('input', res)
        this.$emit('update')
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(this.cancel)
    },

    formatBody() {
      const { body } = this.template
      if (body) {
        const start = body.indexOf('<body>') + 6
        const end = body.indexOf('</body>') - 7
        if (start > 5 && end > 0) {
          return body.substring(start, end).trim()
        }
      }
      return body
    }
  }
}
</script>

<style lang="scss" scoped>
.reply-editor__container {
  margin: 16px 0px;
  padding: 16px 0px;

  .reply-editor__body {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
  }

  .reply-editor__footer {
    margin-top: 16px;

    .reply-editor__footer-row {
      .reply-editor__footer-column {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>

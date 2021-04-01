<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :custom-class="customClass"
    :before-close="handleClose"
    :fullscreen="fullscreen"
    :width="width"
    destroy-on-close
    append-to-body
    class="dialog-editor jus-ckeditor__parent"
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
      ref="templateEditor"
      class="reply-editor__editor"
      type="classic"
      :editor="editor"
      :value="editorModel"
      :config="editorConfig"
      @input="setModel"
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
import ckeditor from '@/utils/mixins/ckeditor'

export default {
  name: 'DialogEditor',

  mixins: [ckeditor],

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
    fullscreen: {
      type: Boolean,
      default: false
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
    editorReady: true,
    editorModel: ''
  }),

  computed: {
    editorInstance() {
      return this.$refs.templateEditor
    }
  },

  methods: {
    openDialogEditor(model) {
      this.editorModel = model
      this.dialogVisible = true
    },

    ready() {
      this.editorReady = true
    },

    handleClose(done) {
      this.dialogVisible = false
      done()
    },

    setModel(text) {
      this.editorModel = text
      this.$emit('input', text)
    },

    handleConfirm() {
      this.$emit('confirm', this.editorModel)
    },

    handleCancel() {
      this.$emit('cancel', this.editorModel)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.jus-ckeditor__parent {
  .negotiator-fullscreen-editor {
    .el-dialog__body {
      .ck-editor {
        .ck-editor__main {
          .ck-editor__editable {
            height: 50vh;
          }
        }
      }
    }
  }
}

.dialog-editor {
  .cke_top { border: none; }

  .cke.cke_chrome {
    border: 2px solid $--light-gray;
    border-radius: 6px;
  }
}
</style>

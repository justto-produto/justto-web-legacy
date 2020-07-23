<template>
  <div class="communication-editor">
    <el-dialog
      v-if="visible"
      :visible.sync="isVisible"
      :title="communication.name"
      class="communication-editor__dialog"
      width="750px"
    >
      <div class="communication-editor__data-area">
        <el-input
          v-model="communication.title"
          @input="autosave"
          placeholder="Título da mensagem"
        />

        <div class="communication-editor__editor-fieldset show-toolbar">
          <quill-editor
            ref="messageEditor"
            v-model="communication.body"
            :options="editorOptions"
            class="communication-editor__quill"
            @input="autosave"
          />
        </div>
      </div>

      <div>
        <JusVariablesCard
          v-if="variables"
          :variables="variables"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'CommunicationEditor',
  components: {
    JusVariablesCard: () => import('@/components/layouts/JusVariablesCard'),
    quillEditor,
  },
  props: {
    communicationTemplate: {
      type: Object,
      default: null,
    },
    communicationId: {
      type: Number,
      required: true,
    },
    strategyId: {
      type: Number,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      communication: {},
      editorOptions: {
        placeholder: 'Digite a mensagem aqui!',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote'],
          ],
        },
      },
      saveDebounce: () => {},
    }
  },
  computed: {
    ...mapGetters({
      variables: 'getAvaliableVariablesToTemplate',
    }),

    htmlMessage() {
      return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body>
            ${this.communication.body}
          </body>
        </html>`
    },

    isVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      },
    },
  },
  watch: {
    communicationTemplate(current) {
      if (current) {
        this.communication = current
      }
    },
  },
  methods: {
    ...mapActions(['changeCommunicationTemplate']),

    autosave({ _, html, text }) {
      clearTimeout(this.saveDebounce)
      this.saveDebounce = setTimeout(() => {
        const communicationCopy = Object.assign({}, this.communication)
        communicationCopy.body = this.htmlMessage
        this.changeCommunicationTemplate({
          template: communicationCopy,
          communicationId: this.communicationId,
          strategyId: this.strategyId,
        })
      }, 3000)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.communication-editor {
  display: flex;

  .communication-editor__data-area {
    width: 100%;

    .communication-editor__editor-fieldset {
      border: 1px solid #ccc;
      border-radius: 4px;
      width: 100%;
      height: calc(100% - 50px);
      margin-top: 12px;

      .communication-editor__quill {
        padding: 16px;
      }
    }
  }

  .communication-editor__resize-icon {
    position: absolute;
    color: $--color-text-secondary;
    font-size: 16px;
    top: 31px;
    right: 53px;
    cursor: pointer;
    &:hover {
      color: $--color-primary
    }
  }
}

</style>

<style lang="scss">
.communication-editor {
  .communication-editor__dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 10px;
    .el-dialog__body {
      display: flex;
      height: 100%;
    }

    .el-dialog {
      width: 100% !important;
      .el-dialog__body {
        height: calc(100vh - 90px);
      }
    }
  }
}

.show-toolbar {
  .ql-toolbar {
    display: inherit;
  }
}
</style>

<template>
  <div class="communication-editor">
    <el-dialog
      v-if="visible"
      :visible.sync="isVisible"
      class="communication-editor__dialog"
    >
      <div slot="title">
        <span class="el-dialog__title">
          {{ communication.name }}
          <span class="communication-editor__status">{{ savedAt }}</span>
        </span>
      </div>

      <div class="communication-editor__data-area">
        <div class="communication-editor__header">
          <div class="communication-editor__header-item">
            <span class="communication-editor__input-label">Assunto da mensagem: </span>
            <el-input
              v-model="template.title"
              placeholder="Ex. Sobre disputa XPTO"
            />
          </div>

          <div class="communication-editor__header-item">
            <span class="communication-editor__input-label">Destinatários: </span>
            <div class="communication-editor__header-item-options">
              <span
                :class="{ 'is-inactive-recipient': !communication.recipients.includes('PARTY') }"
                class="communication-editor__option-party"
                @click="handleCommunicationRecipient(communication, 'PARTY')"
              >
                <i class="el-icon-user-solid" /> Autor
              </span>
              <span
                :class="{ 'is-inactive-recipient': !communication.recipients.includes('LAWYER') }"
                class="communication-editor__option-party"
                @click="handleCommunicationRecipient(communication, 'LAWYER')"
              >
                <i class="el-icon-s-custom" /> Advogado
              </span>
            </div>
          </div>

          <div class="communication-editor__header-item">
            <span class="communication-editor__input-label">Gatilho: </span>
            <span class="communication-editor__header-item-options">
              {{ $t(`triggers.${communication.triggerType}`).toUpperCase() }}
            </span>
          </div>
        </div>

        <div
          v-if="template.contentType === 'TEXT'"
          class="communication-editor__editor-fieldset show-toolbar"
        >
          <el-input
            v-model="template.body"
            type="textarea"
            show-word-limit
            placeholder="Edite seu SMS aqui!"
            class="communication-editor__textarea"
          />
        </div>

        <div
          v-else
          ref="editor-fieldset"
          class="communication-editor__editor-fieldset show-toolbar"
        >
          <!-- <froala
            id="edit"
            v-model="template.body"
            :tag="'textarea'"
            :config="config"
          /> -->
          <ckeditor
            v-show="editorRedy"
            ref="edit"
            v-model="template.body"
            class="communication-editor__editor"
            tag-name="textarea"
            :config="editorConfig"
            @ready="editorRedy = true"
            @namespaceloaded="onNamespaceLoaded"
          />
        </div>
      </div>

      <div class="communication-editor__right-area">
        <JusVariablesCard
          :variables="variables"
          class="communication-editor__variables-card"
        />
        <div class="communication-editor__footer">
          <el-button
            plain
            class="communication-editor__footer-button"
            @click="isVisible = false"
          >
            Cancelar
          </el-button>
          <el-button
            type="primary"
            class="communication-editor__footer-button"
            @click="template.contentType === 'HTML' ? setHtmlHeader(template.body) : saveTemplate()"
          >
            Salvar
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import CKEditor from 'ckeditor4-vue'

export default {
  name: 'CommunicationEditor',
  components: {
    ckeditor: CKEditor.component,
    JusVariablesCard: () => import('@/components/layouts/JusVariablesCard')
  },
  props: {
    templateToEdit: {
      type: Object,
      default: null
    },
    communication: {
      type: Object,
      required: true
    },
    strategyId: {
      type: Number,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      height: 400,
      template: {},
      editorDataFroala: '',
      config: {
        heightMax: 500
      },
      editorRedy: false
    }
  },
  computed: {
    ...mapGetters({
      variables: 'getAvaliableVariablesToTemplate'
    }),
    savedAt() {
      const lastUpdate = this.template.updatedAt
      return `Template salvo ${lastUpdate && lastUpdate.dateTime ? this.$moment(lastUpdate.dateTime).from(new Date()) : ''}`
    },
    isVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    },
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
        // removeButtons: 'Save,NewPage,ExportPdf,Preview,Print,PasteFromWord,PasteText,Paste,Redo,Copy,Templates,Cut,Undo,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Superscript,Subscript,CopyFormatting,Indent,Outdent,Styles,TextColor,BGColor,Maximize,ShowBlocks,About,Format,Font,FontSize,Iframe,PageBreak,SpecialChar,Smiley,HorizontalRule,Table,Flash,Image,Unlink,Link,Anchor,Language,BidiRtl,BidiLtr,JustifyBlock,JustifyRight,JustifyCenter,JustifyLeft,CreateDiv',
        removePlugins: 'elementspath,resize'
      }
    }
  },
  watch: {
    templateToEdit(current) {
      if (current) {
        this.template = current
        if (!this.template.title) this.template.title = 'Mensagem da Justto'
      }
    },
    editorRedy() {
      this.$refs.edit.config.height = this.$refs['editor-fieldset'].clientHeight
      this.$forceUpdate()
    }
  },
  methods: {
    ...mapActions(['changeCommunicationTemplate']),

    onNamespaceLoaded(CKEDITOR) {
      // Add external `placeholder` plugin which will be available for each
      // editor instance on the page.
      CKEDITOR.plugins.addExternal('autogrow', '../../../plugins/autogrow', 'plugin.js')
      // CKEDITOR.config.autoGrow_onStartup = true
    },

    saveTemplate() {
      if (!this.template.title) {
        this.$jusNotification({
          type: 'warning',
          title: 'Ops!',
          message: 'O assunto da mensagem não pode ficar em branco.'
        })
      } else {
        this.template.communicationType = this.communication.type
        this.changeCommunicationTemplate({
          template: this.template,
          communicationId: this.templateToEdit.id,
          strategyId: this.strategyId
        }).then(response => {
          this.template.updatedAt = response.updatedAt
          this.isVisible = false
        })
      }
    },

    setHtmlHeader(body) {
      const fullTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body>
            ${body}
          </body>
        </html>`
      this.template.body = fullTemplate
      this.saveTemplate()
    },

    handleCommunicationRecipient(communication, recipient) {
      this.$emit('change-communication-recipient', { communication, recipient })
    }
  }
}
</script>
<style lang="scss">
.communication-editor__editor {
  height: 100%;

  .cke {
    height: 100%;

    .cke_inner {
      height: 100%;

      .cke_contents {
        height: 92% !important;
      }
    }
  }
}
.cke_contents {
  height: 92% !important;
}
</style>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.communication-editor {
  display: flex;

  .communication-editor__status {
    color: $--color-text-secondary;
    font-size: 14px;
    font-weight: normal;
    margin-left: 2px;
  }

  .communication-editor__data-area {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .communication-editor__header {
      display: flex;
      padding-right: 24px;

      .communication-editor__header-item {
        margin-left: 24px;
        &:first-child { margin-left: 0; flex: 1; }

        .communication-editor__header-item-options {
          display: flex;
          align-items: center;
          height: 40px;

          .is-inactive-recipient { color: $--color-text-secondary; }

          .communication-editor__option-party {
            margin-left:  16px;
            cursor: pointer;
            &:first-child { margin-left: 0; }

            .el-icon-user-solid, .el-icon-s-custom {
              font-size: 22px;
            }
          }
        }
      }

      .communication-editor__input-label {
        display: block;
        color: $--color-text-secondary;
        font-weight: bold;
      }
    }

    .communication-editor__editor-fieldset {
      border: 1px solid #ccc;
      border-radius: 4px;
      width: 100%;
      height: 100%;
      flex: 1;
      margin-top: 12px;
      display: flex;
      flex-direction: column;
    }
  }

  .communication-editor__right-area {
    height: 100%;
    display: flex;
    flex-direction: column;

    .communication-editor__footer {
      margin-top: 12px;
      margin-left: 12px;
      display: flex;

      .communication-editor__footer-button {
        flex: 1;
      }
    }
  }
}

</style>

<style lang="scss">
@import '@/styles/colors.scss';

.communication-editor {
  .communication-editor__dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;

    .el-dialog__body {
      display: flex;
      height: 100%;
    }

    .el-dialog {
      width: 100% !important;
      height: 100%;

      .el-dialog__body {
        height: calc(100% - 104px);
      }
    }
  }

  .communication-editor__data-area {
    .communication-editor__editor-fieldset {

      .communication-editor__textarea {
        height: 100%;

        .el-textarea__inner {
          border: none;
          resize: none;
          height: 100%;
        }

        .el-input__count {
          color: $--color-text-secondary;
        }
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

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
          class="communication-editor__editor-fieldset show-toolbar jus-ckeditor__parent"
        >
          <ckeditor
            v-if="isVisible"
            ref="edit"
            v-model="template.body"
            :editor="editor"
            :config="editorConfig"
            type="classic"
          />
        </div>
      </div>

      <div class="communication-editor__right-area">
        <JusVariablesCard
          :variables="templateVariables"
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
import ckeditor from '@/utils/mixins/ckeditor'

export default {
  name: 'CommunicationEditor',

  components: {
    JusVariablesCard: () => import('@/components/layouts/JusVariablesCard')
  },

  mixins: [ckeditor],

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
      useMentionPlugin: true,
      template: {
        body: ''
      }
    }
  },

  computed: {
    ...mapGetters({
      templateVariables: 'getAvaliableVariablesToTemplate'
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
    }
  },
  watch: {
    templateToEdit(current) {
      if (current) {
        this.template = current
        if (!this.template.title) this.template.title = 'Mensagem da Justto'
      }
    }
  },
  methods: {
    ...mapActions(['changeCommunicationTemplate']),

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
.communication-editor__editor-fieldset {
  .ck-editor {
    .ck-editor__main {
      .ck-editor__editable {
        height: 75vh !important;
      }
    }
  }
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

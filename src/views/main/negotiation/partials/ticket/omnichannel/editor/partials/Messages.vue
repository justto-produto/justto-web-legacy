<template>
  <section
    id="messagesTabEditorOmnichannelNegotiation"
    v-loading="showCKEditor && !editorReady"
    class="messages-container jus-ckeditor__parent"
  >
    <ckeditor
      v-if="showCKEditor"
      ref="messageEditor"
      v-model="body"
      :editor="editor"
      :config="editorConfig"
      type="classic"
    />
    <el-input
      v-else
      id="messageEditorTextOnly"
      ref="messageEditorTextOnly"
      :value="editorTextScaped"
      :rows="5"
      type="textarea"
      resize="none"
      @input="setEditorText"
    />
    <Attachments
      v-if="messageType === 'email'"
      class="messages-container__attachments"
    />
    <span
      class="messages-container__full-screen"
      @click="openFullScreenEditor"
    >
      <i class="el-icon-full-screen" />
    </span>
    <span class="messages-container__button">
      <el-button
        type="primary"
        size="small"
        :disabled="!canSendMessage"
        @click="send"
      >
        <span v-if="!localLoading">
          {{ editorRecipients.length ? 'Enviar mensagem' : 'Selecione um destinatário' }}
        </span>
        <i
          v-else
          class="el-icon-loading"
        />
      </el-button>
    </span>
    <DialogEditor
      ref="fullScreenEditor"
      :text-only="!showCKEditor"
      :width="dialogWidth"
      button-confirm="Enviar"
      custom-class="negotiator-fullscreen-editor"
      @confirm="send"
      @input="setEditorText"
    >
      <div
        slot="title"
        class="title-slot"
      >
        <Recipients is-reversed />
        <QuickReply
          show-title
          @input="openFullScreenEditor"
        />
      </div>
    </DialogEditor>
  </section>
</template>

<script>
import events from '@/constants/negotiationEvents'
import { eventBus } from '@/utils'
import ckeditor from '@/utils/mixins/ckeditor'

import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    QuickReply: () => import('./QuickReply'),
    Recipients: () => import('./Recipients'),
    Attachments: () => import('./AttachemntsIndicator'),
    DialogEditor: () => import('@/components/dialogs/DialogEditor')
  },

  mixins: [ckeditor],

  props: {
    focusOnStartup: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      localLoading: false
    }
  },

  computed: {
    ...mapGetters({
      attachment: 'getTicketOverviewAttachments',
      editorTextScaped: 'getEditorTextScaped',
      editorRecipients: 'getEditorRecipients',
      messageType: 'getEditorMessageType',
      getEditorReady: 'getEditorReady',
      editorText: 'getEditorText'
    }),

    editorReady: {
      get() {
        return this.getEditorReady || true
      },
      set(value) {
        this.setEditorReady(value)
      }
    },

    body: {
      get() {
        return this.editorText
      },
      set(text) {
        this.setEditorText(text)
      }
    },

    showCKEditor() {
      return !['sms', 'whatsapp'].includes(this.messageType)
    },

    canSendMessage() {
      const { editorRecipients, localLoading, editorReady } = this
      return editorRecipients.length && !localLoading && editorReady
    },

    dialogWidth() {
      return window.innerWidth <= 900 ? '100%' : '50%'
    },

    editorInstance() {
      return this.$refs.messageEditor
    }
  },

  watch: {
    editorReady(ready) {
      if (this.focusOnStartup && ready) {
        this.$nextTick().then(() => this.focusOnEditor()).finally(() => {
          this.$emit('update:focusOnStartup', false)
        })
      }
    }
  },

  mounted() {
    eventBus.$on(events.EDITOR_FOCUS.callback, this.focusOnEditor)
  },

  methods: {
    ...mapActions([
      'resetRecipients',
      'setEditorReady',
      'setEditorText',
      'sendMessage'
    ]),

    openFullScreenEditor(_) {
      this.$refs.fullScreenEditor.openDialogEditor(this.showCKEditor ? this.editorText : this.editorTextScaped)
    },

    send(_) {
      this.localLoading = true
      const { id } = this.$route.params
      this.sendMessage(Number(id)).then(res => {
        this.resetRecipients()
        this.setEditorText('')
        this.$jusNotification({
          title: 'Yay!',
          message: 'Mensagem enviado com sucesso.',
          type: 'success'
        })
      }).catch(error => {
        try {
          const parsedError = JSON.parse(error)
          this.$jusNotification(parsedError)
        } catch (e) {}
      }).finally(() => {
        this.localLoading = false
      })
    },

    focusOnEditor() {
      if (this.showCKEditor) {
        this.ckeditorFocus()
      } else {
        if (this.$refs.messageEditorTextOnly) {
          this.$refs.messageEditorTextOnly.focus()
        }
      }
    },

    pasteText() {
      navigator.clipboard.readText().then(text => {
        if (this.showCKEditor && this.editorReady && this.editor) {
          this.editor.insertText(text)
        } else if (!this.showCKEditor) {
          const target = document.getElementById('messageEditorTextOnly')

          if (target.setRangeText) {
            target.setRangeText(text)
          } else {
            target.focus()
            document.execCommand('insertText', false, text)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">

.negotiator-fullscreen-editor {
  .el-dialog__header {
    margin: 10px 0px;
    height: 40px;

    .dialog-title > .title-slot {
      display: flex;
      justify-content: flex-start;
      gap: 12px;
      align-items: center;
    }

    .el-dialog__headerbtn {
      top: 20px;
    }
  }

  .el-dialog__body {
    margin: 0px 0px 20px;

    .el-textarea > .el-textarea__inner {
      border-radius: 6px;
    }
  }
}
</style>

<style lang="scss" scoped>
.messages-container {
  padding: 6px;
  display: flex;
  flex-direction: column;

  .messages-container__editor {
    margin: 0px;
  }

  .messages-container__full-screen {
    position: absolute;
    top: 0;
    right: 0;
    margin: 18px;

    cursor: pointer;
  }

  .messages-container__attachments {
    position: absolute;
    top: 0;
    right: 0;
    margin: 18px 206px 0 0;
  }

  .messages-container__paste {
    position: absolute;
    top: 20px;
    left: 140px;
    cursor: pointer;
  }

  .messages-container__button {
    display: flex;
    justify-content: flex-end;
    margin-top: 6px;
  }
}

@media (max-width: 900px) {
  .messages-container {
    padding: 0;

    .messages-container__editor {
      margin: 6px;
    }

    .messages-container__button {
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

.messages-container {
  .cke_top { border: none; }

  .cke.cke_chrome, .el-textarea__inner {
    border: 2px solid $--light-gray;
    border-radius: 6px;
  }
}
@media (max-width: 900px) {
  .messages-container {
    .el-textarea__inner {
      margin: 6px;
      width: calc(100% - 12px);
    }
  }
}
</style>

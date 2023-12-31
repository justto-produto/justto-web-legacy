<template>
  <section
    v-if="!isInPreNegotiation && !isPaused && !isCanceled"
    id="messagesTabEditorOmnichannelNegotiation"
    class="messages-container jus-ckeditor__parent"
    :class="{
      'email': messageType === 'email' && canColorEditor,
      'whatsapp': messageType === 'whatsapp' && canColorEditor,
      'negotiator': ['negotiator_message', 'negotiation'].includes(messageType) && canColorEditor
    }"
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
          {{ sendMessagetext }}
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
      :fullscreen="isFullscreenDialog"
      :can-send-message="Boolean(canSendMessage)"
      :button-confirm="sendMessagetext"
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

    <ExpiredDisputeAlert ref="expiredDisputeAlert" />
  </section>

  <section
    v-else
    class="messages-container"
  >
    <span class="messages-container__pre-negotiation-alert">
      {{ loadingText }}
    </span>
  </section>
</template>

<script>
import events from '@/constants/negotiationEvents'
import { eventBus, extractMentions } from '@/utils'
import ckeditor from '@/utils/mixins/ckeditor'

import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    QuickReply: () => import('./QuickReply'),
    Recipients: () => import('./Recipients'),
    Attachments: () => import('./AttachemntsIndicator'),
    DialogEditor: () => import('@/components/dialogs/DialogEditor'),
    ExpiredDisputeAlert: () => import('@/components/dialogs/ExpiredDisputeAlert')
  },

  mixins: [ckeditor],

  props: {
    focusOnStartup: {
      type: Boolean,
      default: false
    },
    isInPreNegotiation: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      localLoading: false,
      useMentionPlugin: true,
      usePreviewPlugin: false
    }
  },

  computed: {
    ...mapGetters({
      attachment: 'getTicketOverviewAttachments',
      editorTextScaped: 'getEditorTextScaped',
      editorRecipients: 'getEditorRecipients',
      messageType: 'getEditorMessageType',
      editorText: 'getEditorText',
      ticket: 'getTicketOverview',
      isJusttoAdmin: 'isJusttoAdmin',
      isRecovery: 'isWorkspaceRecovery',
      userProperties: 'userProperties',
      usingColors: 'isOmnichannelUsingColors'
    }),

    sendMessagetext() {
      return this.editorRecipients.length ? 'Enviar mensagem' : 'Selecione um destinatário'
    },

    body: {
      get() {
        return this.editorText
      },
      set(text) {
        this.setEditorText(text)
      }
    },

    isPaused() {
      return this.ticket.paused
    },

    isCanceled() {
      const { status } = this.ticket
      return status === 'CANCELED'
    },

    loadingText() {
      if (this.isPaused || this.isCanceled) {
        return `Disputa ${this.isPaused ? 'pausada' : 'cancelada'}. Retome a disputa para enviar mensagens`
      } else return 'Disputa em pré negociação. Inicie a disputa para enviar mensagens'
    },

    showCKEditor() {
      return !['sms', 'whatsapp'].includes(this.messageType)
    },

    canSendMessage() {
      const { editorRecipients, localLoading } = this
      return editorRecipients.length && !localLoading
    },

    isFullscreenDialog() {
      return window.innerWidth <= 900
    },

    editorInstance() {
      return this.$refs.messageEditor
    },

    canColorEditor() {
      return this.usingColors && this.editorRecipients.length > 0
    }
  },

  mounted() {
    eventBus.$on(events.EDITOR_FOCUS.callback, this.focusOnEditor)
  },

  beforeDestroy() {
    eventBus.$off(events.EDITOR_FOCUS.callback, this.focusOnEditor)
  },

  methods: {
    ...mapActions([
      'resetRecipients',
      'sendDisputeNote',
      'disfavorTicket',
      'setEditorText',
      'sendMessage',
      'setSignature'
    ]),

    openFullScreenEditor() {
      this.$refs.fullScreenEditor.openDialogEditor(this.showCKEditor ? this.editorText : this.editorTextScaped)
    },

    validateSendMessage() {
      if (['EXPIRED'].includes(this.ticket.status)) {
        return this.$refs.expiredDisputeAlert.open()
      } else if (this.ticket?.favorite) {
        return new Promise((resolve, reject) => {
          const text = `<p>Olá Lucas, esta disputa está marcada como <b>Aguardando análise da empresa</b>.<br><br>Estamos respondendo todas as mensagens d${this.$tc('ARTICLE', this.isRecovery)} ${this.$tc('fields.claimantParty', this.isRecovery)} informando que o processo está em análise pela empresa.<br><br>Gostaria de desmarcar esta opção?</p>`

          this.$confirm(text, 'Aguardando análise pela empresa', {
            cancelButtonText: 'Desmarcar e enviar',
            confirmButtonText: 'Não enviar',
            dangerouslyUseHTMLString: true,
            closeOnPressEscape: false,
            closeOnClickModal: false,
            showClose: false,
            center: true
          }).then(() => {
            reject(new Error('Ticket aguardando análise da empresa.'))
          }).catch(() => {
            this.disfavorTicket(Number(this.ticket?.disputeId || this.$route.params.id))
            resolve()
          })
        })
      } else if (extractMentions(this.editorText).length) {
        return new Promise((resolve, reject) => {
          const message = '<p>Você está enviando uma mensagem mencionando pessoas do seu time.<br><br>Sua intenção é registrar uma nota privada para seu time ou realmente deseja enviar uma mensagem mencionando pessoas do seu time?</p>'
          this.$confirm(message, 'Menção detectada', {
            confirmButtonText: 'Registrar nota',
            cancelButtonText: 'Enviar mensagem',
            dangerouslyUseHTMLString: true,
            center: true
          }).then(() => {
            // TODO: Enviar nota.
            this.sendNote()
            reject(new Error('Registrando nota'))
          }).catch(() => {
            // TODO: Enviar mensagem
            resolve()
          })
        })
      } else {
        return new Promise(resolve => resolve())
      }
    },

    sendNote() {
      this.sendDisputeNote({
        disputeId: Number(this.$route.params.id),
        note: this.editorText
      }).then(() => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Nota gravada com sucesso.',
          type: 'success'
        })
      }).catch(error => this.$jusNotification({ error })).finally(() => {
        this.resetRecipients()
        this.setEditorText('')
      })
    },

    send() {
      this.localLoading = true
      const { id } = this.$route.params

      this.validateSendMessage().then(() => {
        this.sendMessage(Number(id)).then(res => {
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
          this.setSignature()
          this.localLoading = false
        })
      }).finally(() => {
        this.localLoading = false
      }).catch(() => {})
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
        if (this.showCKEditor && this.editor) {
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
  @import '~projuris-acordos-theme/src/common/colors.scss';

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

  .messages-container {
    .cke_top { border: none; }

    .cke.cke_chrome, .el-textarea__inner {
      border: 2px solid $--color-light-gray;
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

<style lang="scss" scoped>
  @import '~projuris-acordos-theme/src/common/colors';

  .messages-container {
    padding: 6px;
    display: flex;
    flex-direction: column;

    .messages-container__pre-negotiation-alert {
      margin: 24px 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: $--color-text-secondary;
      font-style: italic;
    }

    .messages-container__editor {
      margin: 0px;
    }

    .messages-container__full-screen {
      position: absolute;
      top: 0;
      right: 0;
      margin: 16px;

      cursor: pointer;
    }

    .messages-container__attachments {
      position: absolute;
      top: 0;
      right: 0;
      margin: 16px 40px 0px 0px;
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

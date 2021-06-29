<template>
  <section
    v-if="!isInPreNegotiation && !isPaused && !isCanceled"
    id="messagesTabEditorOmnichannelNegotiation"
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
    <div class="messages-container__hint">
      <strong class="messages-container__hint-hint">Dica importante!</strong>
      <div class="messages-container__hint-text">
        <div>Clique</div>
        <div
          class="messages-container__hint-text-click"
          @click="isSlideInfoVisible = true"
        >
          AQUI
        </div>
        <div>e saiba como utilizar variáveis e preview das mensagens rápidas</div>
      </div>
    </div>
    <SlideInfo
      title="Customizando suas mensagens rápidas"
      :images="itemsSlider"
      :is-visible="isSlideInfoVisible"
      @close="isSlideInfoVisible = false"
    />
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
import { eventBus } from '@/utils'
import ckeditor from '@/utils/mixins/ckeditor'

import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    QuickReply: () => import('./QuickReply'),
    Recipients: () => import('./Recipients'),
    Attachments: () => import('./AttachemntsIndicator'),
    DialogEditor: () => import('@/components/dialogs/DialogEditor'),
    SlideInfo: () => import('@/components/dialogs/SlideInfo')
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
      useMenstionPlugin: false,
      usePreviewPlugin: false,
      isSlideInfoVisible: false,
      itemsSlider: [
        {
          title: 'Utilizando variáveis da disputa em suas mensagens rápidas',
          subtitle: 'São inumeras variáveis que você pode utilizar para compor suas mensagens rápidas. No local em que você coloca uma variável, o sistema vai utilizar os dados da disputa na mensagem.',
          src: 'https://storage.googleapis.com/justto_app/conteudos/customizando-mensagens1.png'
        },
        {
          title: 'Utilizando variáveis da disputa em suas mensagens rápidas',
          src: 'https://storage.googleapis.com/justto_app/conteudos/customizando-mensagens2.png'
        },
        {
          title: 'Visualizando como ficará sua mensagem',
          src: 'https://storage.googleapis.com/justto_app/conteudos/customizando-mensagens3.png',
          footer: 'Pronto! Agora você tem o template prontinho para usar sempre que precisar!'
        }
      ]
    }
  },

  computed: {
    ...mapGetters({
      attachment: 'getTicketOverviewAttachments',
      editorTextScaped: 'getEditorTextScaped',
      editorRecipients: 'getEditorRecipients',
      messageType: 'getEditorMessageType',
      editorText: 'getEditorText',
      ticket: 'getTicketOverview'
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
@import '@/styles/colors';

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

  .messages-container__hint {
    display: flex;
    flex-direction: row;
    text-align: center;
    font-size: 11px;
    .messages-container__hint-hint {
      margin-right: 4px;
    }
    .messages-container__hint-text {
      display: flex;
      flex-direction: row;
      .messages-container__hint-text-click {
        font-size: 9px;
        text-align: center;
        background-color: $--color-primary;
        padding: 3px 4px;
        color: white;
        margin: 0px 4px;
        font-weight: 700;
        border-radius: 4px;
        cursor: pointer;
      }
    }
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

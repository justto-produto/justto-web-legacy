<template>
  <section
    id="messagesTabEditorOmnichannelNegotiation"
    v-loading="showCKEditor && !editorReady"
    class="messages-container"
  >
    <ckeditor
      v-if="showCKEditor"
      v-show="editorReady"
      ref="messageEditor"
      :value="editorText"
      :config="editorConfig"
      class="messages-container__editor"
      @ready="setEditorReady(true)"
      @input="setEditorText"
    />
    <el-input
      v-else
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
  </section>
</template>

<script>
import CKEditor from 'ckeditor4-vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    ckeditor: CKEditor.component,
    Attachments: () => import('./AttachemntsIndicator')
  },
  data: () => ({
    localLoading: false
  }),
  computed: {
    ...mapGetters({
      attachment: 'getTicketOverviewAttachments',
      editorTextScaped: 'getEditorTextScaped',
      editorRecipients: 'getEditorRecipients',
      messageType: 'getEditorMessageType',
      getEditorReady: 'getEditorReady',
      editorConfig: 'getEditorConfig',
      editorText: 'getEditorText'
    }),
    editorReady: {
      get() {
        return this.getEditorReady
      },
      set(value) {
        this.setEditorReady(value)
      }
    },
    body() {
      return this.editorText
    },
    showCKEditor() {
      return !['sms', 'whatsapp'].includes(this.messageType)
    },
    canSendMessage() {
      const { editorRecipients, localLoading, editorReady } = this
      return editorRecipients.length && !localLoading && editorReady
    }
  },
  beforeDestroy() {
    this.destroyEditor()
  },
  methods: {
    ...mapActions([
      'resetRecipients',
      'setEditorReady',
      'setEditorText',
      'sendMessage'
    ]),

    send(_event) {
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
        const parsedError = JSON.parse(error)
        this.$jusNotification(parsedError)
      }).finally(() => {
        this.localLoading = false
      })
    },

    destroyEditor() {
      this.editorReady = false
      for (const instance of Object.values(window.CKEDITOR.instances)) {
        instance.destroy()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.messages-container {
  padding: 6px;
  display: flex;
  flex-direction: column;

  .messages-container__editor {
    margin: 0px;
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
      width: calc(100% - 12px);
      margin: 6px;
    }
  }
}
</style>

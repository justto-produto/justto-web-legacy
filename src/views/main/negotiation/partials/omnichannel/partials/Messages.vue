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
      class="messages-container__editor"
      :config="editorConfig"
      @ready="setEditorReady(true)"
      @input="setEditorText"
    />
    <el-input
      v-else
      :value="editorTextScaped"
      type="textarea"
      resize="none"
      :autosize="{ minRows: 5 }"
      @input="setEditorText"
    />
    <span class="messages-container__send-message-button">
      <el-button
        type="primary"
        size="mini"
      >
        Enviar mensagem
      </el-button>
    </span>
  </section>
</template>

<script>
import CKEditor from 'ckeditor4-vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    ckeditor: CKEditor.component
  },
  data() {
    return { }
  },
  computed: {
    ...mapGetters({
      editorTextScaped: 'getEditorTextScaped',
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
    }
  },
  beforeDestroy() {
    this.destroyEditor()
  },
  methods: {
    ...mapActions([
      'setEditorReady',
      'setEditorText'
    ]),

    destroyEditor() {
      this.editorReady = false
      for (const instance of Object.values(window.CKEDITOR.instances)) {
        instance.destroy()
      }
    }
  }
}
</script>

<style lang="scss">
.messages-container {
  padding: 6px;

  .cke_top, .cke_contents, .cke_reset, .cke_inner {
    border: none;
    background-color: transparent !important;
  }

  .cke.cke_chrome, .el-textarea__inner {
    border: solid 2px whitesmoke;
    margin: 0px;
    border-radius: 12px;
  }
}
</style>

<style lang="scss" scoped>
.messages-container {
  background-color: transparent !important;

  .messages-container__editor {
    background-color: transparent !important;
  }

  .messages-container__send-message-button {
    margin-top: 6px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

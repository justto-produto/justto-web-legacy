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
      type="textarea"
      resize="none"
      :autosize="{ minRows: 5 }"
      @input="setEditorText"
    />
    <span class="messages-container__button">
      <el-button
        type="primary"
        size="small"
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

<style lang="scss" scoped>
.messages-container {
  background-color: transparent !important;
  padding: 6px;
  display: flex;
  flex-direction: column;

  .messages-container__editor {
    background-color: transparent !important;
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

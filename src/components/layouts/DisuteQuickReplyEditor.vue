<template>
  <div class="reply-editor__container">
    <div class="reply-editor__body jus-ckeditor__parent">
      <el-input v-model="state.title" />

      <ckeditor
        ref="templateEditor"
        v-model="text"
        :editor="editor"
        :config="editorConfig"
        type="classic"
        @ready="editorReady()"
      />
    </div>

    <div class="reply-editor__footer">
      <el-row
        class="reply-editor__footer-row"
        type="flex"
        justify="end"
        :gutter="20"
      >
        <el-col
          :span="10"
          class="reply-editor__footer-column"
        >
          <div
            class="messages-container__hint"
          >
            <strong class="messages-container__hint-hint">Dica importante!</strong>
            <div class="messages-container__hint-text">
              <div
                class="messages-container__hint-text-click"
                @click="isSlideInfoVisible = true"
              >
                CLIQUE AQUI
              </div>
              <div>e saiba como utilizar variáveis e preview das mensagens rápidas</div>
            </div>
          </div>
          <SlideInfo
            :images="itemsSlider"
            :is-visible="isSlideInfoVisible"
            @close="isSlideInfoVisible = false"
          />
          <div>
            <el-button @click="cancel()">
              Cancelar
            </el-button>
            <el-button
              type="primary"
              :disabled="loading"
              @click="save()"
            >
              Salvar
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ckeditor from '@/utils/mixins/ckeditor'

export default {
  components: {
    SlideInfo: () => import('@/components/dialogs/SlideInfo')
  },

  mixins: [ckeditor],

  props: {
    template: {
      type: Object,
      required: true
    },

    disputeId: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      state: {
        title: '',
        body: ''
      },
      editorLoaded: false,
      useMentionPlugin: true,
      usePreviewPlugin: true,
      isSlideInfoVisible: false,
      itemsSlider: [
        {
          title: 'Utilizando variáveis da disputa em suas mensagens rápidas',
          subtitle: 'São inumeras variáveis que você pode utilizar para compor suas mensagens rápidas. No local em que você coloca uma variável, o sistema vai utilizar os dados da disputa na mensagem.',
          src: 'https://storage.googleapis.com/justto_app/conteudos/variaveis%26preview1.png'
        },
        {
          title: 'Utilizando variáveis da disputa em suas mensagens rápidas',
          src: 'https://storage.googleapis.com/justto_app/conteudos/variaveis%26preview2.png'
        },
        {
          title: 'Visualizando como ficará sua mensagem',
          src: 'https://storage.googleapis.com/justto_app/conteudos/variaveis%26preview3.png',
          footer: 'Pronto! Agora você tem o template prontinho para usar sempre que precisar!'
        }
      ]
    }
  },

  computed: {
    ...mapGetters(['loading']),

    text: {
      get() {
        return this.state.body
      },
      set(text) {
        this.state.body = text
      }
    }
  },

  watch: {
    template() {
      if (this.isEditorReady) {
        this.loadTemplate()
      }
    }
  },

  mounted() {
    if (this.isEditorReady) {
      this.loadTemplate()
    }
  },

  beforeDestroy() {
    this.state = { title: '', body: '' }
  },

  methods: {
    ...mapActions([
      'editTemplate',
      'showLoading',
      'hideLoading'
    ]),

    loadTemplate() {
      const body = this.formatBody()

      this.state = { ...this.template, body }
    },

    editorReady() {
      this.isEditorReady = true
      this.loadTemplate()
    },

    cancel() {
      this.$emit('cancel')
      this.hideLoading()
    },

    save() {
      this.showLoading()
      this.editTemplate({
        template: this.state,
        disputeId: this.disputeId
      }).then(res => {
        this.$emit('input', res)
        this.$emit('update')
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(this.cancel)
    },

    formatBody() {
      const { body } = this.template
      if (body) {
        const start = body.indexOf('<body>') + 6
        const end = body.indexOf('</body>') - 7
        if (start > 5 && end > 0) {
          return body.substring(start, end).trim()
        }
      }
      return body
    }
  }
}
</script>

<style lang="scss">
.reply-editor__container {
  .reply-editor__body {
    .ck-editor {
      height: 90% !important;

      .ck-editor__main {
        height: 100% !important;

        .ck-content {
          height: 90% !important;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@import '@/styles/colors.scss';
.reply-editor__container {
  margin: 16px 0px;
  padding: 16px 0px;
  height: 80vh;

  .reply-editor__body {
    height: 90%;
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
  }

  .reply-editor__footer {
    margin-top: 16px;

    .reply-editor__footer-row {
      .reply-editor__footer-column {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}

.messages-container__hint {
  display: flex;
  flex-direction: column;
  text-align: left;
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
      margin-right: 4px;
      font-weight: 700;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}
</style>

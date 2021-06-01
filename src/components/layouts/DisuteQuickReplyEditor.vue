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
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ckeditor from '@/utils/mixins/ckeditor'

export default {
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
      useMenstionPlugin: true,
      usePreviewPlugin: true
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
        justify-content: flex-end;
      }
    }
  }
}
</style>

<template>
  <section
    id="notesTabEditorOmnichannelNegotiation"
    class="notes-container jus-ckeditor__parent"
  >
    <el-button
      class="notes-container__marker-btn"
      type="primary"
      icon="el-icon-document-add"
      size="mini"
    >
      NOTA
    </el-button>

    <ckeditor
      ref="noteEditor"
      v-model="body"
      :editor="editor"
      :config="editorConfig"
      type="classic"
    />

    <span class="notes-container__button">
      <el-button
        type="primary"
        size="small"
        :disabled="!enableButton"
        @click="send"
      >
        <span v-if="!localLoading">Salvar nota</span>
        <i
          v-else
          class="el-icon-loading"
        />
      </el-button>
    </span>
  </section>
</template>

<script>
import events from '@/constants/negotiationEvents'
import { eventBus } from '@/utils'
import ckeditor from '@/utils/mixins/ckeditor'

import { mapActions, mapGetters } from 'vuex'

export default {
  mixins: [ckeditor],

  data: () => ({
    localLoading: false,
    // useMentionPlugin: true,
    usePreviewPlugin: false
  }),

  computed: {
    ...mapGetters({
      editorText: 'getNoteEditorText',
      useMentionPlugin: 'isJusttoAdmin'
    }),

    body: {
      get() {
        return this.editorText
      },
      set(text) {
        this.setNoteEditorText(text)
      }
    },

    enableButton() {
      return !this.localLoading && this.editorText.length
    }
  },

  beforeDestroy() {
    eventBus.$off(events.EDITOR_FOCUS.callback, this.ckeditorFocus)
  },

  mounted() {
    eventBus.$on(events.EDITOR_FOCUS.callback, this.ckeditorFocus)
  },

  methods: {
    ...mapActions([
      'sendDisputeNote',
      'setNoteEditorText'
    ]),

    send(_event) {
      const { id } = this.$route.params

      this.localLoading = true
      this.sendDisputeNote({
        disputeId: id,
        note: this.editorText
      }).then(() => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Nota gravada com sucesso.',
          type: 'success'
        })
        this.body = ''
      }).catch(error => this.$jusNotification({
        error
      })).finally(() => {
        this.localLoading = false
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.notes-container {
  padding: 6px;
  display: flex;
  flex-direction: column;

  .notes-container__editor {
    margin: 0px;
  }

  .notes-container__button {
    display: flex;
    justify-content: flex-end;
    margin-top: 6px;
  }
}

@media (max-width: 900px) {
  .notes-container {
    padding: 0;

    .notes-container__editor {
      margin: 6px;
    }

    .notes-container__button {
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

.notes-container {
  .notes-container__marker-btn {
    padding: 4px 8px;
    position: absolute;
    top: 54px;
    left: 16px;
    cursor: default;
    z-index: 1;
  }

  .cke_top { border: none; }

  .cke.cke_chrome {
    border: 2px solid #F4EFFE;
    border-radius: 6px;
  }
}

.ck.ck-content.ck-editor__editable {
  background-color: #F4EFFE !important;
  color: #9461F7;
  text-indent: 80px;
}
</style>

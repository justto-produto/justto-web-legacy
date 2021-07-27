<template>
  <article
    ref="dragAreaElm"
    v-loading="isAttachmentLoading"
    :class="{
      'jus-drag-area--dragging': maskIsVisible
    }"
    class="jus-drag-area"
    @dragenter="handleDragenter"
  >
    <slot />
    <label
      :for="`input-file-drag-area-${_uid}`"
      @dragover.prevent="handleDragenter"
      @dragleave="handleDragleave"
      @drop.prevent="handleDrop"
    >
      <el-card
        :body-style="{ 'text-align': 'center'}"
        class="el-card--dashed-hover jus-drag-area__mask"
        shadow="never"
      >
        <div
          class="jus-drag-area__mask-action"
        />

        <div>
          <jus-icon
            icon="upload-file"
            is-active
          />
          <br>
          Arraste aqui os anexos que deseja importar!
        </div>
      </el-card>
    </label>
    <input
      :id="`input-file-drag-area-${_uid}`"
      type="file"
      class="jus-drag-area__input-file"
      @change="handleDrop"
    >

    <el-dialog
      :visible.sync="attachmentDialog.isVisible"
      append-to-body
      title="Enviar Anexos"
      custom-class="attachment-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :before-close="closeAttachmentDialog"
    >
      <div class="attachment-dialog__container">
        <span class="attachment-dialog__container-message">
          {{ attachmentDialog.message }}
        </span>

        <div class="attachment-dialog__container-check">
          <el-switch
            v-model="attachmentDialog.confidential"
            :class="attachmentDialog.confidential ? 'inactive' : 'active'"
            inactive-color="#14CC30"
            active-color="#ADADAD"
          />

          <span>
            <strong>
              {{ attachmentDialog.confidential ? 'Não exibir' : 'Exibir' }}
            </strong>
            anexo no portal de negociações
          </span>
        </div>
      </div>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="attachmentDialog.isVisible = false"
        >
          Cancelar
        </el-button>

        <el-button
          type="primary"
          @click="uploadFiles(attachmentDialog)"
        >
          Continuar
        </el-button>
      </span>
    </el-dialog>
  </article>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'JusDragArea',

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    isDragging: false,
    isAttachmentLoading: false,
    attachmentDialog: {
      isVisible: false,
      message: '',
      confidential: false,
      files: []
    }
  }),

  computed: {
    maskIsVisible: self => self.visible || self.isDragging
  },

  methods: {
    ...mapActions([
      'uploadAttachment',
      'getDisputeAttachments',
      'hideLoadingAttachments',
      'getTicketOverviewAttachments'
    ]),

    handleDragenter(evt) {
      if (evt.dataTransfer.types.includes('Files')) {
        this.isDragging = true
      }
    },

    handleDragleave(_evt) {
      this.isDragging = false
    },

    handleDrop(evt) {
      const { files } = evt.dataTransfer || evt.target

      this.uploadVerification(files)

      this.isDragging = false
    },

    closeAttachmentDialog(done) {
      done()
      this.attachmentDialog.message = ''
      this.attachmentDialog.confidential = false
      this.attachmentDialog.files = []
    },

    uploadFiles({ files, confidential }) {
      Promise.all([
        ...Object.keys(files).map(fileIndex => this.saveFile(files[fileIndex], confidential))
      ]).then(() => {
        this.attachmentDialog.isVisible = false
      })
    },

    uploadVerification(files) {
      const attatchmentIndexes = Object.keys(files)

      if (attatchmentIndexes.length === 1) {
        this.attachmentDialog.message = `Tem certeza que deseja fazer o upload do arquivo "${files[0].name}"?`
      } else {
        this.attachmentDialog.message = `Tem certeza que deseja fazer o upload de ${attatchmentIndexes.length} arquivos?`
      }

      this.attachmentDialog.files = files
      this.attachmentDialog.isVisible = true
    },

    updateAttachments(disputeId) {
      if (window.location.href.includes('negotiation')) {
        return this.getTicketOverviewAttachments(disputeId)
      } else if (window.location.href.includes('dispute')) {
        return this.getDisputeAttachments(disputeId)
      } else {
        return new Promise(resolve => resolve)
      }
    },

    saveFile(file, confidential = false) {
      this.isAttachmentLoading = true
      const segmentLog = 'Solicitação de upload do arquivo'
      const disputeId = this.$route.params.id
      const formData = new FormData()
      formData.append('file', file)

      return this.uploadAttachment({
        disputeId,
        formData,
        file,
        confidential
      }).then(() => {
        this.updateAttachments(disputeId).then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Anexo(s) adicionado(s) com sucesso',
            type: 'success'
          })
          this.$jusSegment(segmentLog, { fileName: file.name })
        })
      }).catch(error => {
        this.$jusNotification({ error })
        this.$jusSegment(`${segmentLog} falhou`, { fileName: file.name })
      }).finally(() => {
        this.$emit('closeDialog')
        this.isAttachmentLoading = false
        this.hideLoadingAttachments()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.jus-drag-area {
  position: relative;
  height: 100%;

  .jus-drag-area__mask {
    display: none;
    cursor: pointer;
  }

  .jus-drag-area__input-file {
    display: none;
  }

  &.jus-drag-area--dragging {

    .jus-drag-area__mask {
      align-items: center;
      display: flex;
      height: 100%;
      justify-content: center;
      left: 0;
      position: absolute;
      top: 0;
      z-index: 2;
      width: 100%;

      .jus-drag-area__mask-action {
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
      }
    }
  }
}

.attachment-dialog {
  .el-dialog__body {
    .attachment-dialog__container {
      display: flex;
      flex-direction: column;
      gap: 24px;

      .attachment-dialog__container-check {
        display: flex;
        gap: 16px;
      }
    }
  }
}
</style>

<style lang="scss">
.attachment-dialog__container-check {
  .el-switch {
    &.inactive {
      .el-switch__core::after {
        margin: 0;
        left: 1px;
      }
    }

    &.active {
      .el-switch__core::after {
        left: 20px;
      }
    }
  }
}
</style>

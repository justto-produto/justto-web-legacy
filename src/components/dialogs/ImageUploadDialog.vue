<template>
  <el-dialog
    title="Inserir Imagem"
    :visible.sync="dialogVisible"
    width="60%"
    custom-class="upload-image-dialog"
  >
    <div class="upload-image-dialog__container">
      <el-input
        v-model="imageUrl"
        class="upload-image-dialog__container-url"
        placeholder="URL da imagem"
      >
        <template slot="prepend">
          URL
        </template>
      </el-input>

      <!-- <span>ou</span>

      <article
        ref="dragAreaElm"
        v-loading="isAttachmentLoading"
        :class="{
          'jus-drag-area--dragging': isDragging
        }"
        class="upload-image-dialog__container-drag-area"
        @dragenter="handleDragenter"
      >
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
              <span>
                Arraste aqui a imagem que deseja inserir!
              </span>
            </div>
          </el-card>
        </label>
        <input
          :id="`input-file-drag-area-${_uid}`"
          type="file"
          accept="image/png, image/jpeg"
          class="jus-drag-area__input-file"
          @change="handleDrop"
        >
      </article> -->
    </div>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        @click="dialogVisible = false"
      >
        Cancelar
      </el-button>

      <el-button
        type="primary"
        :disabled="imageUrl.length <= 0"
        @click="emitUrl(imageUrl)"
      >
        Inserir
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data: () => ({
    imageUrl: '',
    file: null,
    isDragging: false,
    isAttachmentLoading: false
  }),

  computed: {
    ...mapGetters({
      isUploadImageVisible: 'getImageUploadDialogVisibility'
    }),

    dialogVisible: {
      get() {
        return this.isUploadImageVisible
      },

      set(visibility) {
        this.toggleImageUploadDialog(visibility)
        this.imageUrl = ''
        this.file = null
      }
    }
  },

  methods: {
    ...mapActions([
      'saveImageInBucket',
      'toggleImageUploadDialog'
    ]),

    handleDragenter(_evt) {
      this.isDragging = true
    },

    handleDragleave(_evt) {
      this.isDragging = false
    },

    handleDrop(evt) {
      const { files } = evt.dataTransfer || evt.target

      if (files?.length) {
        this.file = files[0]
        this.saveImage()
      }

      this.isDragging = false
    },

    emitUrl(url) {
      this.$emit('input', url)
      this.dialogVisible = false
    },

    saveImage() {
      this.isAttachmentLoading = true

      this.saveImageInBucket({ file: this.file }).then(({ url }) => {
        this.emitUrl(url)
      }).catch(error => this.$jusNotification({ error })).finally(() => {
        this.isAttachmentLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.upload-image-dialog {
  .el-dialog__body {
    .upload-image-dialog__container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;

      .upload-image-dialog__container-drag-area {
        width: 100%;

        .jus-drag-area__input-file {
          display: none;
        }

        &.jus-drag-area--dragging {
          label {
            .el-card {
              border-color: $--color-primary;
            }
          }
        }
      }
    }
  }
}
</style>

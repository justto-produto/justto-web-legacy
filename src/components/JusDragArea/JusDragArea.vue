<template>
  <article
    ref="dragAreaElm"
    :class="{
      'jus-drag-area--dragging': maskIsVisible
    }"
    class="jus-drag-area"
    @dragenter="handleDragenter"
  >
    <slot />
    <label
      :for="`input-file-drag-area-${_uid}`"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <el-card
        :body-style="{ 'text-align': 'center'}"
        class="el-card--dashed-hover jus-drag-area__mask"
        shadow="never"
      >
        <jus-icon
          icon="upload-file"
          is-active />
        <div>
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
  </article>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'JusDragArea',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    dropzone: null,
    isDragging: false,
  }),
  computed: {
    maskIsVisible: self => self.visible || self.isDragging,
  },
  methods: {
    ...mapActions(['uploadAttachment']),
    handleDragenter(evt) {
      this.isDragging = true
    },
    handleDragleave(evt) {
      this.isDragging = false
    },
    handleDrop(evt) {
      const { files } = evt.dataTransfer || evt.target

      this.uploadVerification(files)

      this.isDragging = false
    },
    uploadVerification(files) {
      let message
      const attatchmentIndexes = Object.keys(files)

      if (attatchmentIndexes.length === 1) {
        message = `Tem certeza que deseja fazer o upload do arquivo "${files[0].name}"?`
      } else {
        message = `Tem certeza que deseja fazer o upload de ${attatchmentIndexes.length} arquivos?`
      }

      return this.$confirm(message, 'Enviando anexos', {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        cancelButtonClass: 'is-plain',
        showClose: false,
      }).then(() => {
        Object.keys(files).map(fileIndex => this.saveFile(files[fileIndex]))
      }).catch(() => false)
    },
    saveFile(file) {
      const disputeId = this.$route.params.id
      const formData = new FormData()
      formData.append('file', file)

      return this.uploadAttachment({ disputeId, formData, file })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.jus-drag-area {
  position: relative;
  min-height: 300px;

  .jus-drag-area__mask {
    display: none;
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
    }
  }
}
</style>

<template>
  <form
    ref="dragAreaElm"
    :class="{
      'jus-drag-area--dragging': isDragging
    }"
    enctype="multipart/form-data"
    class="jus-drag-area"
    @dragenter="handleDragenter"
  >
    <slot />
    <label
      for="input-file"
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
      id="input-file"
      type="file"
      class="jus-drag-area__input-file"
      @change="handleDrop"
    >
  </form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'JusDragArea',
  data: () => ({
    dropzone: null,
    isDragging: false,
  }),
  mounted() {
  },
  methods: {
    ...mapActions(['uploadAttachment']),
    handleDragenter(evt) {
      console.log('start', evt)
      this.isDragging = true
    },
    handleDragleave(evt) {
      console.log('end', evt)
      this.isDragging = false
    },
    handleDrop(evt) {
      const { files } = evt.dataTransfer

      console.log(files)

      Object.keys(files).map(fileIndex => this.saveFile(files[fileIndex]))

      this.isDragging = false
    },
    saveFile(file) {
      console.log('SUCK MY DICK', file)
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

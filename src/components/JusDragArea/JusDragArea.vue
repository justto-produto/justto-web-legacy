<template>
  <article
    ref="dragAreaElm"
    :class="{
      'jus-drag-area--dragging': isDragging
    }"
    class="jus-drag-area"
  >
    <slot />
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
        Clique aqui e importe sua planilha nos<br> formatos XLSX, CSV ou XLS.
      </div>
    </el-card>
  </article>
</template>

<script>
import Dropzone from "dropzone"; //eslint-disable-line

Dropzone.autoDiscover = false

export default {
  name: 'JusDragArea',
  data: () => ({
    dropzone: null,
    isDragging: false,
  }),
  mounted() {
    this.dropzone = new Dropzone(this.$refs.dragAreaElm, {
      url: 'https',
      uploadMultiple: true,
      clickable: false,
    })

    this.dropzone.on('dragover', () => (this.isDragging = true))
    this.dropzone.on('dragend', () => (this.isDragging = false))
    this.dropzone.on('drop', () => (this.isDragging = false))
    this.dropzone.on('success', file => (file.previewElement.innerHTML = ''))
    this.dropzone.on('error', file => (file.previewElement.innerHTML = ''))
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

  &.jus-drag-area--dragging {

    .jus-drag-area__mask {
      display: block;
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
    }
  }
}
</style>

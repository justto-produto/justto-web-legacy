<template>
  <article class="jus-academy-container">
    <el-tooltip
      content="Justto Academy"
      placement="bottom"
    >
      <jus-icon
        class="jus-academy-container__academy-icon"
        icon="academy"
        @click="showDialog"
      />
    </el-tooltip>

    <el-dialog
      title="Justto Academy"
      :visible.sync="isVisible"
      width="770px"
      custom-class="jus-academy"
      append-to-body
      destroy-on-close
      :before-close="handleClose">
      <iframe
        width="729"
        height="410"
        :src="src"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      />
    </el-dialog>
  </article>
</template>

<script>
export default {
  data: () => ({
    src: 'https://www.youtube.com/embed/videoseries?list=PLT-H88DcnUI4ckL-LVBUvwtLsHwc7v3pC',
    isVisible: false
  }),
  methods: {
    showDialog(_) {
      this.isVisible = true
    },

    hideDialog(_) {
      this.isVisible = false
    },

    handleClose(done) {
      this.$confirm('Deseja sair do Justto Academy?', {
        confirmButtonText: 'Não fechar',
        cancelButtonText: 'Fechar'
      }).then(_ => {}).catch(_ => done())
    }
  }
}
</script>

<style lang="scss">
.jus-academy {
  .el-dialog__body {
    margin: 12px auto;

    iframe {
      border-radius: 10px;
    }
  }
}
</style>

<style lang="scss" scoped>
.jus-academy-container {
  .jus-academy-container__academy-icon {
    width: 24px;
    margin-right: 10px;
    cursor: pointer;
  }
}
</style>

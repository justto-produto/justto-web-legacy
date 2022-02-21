<template>
  <article class="sign-attachment">
    <el-tooltip
      :open-delay="600"
      content="Assinar anexo"
    >
      <i
        class="overview-attachments__item-icon el-icon-document-checked"
        @click="visible = true"
      />
    </el-tooltip>

    <el-dialog
      title="Assinar"
      :visible.sync="visible"
      center
    >
      <span>Dialog de assinar documento.</span>
      <span slot="footer">
        <el-button
          @click="visible = false"
        >
          Cancelar
        </el-button>

        <el-button
          type="primary"
          @click="visible = false"
        >
          Confirmar
        </el-button>
      </span>
    </el-dialog>
  </article>
</template>

<script>
export default {
  props: {
    attachment: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    visible: false
  })
}
</script>

<style lang="scss" scoped>
.sign-attachment {
  display: inline;
}
</style>

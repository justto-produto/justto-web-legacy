<template>
  <el-dialog
    title="Você deseja mover a disputa para qual status?"
    :visible.sync="visible"
    :show-close="false"
    custom-class="set-settled-dialog"
    destroy-on-close
    append-to-body
    center
  >
    <span slot="footer">
      <el-button @click="close">
        Cancelar
      </el-button>

      <el-button type="info">
        Aguardando dados bancários
      </el-button>

      <el-button type="secondary">
        Acordo
      </el-button>

      <el-button type="primary">
        Ganha
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data: () => ({
    visible: false
  }),

  methods: {
    open() {
      this.visible = true
      console.log('setSettledDialog')
    },

    close() {
      this.visible = false
    }
  }
}
</script>

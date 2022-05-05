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
      <el-button
        @click="close"
      >
        Cancelar
      </el-button>

      <el-button
        v-if="['RUNNING', 'ACCEPTED'].includes(status)"
        type="secondary"
        @click="handleAction('CHECKOUT')"
      >
        Acordo
      </el-button>

      <el-button
        v-if="['RUNNING', 'ACCEPTED', 'CHECKOUT'].includes(status)"
        type="primary"
        @click="handleAction('SETTLED')"
      >
        Ganha
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true
    }
  },

  data: () => ({
    visible: false,
    action: () => {}
  }),

  methods: {
    open(action) {
      this.visible = true
      this.action = action
    },

    close() {
      this.visible = false
    },

    handleAction(status) {
      this.action(status)
      this.close()
    }
  }
}
</script>

<template>
  <el-dialog
    :visible.sync="visible"
    title="Escolha a integração correta:"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    center
    width="auto"
    append-to-body
  >
    <el-radio-group
      v-model="type"
      size="small"
    >
      <el-radio
        label="JUSTTO_WEBHOOK"
        border
      >
        {{ $tc('integration-types.JUSTTO_WEBHOOK') }}
      </el-radio>

      <el-radio
        label="FINCH"
        border
      >
        {{ $tc('integration-types.FINCH') }}
      </el-radio>

      <el-radio
        label="PROJURIS_SOAP"
        border
      >
        {{ $tc('integration-types.PROJURIS_SOAP') }}
      </el-radio>
    </el-radio-group>

    <span slot="footer">
      <el-button
        size="small"
        @click="handleEmitCancel"
      >
        cancelar
      </el-button>

      <el-button
        type="primary"
        size="small"
        :disabled="!type"
        @click="handleEmitSelection"
      >
        Salvar
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'SelectIntegrationTypeDialog',

  data: () => ({
    visible: false,
    type: '',
    payload: {},
    callback: () => ({})
  }),

  methods: {
    open(callback, payload) {
      this.visible = true
      this.payload = payload
      this.callback = callback
    },

    close() {
      this.visible = false
      this.type = ''
      this.payload = {}
      this.callback = () => ({})
    },

    handleEmitSelection() {
      const { type } = this

      this.callback({ ...this.payload, type, action: 'select' })
      this.close()
    },

    handleEmitCancel() {
      this.callback({ ...this.payload, action: 'cancel' })
      this.close()
    }
  }
}
</script>

<template>
  <el-dialog
    title="Você deseja mover a disputa para qual status?"
    :visible.sync="visible"
    custom-class="set-settled-dialog"
    :show-close="false"
    :close-on-click-modal="false"
    width="auto"
    destroy-on-close
    append-to-body
  >
    <el-radio-group
      v-model="forceStatus"
      :class="{'mobile' : isMobile}"
    >
      <el-radio
        v-if="!['ACCEPTED', 'CHECKOUT', 'SETTLED'].includes(status)"
        label="ACCEPTED"
        :border="isMobile"
      >
        Aguardando dados bancários
      </el-radio>

      <el-radio
        label="CHECKOUT"
        :border="isMobile"
      >
        Acordo (Aguardando minuta)
      </el-radio>

      <el-radio
        label="SETTLED"
        :border="isMobile"
      >
        Ganha (Finalizada)
      </el-radio>
    </el-radio-group>

    <span slot="footer">
      <el-button
        :class="{'el-button--small' : !isMobile}"
        @click="close"
      >
        Cancelar
      </el-button>

      <el-button
        type="primary"
        :class="{'el-button--small' : !isMobile}"
        :disabled="!forceStatus"
        @click="handleAction(forceStatus)"
      >
        Confirmar
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    status: {
      type: String,
      required: true
    }
  },

  data: () => ({
    visible: false,
    forceStatus: '',
    action: () => {}
  }),

  computed: {
    ...mapGetters({
      windowMode: 'getWindowMode'
    }),

    isMobile() {
      return this.windowMode !== 'desktop'
    }
  },

  methods: {
    open(action) {
      this.visible = true
      this.action = action
      this.forceStatus = ''
    },

    close() {
      this.visible = false
      this.forceStatus = ''
    },

    handleAction(status) {
      this.action(status)
      this.close()
    }
  }
}
</script>

<style lang="scss">
.set-settled-dialog {
  .el-dialog__body {
    .el-radio-group {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .el-radio {
        &.is-bordered {
          margin: 0;
        }
      }

      &.mobile {
        gap: 16px;

        .el-radio {
          .el-radio__label {
            font-size: 16px;
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>

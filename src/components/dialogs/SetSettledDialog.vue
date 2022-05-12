<template>
  <el-dialog
    title="Você deseja mover a disputa para qual status?"
    :visible.sync="visible"
    custom-class="set-settled-dialog"
    center
    :show-close="false"
    :close-on-click-modal="false"
    width="auto"
    destroy-on-close
    append-to-body
  >
    <span
      slot="footer"
      :class="{ mobile: isMobile, desktop: !isMobile }"
    >
      <el-button
        v-if="!isMobile"
        size="small"
        @click="close"
      >
        Cancelar
      </el-button>

      <el-button
        v-if="!['ACCEPTED', 'CHECKOUT', 'SETTLED'].includes(status)"
        type="primary"
        :class="{'el-button--small' : !isMobile}"
        @click="handleAction('ACCEPTED')"
      >
        Aguardando dados bancários
      </el-button>

      <el-button
        type="secondary"
        :class="{'el-button--small' : !isMobile}"
        @click="handleAction('CHECKOUT')"
      >
        Acordo (Aguardando minuta)
      </el-button>

      <el-button
        type="info"
        :class="{'el-button--small' : !isMobile}"
        @click="handleAction('SETTLED')"
      >
        Ganha (Finalizada)
      </el-button>

      <el-button
        v-if="isMobile"
        :class="{'el-button--small' : !isMobile}"
        @click="close"
      >
        Cancelar
      </el-button>

    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    visible: false,
    action: () => {}
  }),

  computed: {
    ...mapGetters({
      windowMode: 'getWindowMode',
      status: 'getDisputeStatus'
    }),

    isMobile() {
      return this.windowMode !== 'desktop'
    }
  },

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

<style lang="scss">
.set-settled-dialog {
  .settled-mobile-layout {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .el-button {
      margin: 0;
    }
  }

  .el-dialog__footer {
    .mobile {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .el-button {
        margin: 0;

        span {
          font-size: 16px;
          font-weight: 600;
        }
      }
    }

    .desktop {
      display: flex;
      flex-direction: row;
      justify-content: center;
      flex-wrap: wrap;
      gap: 16px;

      .el-button {
        margin: 0;

      }
    }
  }
}
</style>

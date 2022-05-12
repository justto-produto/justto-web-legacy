<template>
  <el-dialog
    title="Você deseja mover a disputa para qual status?"
    :visible.sync="visible"
    custom-class="set-settled-dialog"
    center
    :show-close="false"
    :close-on-click-modal="false"
    :width="isMobile ? '100%' : '50%'"
    destroy-on-close
    append-to-body
  >
    <span
      slot="footer"
      :class="{ mobile: isMobile, desktop: !isMobile }"
    >
      <el-button
        type="primary"
        :class="{'el-button--small' : !isMobile}"
        @click="handleAction('ACCEPTED')"
      >
        {{ $tc('occurrence.type.ACCEPTED') | capitalize }} ({{ $t('tickets-tabs.accepted') | capitalize }})
      </el-button>

      <el-button
        type="secondary"
        :class="{'el-button--small' : !isMobile}"
        @click="handleAction('CHECKOUT')"
      >
        {{ $tc('occurrence.type.CHECKOUT') | capitalize }} ({{ $t('tickets-tabs.accepted') | capitalize }})
      </el-button>

      <el-button
        type="info"
        :class="{'el-button--small' : !isMobile}"
        @click="handleAction('SETTLED')"
      >
        {{ $tc('occurrence.type.SETTLED') | capitalize }} ({{ $t('tickets-tabs.finished') | capitalize }})
      </el-button>

      <el-button
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
    ...mapGetters({ windowMode: 'getWindowMode' }),

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
      flex-direction: column;
      gap: 8px;

      .el-button {
        margin: 0;

      }
    }
  }
}
</style>

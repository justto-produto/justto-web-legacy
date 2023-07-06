<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="40%"
    append-to-body
    destroy-on-close
    custom-class="import-config__modal"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <header slot="title">
      <span class="import-config__title">Configurações de integração</span>

      <JusIcon
        icon="garage"
        size="48px"
      />
    </header>

    <article
      v-loading="loading"
      class="import-config__body"
    >
      <span>Configure as políticas de importações para as integrações desta workspace</span>

      <el-tabs
        type="border-card"
        @tab-click="handleTabClick"
      >
        <el-tab-pane label="Políticas de alçada e limites de negociações">
          Políticas de alçada e limites de negociações
        </el-tab-pane>

        <el-tab-pane label="Mapeamento de estratégias">
          Mapeamento de estratégias
        </el-tab-pane>
      </el-tabs>
    </article>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="close">Voltar</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { copyToClipboard } from '@/utils'

export default {
  data: () => ({
    dialogVisible: false,
    loading: false
  }),

  computed: {
    ...mapGetters({})
  },

  methods: {
    ...mapActions([]),

    copyToClipboard,

    open() {
      this.dialogVisible = true
      this.loading = false
    },

    close() {
      this.dialogVisible = false
    },

    handleTabClick(event) {
      console.log('handleTabClick', event)
    }
  }
}
</script>

<style lang="scss" scoped>
.import-config__modal {
  .el-dialog__header {
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .import-config__title {
        font-size: 1.25rem;
        font-weight: 700;
      }
    }
  }

  .el-dialog__body {
    .import-config__body {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      .import-config__url {
        display: flex;
        flex-direction: column;
        gap: 8px;

        main {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        footer {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>

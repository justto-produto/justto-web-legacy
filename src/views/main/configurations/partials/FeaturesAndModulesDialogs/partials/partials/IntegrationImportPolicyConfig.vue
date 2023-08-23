<template>
  <el-dialog
    v-if="dialogVisible"
    :visible.sync="dialogVisible"
    width="60%"
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
      <span>Configure as políticas de importações para as integrações desta workspace:</span>

      <el-tabs v-model="tab">
        <el-tab-pane
          name="politicaNegociacao"
          label="Políticas de alçada e limites de negociações"
        >
          <FormularioPoliticaNegociacao ref="politicaNegociacao" />
        </el-tab-pane>

        <el-tab-pane
          name="mapearEstrategias"
          label="Mapeamento de estratégias"
        >
          <FormularioMapearEstrategias ref="mapearEstrategias" />
        </el-tab-pane>

        <el-tab-pane
          name="regrasPreNegociacao"
          label="Regras de Pré Negociação"
        >
          <FormularioRegrasPreNegociacao ref="regrasPreNegociacao" />
        </el-tab-pane>
      </el-tabs>
    </article>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        @click="close"
      >
        Voltar
      </el-button>

      <el-button
        type="primary"
        size="mini"
        @click="save"
      >
        Salvar
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { copyToClipboard } from '@/utils'

export default {
  components: {
    FormularioMapearEstrategias: () => import('./partials/FormularioMapearEstrategias'),
    FormularioPoliticaNegociacao: () => import('./partials/FormularioPoliticaNegociacao'),
    FormularioRegrasPreNegociacao: () => import('./partials/FormularioRegrasPreNegociacao')
  },

  data: () => ({
    dialogVisible: false,
    loading: false,
    tab: 'politicaNegociacao'
  }),

  methods: {
    copyToClipboard,

    open() {
      this.dialogVisible = true
    },

    save() {
      this.$refs[this.tab].save()
        .then(this.next)
        .catch(error => this.$jusNotification({ error }))
    },

    next() {
      switch (this.tab) {
        case 'politicaNegociacao':
          this.tab = 'mapearEstrategias'
          break
        case 'mapearEstrategias':
          this.tab = 'regrasPreNegociacao'
          break
        default:
          this.$jusNotification({
            message: 'Configurações de integração salvas com sucesso!',
            type: 'success'
          })
          this.close()
      }
    },

    close() {
      console.log('close')
      this.dialogVisible = false
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

<template>
  <article class="mapear-estrategiar__container">
    <header class="mapear-estrategiar__titulo">
      Configure como o sistema irá selecionar as estratégias nos casos que irão ser importados via integrações.

      Note que a estratégia padrão será <strong>manual</strong>.
    </header>

    <el-table
      :data="estrategias"
      style="width: 100%"
      size="mini"
      stripe
      border
    >
      <el-table-column label="Estratégia">
        <span slot-scope="scope">
          {{ scope.row.estrategia.nome }}
        </span>
      </el-table-column>

      <el-table-column label="Descrição">
        <span slot-scope="scope">
          {{ descricao(scope.row.condicoes) }}
        </span>
      </el-table-column>

      <el-table-column
        fixed="right"
        width="64"
      >
        <el-button
          slot-scope="scope"
          type="danger"
          icon="el-icon-delete"
          circle
          plain
          @click="removerEstrategia(scope.row)"
        />
      </el-table-column>
    </el-table>

    <footer class="mapear-estrategiar__rodape">
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        @click="adicionarMapeamento"
      >
        Adicionar mapeamento
      </el-button>
    </footer>

    <DialogMapearEstrategia ref="mapearEstrategia" />
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    DialogMapearEstrategia: () => import('./DialogMapearEstrategia')
  },

  computed: {
    ...mapGetters({ estrategias: 'getIntegrationEstrategias' }),

    descricao() {
      return (condicoes = []) => (condicoes.map(({ campo, operador, valor }) => `${campo.nome} ${operador} ${valor}`).join('; ')) + '.'
    }
  },

  mounted() {
    this.buscarEstrategias()
  },

  methods: {
    ...mapActions({
      buscarEstrategias: 'getIntegrationEstrategias',
      salvarEstrategias: 'saveIntegrationEstrategias'
    }),

    save() {
      return Promise.resolve()
    },

    adicionarMapeamento() {
      this.$refs.mapearEstrategia.open(this.mapearEstrategia)
    },

    mapearEstrategia(estrategia) {
      this.salvarEstrategias({
        estrategias: [...this.estrategias, estrategia]
      }).then(() => this.$jusNotification({
        type: 'success',
        messae: 'Mapeamento salvo com sucesso!'
      })).catch(error => this.$jusNotification({ error }))
    },

    removerEstrategia(estrategia) {
      this.estrategias.splice(this.estrategias.indexOf(estrategia), 1)

      this.salvarEstrategias({ estrategias: this.estrategias }).then(() => this.$jusNotification({
        type: 'success',
        messae: 'Mapeamento salvo com sucesso!'
      })).catch(error => this.$jusNotification({ error }))
    }
  }
}
</script>

<style lang="scss" scoped>
.mapear-estrategiar__container {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .mapear-estrategiar__rodape {
    text-align: center;
  }
}
</style>

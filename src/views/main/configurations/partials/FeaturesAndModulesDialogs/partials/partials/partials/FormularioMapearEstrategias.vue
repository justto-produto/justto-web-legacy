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
        <template slot-scope="scope">
          {{ scope.row.estrategia.nome }}
        </template>
      </el-table-column>

      <el-table-column label="Descrição">
        <template slot-scope="scope">
          {{ descricao(scope.row.descricoes) }}
        </template>
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
      return (descricoes = []) => (descricoes.map(({ campo, operador, valor }) => `${campo.nome} ${operador} ${valor}`).join('; ')) + '.'
    }
  },

  methods: {
    ...mapActions({ salvarEstrategias: 'saveIntegrationEstrategias' }),

    save() {
      return Promise.resolve()
    },

    adicionarMapeamento() {
      this.$refs.mapearEstrategia.open(this.mapearEstrategia)
    },

    mapearEstrategia(estrategia) {
      this.salvarEstrategias([...this.estrategias, estrategia])
        .then(() => this.$jusNotification({
          type: 'success',
          messae: 'Mapeamento salvo com sucesso!'
        }))
        .catch(error => this.$jusNotification({ error }))
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

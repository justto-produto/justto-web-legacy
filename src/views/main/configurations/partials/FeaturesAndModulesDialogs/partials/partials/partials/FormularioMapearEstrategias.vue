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
      <el-table-column
        prop="date"
        label="Estratégia"
      />

      <el-table-column
        prop="name"
        label="Descrição"
      />
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
export default {
  components: {
    DialogMapearEstrategia: () => import('./DialogMapearEstrategia')
  },

  data: () => ({
    estrategias: []
  }),

  methods: {
    save() {
      return Promise.resolve()
    },

    adicionarMapeamento() {
      this.$refs.mapearEstrategia.open(this.mapearEstrategia)
    },

    mapearEstrategia({ estrategia, descricao }) {
      console.log(estrategia, descricao)
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

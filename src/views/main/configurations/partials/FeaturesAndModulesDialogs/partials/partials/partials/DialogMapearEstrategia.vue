<template>
  <el-dialog
    title="Adicionar mapeamento"
    :visible.sync="visivel"
    width="auto"
    append-to-body
    destroy-on-close
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formulario">
      <el-form-item
        label="Estratégia"
        prop="estrategia"
      >
        <el-select
          v-model="formulario.estrategia"
          filterable
          clearable
        >
          <el-option
            v-for="({ id, name }) in estrategias"
            :key="id"
            :label="name"
            :value="id"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="Descrição"
        prop="descricao"
      >
        <el-input v-model="formulario.descricao" />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button
        size="mini"
        @click="close"
      >
        Cancelar
      </el-button>

      <el-button
        type="primary"
        icon="el-icon-plus"
        size="mini"
      >
        Adicionar
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data: () => ({
    visivel: false,
    formulario: {
      estrategia: null,
      descricao: ''
    },
    acao: () => {}
  }),

  computed: {
    ...mapGetters({
      estrategias: 'getMyStrategiesLite'
    })
  },

  beforeMount() {
    this.getMyStrategiesLite()
  },

  methods: {
    ...mapActions(['getMyStrategiesLite']),

    open(acao) {
      this.visivel = true
      this.acao = acao
    },

    close() {
      this.visivel = true
      this.acao = () => {}
      this.formulario = {
        estrategia: null,
        descricao: ''
      }
    }
  }
}
</script>

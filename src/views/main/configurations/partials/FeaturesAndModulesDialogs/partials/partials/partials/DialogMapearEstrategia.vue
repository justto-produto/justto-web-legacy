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
    <div class="formulario-estrategia">
      <div class="formulario-estrategia__item">
        <span class="formulario-estrategia__item-title">
          Estratégia:
        </span>

        <el-select
          v-model="formulario.estrategia.id"
          class="formulario-estrategia__item-body"
          size="small"
          filterable
          clearable
          @change="inserirNomeEstrategia"
        >
          <el-option
            v-for="({ id, name }) in estrategias"
            :key="id"
            :label="name"
            :value="id"
          />
        </el-select>
      </div>

      <div class="formulario-estrategia__item">
        <span class="formulario-estrategia__item-title">
          Descrição:
        </span>

        <el-table
          :data="formulario.condicoes"
          style="width: 100%"
          size="mini"
          stripe
          border
        >
          <el-table-column
            label="Nome"
            prop="campo.nome"
          />

          <el-table-column
            label="Operador"
            prop="operador"
          />

          <el-table-column
            label="Valor"
            prop="valor"
          />
        </el-table>
      </div>

      <div class="formulario-estrategia__item inline-form-item">
        <el-select
          v-model="descricao.campo.nome"
          class="auto-width"
          size="small"
          @change="inserirTipoDeCampo"
        >
          <el-option
            v-for="campo in campos"
            :key="campo.nome"
            :label="campo.nome"
            :value="campo.nome"
          />
        </el-select>

        <el-select
          v-model="descricao.operador"
          :disabled="!descricao.campo.tipo"
          class="auto-width"
          size="small"
        >
          <el-option
            v-for="operador in operadores"
            :key="operador"
            :label="operador"
            :value="operador"
          />
        </el-select>

        <el-select
          v-if="descricao.campo.tipo === 'select'"
          v-model="descricao.valor"
          class="auto-width"
          size="small"
        >
          <el-option
            v-for="tipoDeNegociacao in tiposDeNegociacoes"
            :key="tipoDeNegociacao"
            :label="tipoDeNegociacao"
            :value="tipoDeNegociacao"
          />
        </el-select>

        <el-input-number
          v-else-if="descricao.campo.tipo === 'number'"
          v-model="descricao.valor"
          controls-position="right"
          class="auto-width"
          size="small"
        />

        <div
          v-else-if="descricao.campo.tipo === 'money'"
          class="el-input el-input--small auto-width"
        >
          <money
            v-model="descricao.valor"
            class="el-input__inner"
            data-testid="counterproposal-value-input"
            maxlength="16"
          />
        </div>

        <el-input
          v-else
          v-model="descricao.valor"
          :disabled="!descricao.campo.tipo"
          class="auto-width"
          size="small"
        />

        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="adicionarDescricao"
        />
      </div>
    </div>

    <span slot="footer">
      <el-button
        size="mini"
        @click="close"
      >
        Cancelar
      </el-button>

      <el-button
        :disabled="!formulario.estrategia.id"
        type="primary"
        size="mini"
        @click="adicionar"
      >
        Salvar
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
      estrategia: { id: null, nome: '' },
      condicoes: []
    },

    descricao: {
      campo: { nome: '', tipo: '' },
      operador: '',
      valor: null
    },

    acao: () => {}
  }),

  computed: {
    ...mapGetters({ estrategias: 'getMyStrategiesLite' }),

    campos() {
      return [
        { nome: 'Valor Alcada', tipo: 'money' },
        { nome: 'Réu', tipo: 'text' },
        { nome: 'Objeto negociado', tipo: 'text' },
        { nome: 'Tipos de negociações', tipo: 'select' }
      ]
    },

    operadores() {
      if (this.descricao.campo.tipo === 'select') {
        return ['igual', 'diferente']
      }

      if (this.descricao.campo.tipo === 'text') {
        return ['é', 'contem', 'não é', 'não contem']
      }

      return [
        'menor',
        'maior',
        'menor ou igual',
        'maior ou igual'
      ]
    },

    tiposDeNegociacoes() {
      return [
        'PROCON',
        'PROCESSO'
      ]
    }
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
      this.visivel = false

      this.acao = () => {}
      this.formulario = {
        estrategia: { id: null, nome: '' },
        condicoes: []
      }
      this.descricao = {
        campo: { nome: '', tipo: '' },
        operador: '',
        valor: null
      }
    },

    encontrarDescricao() {
      this.formulario.condicoes = [
        {
          campo: { nome: 'valorAlcada', tipo: 'number' },
          operador: '<=',
          valor: 0
        },
        {
          campo: { nome: 'valorAlcada', tipo: 'number' },
          operador: '<=',
          valor: 0
        }
      ]
    },

    inserirTipoDeCampo(nome) {
      this.descricao.campo.tipo = this.campos.find(campo => campo.nome === nome)?.tipo
      this.descricao.valor = ['money', 'number'].includes(this.descricao.campo.tipo) ? 0 : ''
      this.descricao.operador = ''
    },

    adicionarDescricao() {
      this.formulario.condicoes.push(this.descricao)
      this.descricao = {
        campo: { nome: '', tipo: '' },
        operador: '',
        valor: null
      }
    },

    adicionar() {
      this.acao(this.formulario)
      this.close()
    },

    inserirNomeEstrategia() {
      this.formulario.estrategia.nome = this.estrategias.find(estrategia => estrategia.id === this.formulario.estrategia.id)?.name || ''
    }
  }
}
</script>

<style lang="scss">
.formulario-estrategia {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .formulario-estrategia__item {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &-title {
      font-weight: bold;
    }

    &-body {
      display: flex;
      flex-direction: column;
      gap: 4px;

    }

    &.inline-form-item {
      flex-direction: row;
      align-items: center;
    }
  }
}
</style>

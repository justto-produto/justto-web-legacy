<template>
  <el-form label-position="right">
    <el-form-item>
      <p>
        Marque quais tipos de casos devem ser pré negociados:
      </p>
    </el-form-item>

    <el-checkbox
      v-model="form.semAlcada"
      label="Sem alçada"
      border
    />

    <el-checkbox
      v-model="form.advogadoContumaz"
      label="Advogado contumaz"
      border
    />

    <el-checkbox
      v-model="form.semEstrategia"
      label="Sem estratégia"
      border
    />
  </el-form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data: () => ({
    form: {
      semAlcada: false,
      advogadoContumaz: false,
      semEstrategia: false
    }
  }),

  mounted() {
    this.init()
  },

  methods: {
    ...mapActions([
      'salvarIntegracaoPreNegociacao',
      'buscarIntegracaoPreNegociacao'
    ]),

    init() {
      this.buscarIntegracaoPreNegociacao().then(({ preNegociacao }) => {
        this.form.semAlcada = preNegociacao?.semAlcada || false
        this.form.advogadoContumaz = preNegociacao?.advogadoContumaz || false
        this.form.semEstrategia = preNegociacao?.semEstrategia || false
      }).catch(error => this.$jusNotification({ error }))
    },

    save() {
      return this.salvarIntegracaoPreNegociacao({ preNegociacao: this.form })
    }
  }
}
</script>

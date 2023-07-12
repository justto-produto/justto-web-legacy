<template>
  <el-form label-position="right">
    <el-form-item>
      <p>
        Marque quais tipos de casos devem ser pré negociados:
      </p>
    </el-form-item>

    <el-checkbox
      v-model="form.PROJURIS_SOAP_PRE_NEGOCIAR_SEM_ALCADA"
      label="Sem alçada"
      border
    />

    <el-checkbox
      v-model="form.PROJURIS_SOAP_PRE_NEGOCIAR_ADVOGADO_CONTUMAZ"
      label="Advogado contumaz"
      border
    />

    <el-checkbox
      v-model="form.PROJURIS_SOAP_PRE_NEGOCIAR_SEM_ESTRATEGIA"
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
      PROJURIS_SOAP_PRE_NEGOCIAR_SEM_ALCADA: false,
      PROJURIS_SOAP_PRE_NEGOCIAR_ADVOGADO_CONTUMAZ: false,
      PROJURIS_SOAP_PRE_NEGOCIAR_SEM_ESTRATEGIA: false
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
        this.form.PROJURIS_SOAP_PRE_NEGOCIAR_SEM_ALCADA = preNegociacao?.PROJURIS_SOAP_PRE_NEGOCIAR_SEM_ALCADA || false
        this.form.PROJURIS_SOAP_PRE_NEGOCIAR_ADVOGADO_CONTUMAZ = preNegociacao?.PROJURIS_SOAP_PRE_NEGOCIAR_ADVOGADO_CONTUMAZ || false
        this.form.PROJURIS_SOAP_PRE_NEGOCIAR_SEM_ESTRATEGIA = preNegociacao?.PROJURIS_SOAP_PRE_NEGOCIAR_SEM_ESTRATEGIA || false
      }).catch(error => this.$jusNotification({ error }))
    },

    save() {
      return this.salvarIntegracaoPreNegociacao({ preNegociacao: this.form })
    }
  }
}
</script>

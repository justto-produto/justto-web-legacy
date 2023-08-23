<template>
  <el-form
    label-position="top"
    class="regras-pre-negociacao__form"
  >
    <el-form-item>
      <div slot="label">
        Selecione abaixo os cenários que você quer que sejam avaliados manualmente antes de iniciar as negociações.
      </div>

      <small>
        *Estes casos irão para uma fase anterior do funil chamada <strong>"Pré Negociação”</strong>.
      </small>
    </el-form-item>

    <el-checkbox
      v-model="form.semAlcada"
      label="Sem alçada"
    />

    <el-checkbox
      v-model="form.advogadoContumaz"
      label="Advogado contumaz"
    />

    <el-checkbox
      v-model="form.semEstrategia"
      label="Sem estratégia"
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

    async init() {
      try {
        this.form = await this.buscarIntegracaoPreNegociacao()
      } catch (error) { this.$jusNotification({ error }) }
    },

    save() {
      return this.salvarIntegracaoPreNegociacao({ ...this.form })
    }
  }
}
</script>

<style lang="scss" scoped>
.regras-pre-negociacao__form {
  text-align: center !important;
}
</style>
